/**
 * Classic Redux action types, action creators and the loadProcessGroups thunk
 * for the Process Groups module.
 *
 * The host app is RTK, but this module is intentionally hand-written classic
 * Redux + redux-thunk (RTK's configureStore already supplies thunk middleware).
 */
import type { Dispatch } from 'redux';
import type { ProcessGroup } from './types';
import { dummyProcessGroups } from '../data/dummyProcessGroups';

// ---------- Action type constants ----------
export const LOAD_REQUEST = 'processGroups/LOAD_REQUEST' as const;
export const LOAD_SUCCESS = 'processGroups/LOAD_SUCCESS' as const;
export const LOAD_FAILURE = 'processGroups/LOAD_FAILURE' as const;
export const SELECT_PROCESS_GROUP = 'processGroups/SELECT_PROCESS_GROUP' as const;

// ---------- Action shapes ----------
// Declared as `type` aliases (not interfaces) so they carry an implicit index
// signature and stay assignable to redux's UnknownAction when dispatched.
export type LoadRequestAction = {
  type: typeof LOAD_REQUEST;
};
export type LoadSuccessAction = {
  type: typeof LOAD_SUCCESS;
  payload: ProcessGroup[];
};
export type LoadFailureAction = {
  type: typeof LOAD_FAILURE;
  error: string;
};
export type SelectProcessGroupAction = {
  type: typeof SELECT_PROCESS_GROUP;
  payload: string | null;
};

export type ProcessGroupsAction =
  | LoadRequestAction
  | LoadSuccessAction
  | LoadFailureAction
  | SelectProcessGroupAction;

// ---------- Action creators ----------
export const loadRequest = (): LoadRequestAction => ({ type: LOAD_REQUEST });

export const loadSuccess = (items: ProcessGroup[]): LoadSuccessAction => ({
  type: LOAD_SUCCESS,
  payload: items,
});

export const loadFailure = (error: string): LoadFailureAction => ({
  type: LOAD_FAILURE,
  error,
});

export const selectProcessGroup = (id: string | null): SelectProcessGroupAction => ({
  type: SELECT_PROCESS_GROUP,
  payload: id,
});

/**
 * Resolve the dummy fixture asynchronously (simulated latency), then publish it.
 * Auto-selects the first group so the detail pane has something to render.
 */
export const loadProcessGroups = () => {
  return async (dispatch: Dispatch<ProcessGroupsAction>): Promise<void> => {
    dispatch(loadRequest());
    try {
      // TODO: replace with api.getProcessGroups()
      const items = await new Promise<ProcessGroup[]>((resolve) => {
        setTimeout(() => resolve(dummyProcessGroups), 300);
      });
      dispatch(loadSuccess(items));
      if (items.length > 0) {
        dispatch(selectProcessGroup(items[0].process_group_id));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load process groups';
      dispatch(loadFailure(message));
    }
  };
};
