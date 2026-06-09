/**
 * schema-editor — public surface.
 *
 * Mount `schemaEditorReducer` under a key in your host store (default
 * "schemaEditor") and render <SchemaEditor/>. See README.md for wiring.
 */
export { default as SchemaEditor } from './SchemaEditor';
export type { SchemaEditorProps } from './SchemaEditor';

export { default as schemaEditorReducer } from './store/reducer';
export * as schemaEditorActions from './store/actions';
export * as schemaEditorThunks from './store/thunks';
export { selectors, createSchemaEditorSelectors } from './store/selectors';
export type { SchemaEditorSelectors } from './store/selectors';
export { SchemaEditorActionTypes, SLICE_NAME } from './store/actionTypes';

export * from './types';
