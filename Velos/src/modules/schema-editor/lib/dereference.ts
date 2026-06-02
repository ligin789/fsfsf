/**
 * Local + external $ref inlining — mirrors Apicurio v3 `references=DEREFERENCE`.
 *
 * - Internal refs (`#/...`) are resolved against the document itself.
 * - External refs (anything not starting with `#`) are fetched through the
 *   RegistryClient's `getArtifactDereferenced`.
 * - Supports whole-schema, definition-level (`#/$defs/X`) and property-level
 *   (`#/$defs/X/properties/y`) targets, since every internal ref is just a
 *   JSON Pointer into the document.
 * - Circular refs never infinite-loop: a ref currently being expanded in the
 *   ancestor chain is left as `{ "$ref": ... }`.
 *
 * The raw, ref'd document remains the editable source of truth; dereferencing
 * always produces a *new* document.
 */
import { produce } from 'immer';
import type { JsonSchema, RegistryClient } from '../types';
import { getAtPointer } from './pointer';
import { parseRef } from './refs';

function isRefNode(node: unknown): node is { $ref: string } {
  return (
    node != null &&
    typeof node === 'object' &&
    typeof (node as Record<string, unknown>).$ref === 'string'
  );
}

/** Deep clone via JSON round-trip (schema nodes are plain JSON). */
function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

/**
 * Synchronously inline all *internal* refs. External refs are left untouched
 * (use `dereference` with a client for those). Produces a `$defs`-free document
 * when every ref was internal and resolvable.
 */
export function dereferenceLocal(schema: JsonSchema): JsonSchema {
  const root = schema;

  const expand = (node: unknown, activePointers: Set<string>): unknown => {
    if (node == null || typeof node !== 'object') return node;

    if (Array.isArray(node)) {
      return node.map((item) => expand(item, activePointers));
    }

    if (isRefNode(node)) {
      const parsed = parseRef(node.$ref);
      if (parsed.external || parsed.pointer == null) {
        return clone(node); // leave external refs for the async pass
      }
      if (activePointers.has(parsed.pointer)) {
        // cycle — keep the ref rather than recursing forever
        return clone(node);
      }
      const target = getAtPointer<JsonSchema>(root, parsed.pointer);
      if (target === undefined) return clone(node); // dangling ref, keep it
      const next = new Set(activePointers);
      next.add(parsed.pointer);
      // merge any sibling keywords on the ref node (rare, but preserve them)
      const { $ref: _omit, ...siblings } = node as Record<string, unknown>;
      const expanded = expand(target, next) as Record<string, unknown>;
      return { ...expanded, ...siblings };
    }

    const obj = node as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      // Drop $defs from the dereferenced output — everything is inlined.
      if (key === '$defs') continue;
      out[key] = expand(obj[key], activePointers);
    }
    return out;
  };

  return expand(root, new Set<string>()) as JsonSchema;
}

/**
 * Full dereference: inline internal refs locally, then fetch + inline external
 * refs through the registry client. Returns a new document.
 *
 * External ref strings are expected to be Apicurio coordinates of the form
 * `<groupId>/<artifactId>[:<version>]` (or a bare artifactId).
 */
export async function dereference(
  schema: JsonSchema,
  client?: RegistryClient,
): Promise<JsonSchema> {
  // First pass: resolve everything internal.
  let result = dereferenceLocal(schema);
  if (!client) return result;

  // Collect remaining external refs.
  const externalRefs = new Set<string>();
  const collect = (node: unknown) => {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(collect);
    if (isRefNode(node) && parseRef(node.$ref).external) externalRefs.add(node.$ref);
    for (const v of Object.values(node as Record<string, unknown>)) collect(v);
  };
  collect(result);
  if (externalRefs.size === 0) return result;

  // Fetch each external artifact (already dereferenced by the registry).
  const fetched = new Map<string, JsonSchema>();
  await Promise.all(
    [...externalRefs].map(async (ref) => {
      const { groupId, artifactId, version } = parseExternalRef(ref);
      try {
        const artifact = await client.getArtifactDereferenced(groupId, artifactId, version);
        fetched.set(ref, artifact);
      } catch {
        /* leave the ref in place if the fetch fails */
      }
    }),
  );

  result = produce(result, (draft) => {
    const replace = (node: any) => {
      if (node == null || typeof node !== 'object') return;
      if (Array.isArray(node)) return node.forEach(replace);
      if (isRefNode(node) && fetched.has(node.$ref)) {
        const target = clone(fetched.get(node.$ref)!);
        delete (node as Record<string, unknown>).$ref;
        Object.assign(node, target);
      }
      for (const v of Object.values(node)) replace(v);
    };
    replace(draft);
  });

  return result;
}

/** Parse an external ref string into Apicurio coordinates. */
export function parseExternalRef(ref: string): {
  groupId: string;
  artifactId: string;
  version?: string;
} {
  // strip any URL scheme / registry host, keep the coordinate path
  let coord = ref;
  const schemeIdx = coord.indexOf('://');
  if (schemeIdx >= 0) {
    const afterScheme = coord.slice(schemeIdx + 3);
    const slash = afterScheme.indexOf('/');
    coord = slash >= 0 ? afterScheme.slice(slash + 1) : afterScheme;
  }
  let version: string | undefined;
  const colon = coord.lastIndexOf(':');
  if (colon >= 0) {
    version = coord.slice(colon + 1);
    coord = coord.slice(0, colon);
  }
  const parts = coord.split('/');
  if (parts.length >= 2) {
    return { groupId: parts[0], artifactId: parts.slice(1).join('/'), version };
  }
  return { groupId: 'default', artifactId: coord, version };
}
