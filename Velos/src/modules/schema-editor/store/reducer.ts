/**
 * The module reducer (default export).
 *
 * Implemented with RTK `createSlice` so it plugs straight into the host's
 * `configureStore`. The slice `name` is `@schema-editor`, which makes every
 * generated action type `@schema-editor/<name>` — matching `actionTypes.ts`
 * and keeping the host store collision-free.
 *
 * Core design rule: we operate on the parsed schema object addressed by JSON
 * Pointer; the tree is derived from this object, never a parallel model.
 * Unknown keywords (`domain`, `$id`, `example`, type-less `enum` nodes …) ride
 * along untouched because every edit is a targeted pointer mutation.
 */
import { createSlice, current, type PayloadAction } from '@reduxjs/toolkit';
import type { JsonSchema, JsonPointer, ValidationError } from '../types';
import { initialState, MAX_HISTORY } from './initialState';
import {
  getAtPointer,
  removeAtPointer as removeAt,
  renameKey as renameKeyAt,
  reorderArray as reorderAt,
  setAtPointer as setAt,
  splitParent,
} from '../lib/pointer';
import { renameDef as renameDefIn } from '../lib/refs';

/** Snapshot the current schema onto the undo stack and clear redo. */
function pushHistory(state: typeof initialState): void {
  if (state.schema == null) return;
  state.undoStack.push(current(state.schema) as JsonSchema);
  if (state.undoStack.length > MAX_HISTORY) state.undoStack.shift();
  state.redoStack = [];
  state.dirty = true;
}

const slice = createSlice({
  name: '@schema-editor',
  initialState,
  reducers: {
    /** Seed the slice (load). Resets history + dirty. */
    loadSchema(state, action: PayloadAction<JsonSchema>) {
      state.schema = action.payload;
      state.selectedPointer = '';
      state.dirty = false;
      state.undoStack = [];
      state.redoStack = [];
      state.sourceError = null;
    },

    /** Replace the whole document as a single undoable edit. */
    replaceSchema(state, action: PayloadAction<JsonSchema>) {
      pushHistory(state);
      state.schema = action.payload;
    },

    /** Apply a parsed document coming from the source pane. */
    setFromSource(state, action: PayloadAction<JsonSchema>) {
      pushHistory(state);
      state.schema = action.payload;
      state.sourceError = null;
    },

    selectNode(state, action: PayloadAction<JsonPointer>) {
      state.selectedPointer = action.payload;
    },

    setAtPointer(
      state,
      action: PayloadAction<{ pointer: JsonPointer; value: unknown }>,
    ) {
      if (state.schema == null) return;
      pushHistory(state);
      state.schema = setAt(current(state.schema) as JsonSchema, action.payload.pointer, action.payload.value);
    },

    removeAtPointer(state, action: PayloadAction<JsonPointer>) {
      if (state.schema == null) return;
      pushHistory(state);
      const pointer = action.payload;
      // If we delete a `properties.<key>`, also drop it from the owning
      // object's `required[]` so the document stays consistent.
      const sp = splitParent(pointer);
      let next = removeAt(current(state.schema) as JsonSchema, pointer);
      if (sp && sp.parent.endsWith('/properties')) {
        const objPtr = objPtrFix(sp.parent);
        const obj = getAtPointer<JsonSchema>(next, objPtr);
        if (obj?.required?.includes(sp.key)) {
          const remaining = obj.required.filter((k) => k !== sp.key);
          next =
            remaining.length === 0
              ? removeAt(next, objPtr + '/required')
              : setAt(next, objPtr + '/required', remaining);
        }
      }
      state.schema = next;
      if (state.selectedPointer === pointer) state.selectedPointer = '';
    },

    renameKey(
      state,
      action: PayloadAction<{ parent: JsonPointer; oldKey: string; newKey: string }>,
    ) {
      if (state.schema == null) return;
      const { parent, oldKey, newKey } = action.payload;
      if (!newKey || oldKey === newKey) return;
      pushHistory(state);
      let next = renameKeyAt(current(state.schema) as JsonSchema, parent, oldKey, newKey);
      // keep parent.required[] in sync when renaming a property
      if (parent.endsWith('/properties')) {
        const objPtr = parent.slice(0, -'/properties'.length);
        const obj = getAtPointer<JsonSchema>(next, objPtr);
        if (obj?.required) {
          next = setAt(next, objPtr + '/required', obj.required.map((k) => (k === oldKey ? newKey : k)));
        }
      }
      state.schema = next;
    },

    renameDef(state, action: PayloadAction<{ oldName: string; newName: string }>) {
      if (state.schema == null) return;
      const { oldName, newName } = action.payload;
      if (!newName || oldName === newName) return;
      pushHistory(state);
      state.schema = renameDefIn(current(state.schema) as JsonSchema, oldName, newName);
    },

    reorderArray(
      state,
      action: PayloadAction<{ pointer: JsonPointer; from: number; to: number }>,
    ) {
      if (state.schema == null) return;
      pushHistory(state);
      const { pointer, from, to } = action.payload;
      state.schema = reorderAt(current(state.schema) as JsonSchema, pointer, from, to);
    },

    /** Toggle membership of `key` in the `required[]` of the object at objPointer. */
    toggleRequired(
      state,
      action: PayloadAction<{ objectPointer: JsonPointer; key: string }>,
    ) {
      if (state.schema == null) return;
      pushHistory(state);
      const { objectPointer, key } = action.payload;
      const obj = getAtPointer<JsonSchema>(current(state.schema) as JsonSchema, objectPointer);
      const required = new Set(obj?.required ?? []);
      if (required.has(key)) required.delete(key);
      else required.add(key);
      const reqPtr = (objectPointer === '' ? '' : objectPointer) + '/required';
      if (required.size === 0) {
        state.schema = removeAt(current(state.schema) as JsonSchema, reqPtr);
      } else if (obj?.required) {
        state.schema = setAt(current(state.schema) as JsonSchema, reqPtr, [...required]);
      } else {
        // need to create the key on the object
        state.schema = setAt(
          current(state.schema) as JsonSchema,
          objectPointer + '/required',
          [...required],
        );
      }
    },

    toggleDereferencePreview(state, action: PayloadAction<boolean | undefined>) {
      state.dereferencePreview =
        action.payload === undefined ? !state.dereferencePreview : action.payload;
    },

    setSourceError(state, action: PayloadAction<string | null>) {
      state.sourceError = action.payload;
    },

    setValidationErrors(state, action: PayloadAction<ValidationError[]>) {
      state.validationErrors = action.payload;
    },

    /** Remove one offending key from the `example` (test #4's one-click fix). */
    removeExampleKey(state, action: PayloadAction<JsonPointer>) {
      if (state.schema == null) return;
      pushHistory(state);
      state.schema = removeAt(current(state.schema) as JsonSchema, action.payload);
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    markSaved(state) {
      state.dirty = false;
    },

    undo(state) {
      const prev = state.undoStack.pop();
      if (prev === undefined || state.schema == null) return;
      state.redoStack.push(current(state.schema) as JsonSchema);
      state.schema = prev;
      state.dirty = true;
    },

    redo(state) {
      const next = state.redoStack.pop();
      if (next === undefined || state.schema == null) return;
      state.undoStack.push(current(state.schema) as JsonSchema);
      state.schema = next;
      state.dirty = true;
    },
  },
});

// Helper kept local: normalise an object pointer that ends in `/properties`.
function objPtrFix(propertiesPointer: JsonPointer): JsonPointer {
  return propertiesPointer.endsWith('/properties')
    ? propertiesPointer.slice(0, -'/properties'.length)
    : propertiesPointer;
}

export const schemaEditorSliceActions = slice.actions;
export default slice.reducer;
