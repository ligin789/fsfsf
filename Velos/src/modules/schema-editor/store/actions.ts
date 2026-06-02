/**
 * Sync action creators.
 *
 * These are the RTK-generated creators from the slice, re-exported here so the
 * public surface matches the documented layout (`store/actions.ts`). Each
 * dispatches a `@schema-editor/...` action.
 */
import { schemaEditorSliceActions } from './reducer';

export const {
  loadSchema,
  replaceSchema,
  setFromSource,
  selectNode,
  setAtPointer,
  removeAtPointer,
  renameKey,
  renameDef,
  reorderArray,
  toggleRequired,
  toggleDereferencePreview,
  setSourceError,
  setValidationErrors,
  removeExampleKey,
  setLoading,
  markSaved,
  undo,
  redo,
} = schemaEditorSliceActions;

/** Convenience: the whole bag of sync action creators. */
export const schemaEditorActions = schemaEditorSliceActions;
