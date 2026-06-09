/**
 * Process Groups module — public surface.
 *
 * NOTE: the root store imports the reducer *directly* from ./store/reducer
 * (not via this barrel) so the lazy route stays the only thing that pulls in
 * React Flow / dagre. The reducer is re-exported here for completeness.
 */
export { default as ProcessGroupsPage } from './ProcessGroupsPage';
export { default as processGroupsReducer } from './store/reducer';

export * from './store/types';
export * from './store/actions';
export * from './store/selectors';
