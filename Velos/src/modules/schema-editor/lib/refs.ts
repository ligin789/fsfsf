/**
 * `$ref` parsing / resolution, `$defs` usage graph, cycle detection.
 *
 * Internal refs use the `#/$defs/<name>` fragment form. External refs are any
 * `$ref` that does not start with `#` (resolved via the RegistryClient).
 */
import { produce } from 'immer';
import type { DefUsage, JsonPointer, JsonSchema } from '../types';
import { buildPointer, getAtPointer, parsePointer } from './pointer';

export interface ParsedRef {
  raw: string;
  /** true when the ref points outside this document. */
  external: boolean;
  /** Local JSON Pointer (e.g. "/$defs/Traveler") when internal. */
  pointer?: JsonPointer;
  /** Def name when the ref is `#/$defs/<name>`. */
  defName?: string;
}

/** Parse a `$ref` string. */
export function parseRef(ref: string): ParsedRef {
  if (!ref.startsWith('#')) {
    return { raw: ref, external: true };
  }
  const fragment = ref.slice(1); // drop leading '#'
  const pointer = fragment === '' ? '' : fragment;
  const tokens = parsePointer(pointer);
  let defName: string | undefined;
  if (tokens.length >= 2 && tokens[0] === '$defs') defName = tokens[1];
  return { raw: ref, external: false, pointer, defName };
}

/** Build an internal ref for a def name. */
export function defRef(name: string): string {
  return `#/$defs/${name}`;
}

/** List the names of all entries under `$defs`. */
export function listDefs(schema: JsonSchema | null): string[] {
  if (!schema?.$defs) return [];
  return Object.keys(schema.$defs);
}

/**
 * Walk the whole document and invoke `visit` for every `{ "$ref": string }`
 * node, passing the pointer to that node and the ref string.
 */
export function walkRefs(
  schema: unknown,
  visit: (pointer: JsonPointer, ref: string) => void,
  base: Array<string | number> = [],
): void {
  if (schema == null || typeof schema !== 'object') return;
  if (Array.isArray(schema)) {
    schema.forEach((item, i) => walkRefs(item, visit, [...base, i]));
    return;
  }
  const obj = schema as Record<string, unknown>;
  if (typeof obj.$ref === 'string') {
    visit(buildPointer(base), obj.$ref);
  }
  for (const key of Object.keys(obj)) {
    walkRefs(obj[key], visit, [...base, key]);
  }
}

/** All usages of a given def name (`#/$defs/<name>` and deeper paths into it). */
export function defUsages(schema: JsonSchema | null, defName: string): DefUsage[] {
  if (!schema) return [];
  const out: DefUsage[] = [];
  const prefix = `#/$defs/${defName}`;
  walkRefs(schema, (pointer, ref) => {
    if (ref === prefix || ref.startsWith(prefix + '/')) {
      out.push({ pointer, ref });
    }
  });
  return out;
}

/** Usage counts for every def. */
export function defUsageCounts(schema: JsonSchema | null): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const name of listDefs(schema)) counts[name] = defUsages(schema, name).length;
  return counts;
}

/** True when no other location references the def (safe to delete). */
export function canDeleteDef(schema: JsonSchema | null, defName: string): boolean {
  // A def referencing only itself does not block its own deletion.
  return defUsages(schema, defName).every((u) =>
    u.pointer.startsWith(`/$defs/${escapeToken(defName)}/`) ||
    u.pointer === `/$defs/${escapeToken(defName)}`,
  );
}

function escapeToken(token: string): string {
  return token.replace(/~/g, '~0').replace(/\//g, '~1');
}

/**
 * Rename a def: rename the `$defs.<old>` key and rewrite every
 * `#/$defs/<old>` (and `#/$defs/<old>/...`) ref to point at `<new>`.
 * Returns a new document. No-op if `newName` already exists.
 */
export function renameDef(schema: JsonSchema, oldName: string, newName: string): JsonSchema {
  if (oldName === newName) return schema;
  if (!schema.$defs || !(oldName in schema.$defs)) return schema;
  if (newName in schema.$defs) return schema;

  return produce(schema, (draft) => {
    // 1. Rebuild $defs preserving key order, renaming the one key.
    const defs = draft.$defs as Record<string, JsonSchema>;
    const rebuilt: Record<string, JsonSchema> = {};
    for (const k of Object.keys(defs)) {
      if (k === oldName) rebuilt[newName] = defs[oldName];
      else rebuilt[k] = defs[k];
      delete defs[k];
    }
    Object.assign(defs, rebuilt);

    // 2. Rewrite every ref. We collect pointers first (against the draft),
    //    then patch in place.
    const oldPrefix = `#/$defs/${oldName}`;
    const newPrefix = `#/$defs/${newName}`;
    const patches: Array<{ pointer: JsonPointer; ref: string }> = [];
    walkRefs(draft, (pointer, ref) => {
      if (ref === oldPrefix || ref.startsWith(oldPrefix + '/')) {
        patches.push({ pointer, ref: newPrefix + ref.slice(oldPrefix.length) });
      }
    });
    for (const { pointer, ref } of patches) {
      const node = getAtPointer<Record<string, unknown>>(draft as object, pointer);
      if (node) node.$ref = ref;
    }
  });
}

/**
 * Detect circular references in the `$defs` graph. Returns the set of def names
 * that participate in at least one cycle.
 */
export function detectCircularDefs(schema: JsonSchema | null): Set<string> {
  const inCycle = new Set<string>();
  if (!schema?.$defs) return inCycle;

  // Build adjacency: def -> set of defs it references.
  const edges: Record<string, Set<string>> = {};
  for (const name of listDefs(schema)) {
    const node = schema.$defs[name];
    const targets = new Set<string>();
    walkRefs(node, (_p, ref) => {
      const parsed = parseRef(ref);
      if (!parsed.external && parsed.defName) targets.add(parsed.defName);
    });
    edges[name] = targets;
  }

  const WHITE = 0, GREY = 1, BLACK = 2;
  const color: Record<string, number> = {};
  const stack: string[] = [];

  const dfs = (n: string) => {
    color[n] = GREY;
    stack.push(n);
    for (const m of edges[n] ?? []) {
      if (color[m] === GREY) {
        // back-edge -> everything from m to top of stack is in a cycle
        const idx = stack.indexOf(m);
        if (idx >= 0) for (let i = idx; i < stack.length; i++) inCycle.add(stack[i]);
      } else if ((color[m] ?? WHITE) === WHITE) {
        dfs(m);
      }
    }
    stack.pop();
    color[n] = BLACK;
  };

  for (const name of Object.keys(edges)) {
    if ((color[name] ?? WHITE) === WHITE) dfs(name);
  }
  return inCycle;
}

/**
 * Resolve a single internal ref to the node it points at (one hop, no
 * recursion). Returns undefined for external refs or dangling pointers.
 */
export function resolveInternalRef(
  schema: JsonSchema,
  ref: string,
): JsonSchema | undefined {
  const parsed = parseRef(ref);
  if (parsed.external || parsed.pointer == null) return undefined;
  return getAtPointer<JsonSchema>(schema, parsed.pointer);
}
