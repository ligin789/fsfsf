import type { SchemaEditorState } from '../types';

export const initialState: SchemaEditorState = {
  schema: null,
  selectedPointer: '',
  dirty: false,
  undoStack: [],
  redoStack: [],
  validationErrors: [],
  dereferencePreview: false,
  sourceError: null,
  loading: false,
};

/** History depth cap so the undo stack can't grow unbounded. */
export const MAX_HISTORY = 100;
