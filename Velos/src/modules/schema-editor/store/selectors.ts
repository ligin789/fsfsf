/**
 * Selectors.
 *
 * `selectors` assumes the slice is mounted at `schemaEditor`. To mount it under
 * a different key, build a set with `createSchemaEditorSelectors(sliceKey)` and
 * pass the same key as <SchemaEditor sliceKey="...">.
 */
import type { SchemaEditorState } from '../types';

/** The host root state is unknown to the module; index by the slice key. */
type RootWithSlice = Record<string, unknown>;

export interface SchemaEditorSelectors {
  selectState: (root: RootWithSlice) => SchemaEditorState;
  selectSchema: (root: RootWithSlice) => SchemaEditorState['schema'];
  selectSelectedPointer: (root: RootWithSlice) => string;
  selectDirty: (root: RootWithSlice) => boolean;
  selectValidationErrors: (root: RootWithSlice) => SchemaEditorState['validationErrors'];
  selectDereferencePreview: (root: RootWithSlice) => boolean;
  selectSourceError: (root: RootWithSlice) => string | null;
  selectLoading: (root: RootWithSlice) => boolean;
  selectCanUndo: (root: RootWithSlice) => boolean;
  selectCanRedo: (root: RootWithSlice) => boolean;
}

export function createSchemaEditorSelectors(sliceKey = 'schemaEditor'): SchemaEditorSelectors {
  const selectState = (root: RootWithSlice) => root[sliceKey] as SchemaEditorState;
  return {
    selectState,
    selectSchema: (root) => selectState(root)?.schema ?? null,
    selectSelectedPointer: (root) => selectState(root)?.selectedPointer ?? '',
    selectDirty: (root) => selectState(root)?.dirty ?? false,
    selectValidationErrors: (root) => selectState(root)?.validationErrors ?? [],
    selectDereferencePreview: (root) => selectState(root)?.dereferencePreview ?? false,
    selectSourceError: (root) => selectState(root)?.sourceError ?? null,
    selectLoading: (root) => selectState(root)?.loading ?? false,
    selectCanUndo: (root) => (selectState(root)?.undoStack?.length ?? 0) > 0,
    selectCanRedo: (root) => (selectState(root)?.redoStack?.length ?? 0) > 0,
  };
}

/** Default selectors for the conventional `schemaEditor` mount point. */
export const selectors = createSchemaEditorSelectors('schemaEditor');
