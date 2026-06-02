/**
 * RFC 6901 JSON Pointer get / set / remove over a parsed schema object.
 *
 * All mutating helpers are pure — they return a new document produced with
 * immer, so callers (reducers, source-pane sync) never mutate shared state.
 * Key order is preserved because immer copies objects key-by-key.
 */
import { produce } from 'immer';
import type { JsonPointer } from '../types';

/** Encode a single reference token per RFC 6901 (~ -> ~0, / -> ~1). */
export function encodeToken(token: string): string {
  return token.replace(/~/g, '~0').replace(/\//g, '~1');
}

/** Decode a single reference token per RFC 6901. */
export function decodeToken(token: string): string {
  return token.replace(/~1/g, '/').replace(/~0/g, '~');
}

/** Split a pointer string into decoded tokens. "" -> []. */
export function parsePointer(pointer: JsonPointer): string[] {
  if (pointer === '' || pointer === '#') return [];
  if (!pointer.startsWith('/')) {
    // tolerate fragment form "#/a/b"
    pointer = pointer.replace(/^#/, '');
  }
  return pointer
    .split('/')
    .slice(1)
    .map(decodeToken);
}

/** Build a pointer string from decoded tokens. [] -> "". */
export function buildPointer(tokens: Array<string | number>): JsonPointer {
  if (tokens.length === 0) return '';
  return '/' + tokens.map((t) => encodeToken(String(t))).join('/');
}

/** Append a token to an existing pointer. */
export function joinPointer(pointer: JsonPointer, token: string | number): JsonPointer {
  return pointer + '/' + encodeToken(String(token));
}

/** The parent pointer and the final token, or null at the root. */
export function splitParent(
  pointer: JsonPointer,
): { parent: JsonPointer; key: string } | null {
  const tokens = parsePointer(pointer);
  if (tokens.length === 0) return null;
  const key = tokens[tokens.length - 1];
  return { parent: buildPointer(tokens.slice(0, -1)), key };
}

/** Get the value addressed by a pointer, or undefined if any segment is missing. */
export function getAtPointer<T = unknown>(doc: unknown, pointer: JsonPointer): T | undefined {
  const tokens = parsePointer(pointer);
  let cur: unknown = doc;
  for (const token of tokens) {
    if (cur == null || typeof cur !== 'object') return undefined;
    if (Array.isArray(cur)) {
      const idx = Number(token);
      if (!Number.isInteger(idx)) return undefined;
      cur = cur[idx];
    } else {
      cur = (cur as Record<string, unknown>)[token];
    }
  }
  return cur as T;
}

/** Does the pointer address an existing location? */
export function hasPointer(doc: unknown, pointer: JsonPointer): boolean {
  return getAtPointer(doc, pointer) !== undefined;
}

/**
 * Return a new document with `value` set at `pointer`. Intermediate objects
 * are NOT auto-created; the parent must already exist (this keeps "open object"
 * nodes from being silently filled in).
 */
export function setAtPointer<T extends object>(
  doc: T,
  pointer: JsonPointer,
  value: unknown,
): T {
  const tokens = parsePointer(pointer);
  if (tokens.length === 0) return value as T;
  return produce(doc, (draft) => {
    let cur: any = draft;
    for (let i = 0; i < tokens.length - 1; i++) {
      cur = cur[tokens[i]];
      if (cur == null || typeof cur !== 'object') {
        throw new Error(`setAtPointer: parent missing at "${tokens[i]}" in "${pointer}"`);
      }
    }
    const last = tokens[tokens.length - 1];
    if (Array.isArray(cur)) cur[Number(last)] = value;
    else cur[last] = value;
  });
}

/** Return a new document with the value at `pointer` removed. */
export function removeAtPointer<T extends object>(doc: T, pointer: JsonPointer): T {
  const tokens = parsePointer(pointer);
  if (tokens.length === 0) return doc;
  return produce(doc, (draft) => {
    let cur: any = draft;
    for (let i = 0; i < tokens.length - 1; i++) {
      cur = cur?.[tokens[i]];
      if (cur == null || typeof cur !== 'object') return;
    }
    const last = tokens[tokens.length - 1];
    if (Array.isArray(cur)) cur.splice(Number(last), 1);
    else delete cur[last];
  });
}

/**
 * Rename a key inside the object at `parentPointer` from `oldKey` to `newKey`
 * while preserving insertion order. Returns a new document.
 */
export function renameKey<T extends object>(
  doc: T,
  parentPointer: JsonPointer,
  oldKey: string,
  newKey: string,
): T {
  if (oldKey === newKey) return doc;
  return produce(doc, (draft) => {
    const parent: any = parentPointer === ''
      ? draft
      : getAtPointer(draft as object, parentPointer);
    if (parent == null || typeof parent !== 'object' || Array.isArray(parent)) return;
    if (!(oldKey in parent)) return;
    // Rebuild the object so the renamed key keeps its position.
    const rebuilt: Record<string, unknown> = {};
    for (const k of Object.keys(parent)) {
      if (k === oldKey) rebuilt[newKey] = parent[oldKey];
      else rebuilt[k] = parent[k];
      delete parent[k];
    }
    Object.assign(parent, rebuilt);
  });
}

/** Move an array element from one index to another (reorder). Returns a new doc. */
export function reorderArray<T extends object>(
  doc: T,
  arrayPointer: JsonPointer,
  from: number,
  to: number,
): T {
  return produce(doc, (draft) => {
    const arr: any = arrayPointer === '' ? draft : getAtPointer(draft as object, arrayPointer);
    if (!Array.isArray(arr)) return;
    if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return;
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
  });
}
