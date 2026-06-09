/**
 * Classic Redux action types, creators and the loadProcesses thunk for the
 * Processes module.
 *
 * Intentionally hand-written classic Redux + redux-thunk to match the sibling
 * process-groups module (the host's configureStore already supplies thunk
 * middleware). Action shapes are `type` aliases — not interfaces — so they
 * carry an implicit index signature and stay assignable to redux's
 * UnknownAction when dispatched.
 */
import type { Dispatch } from 'redux';
import type { ProcessDoc, ProcessFlowNode, ProcessTask } from './types';
import { dummyProcesses } from '../data/dummyProcesses';

// ---------- Action type constants ----------
export const LOAD_REQUEST = 'processes/LOAD_REQUEST' as const;
export const LOAD_SUCCESS = 'processes/LOAD_SUCCESS' as const;
export const LOAD_FAILURE = 'processes/LOAD_FAILURE' as const;
export const SELECT_PROCESS = 'processes/SELECT_PROCESS' as const;
export const DELETE_PROCESS = 'processes/DELETE_PROCESS' as const;
export const UPDATE_PROCESS_META = 'processes/UPDATE_PROCESS_META' as const;
export const UPDATE_PROCESS_NODE = 'processes/UPDATE_PROCESS_NODE' as const;
export const UPDATE_TASK = 'processes/UPDATE_TASK' as const;
export const UPDATE_EDGE = 'processes/UPDATE_EDGE' as const;

// ---------- Action shapes ----------
export type LoadRequestAction = { type: typeof LOAD_REQUEST };
export type LoadSuccessAction = { type: typeof LOAD_SUCCESS; payload: ProcessDoc[] };
export type LoadFailureAction = { type: typeof LOAD_FAILURE; error: string };
export type SelectProcessAction = { type: typeof SELECT_PROCESS; payload: string | null };
export type DeleteProcessAction = { type: typeof DELETE_PROCESS; key: string };

export type UpdateProcessMetaAction = {
  type: typeof UPDATE_PROCESS_META;
  key: string;
  patch: Record<string, unknown>;
};
export type UpdateProcessNodeAction = {
  type: typeof UPDATE_PROCESS_NODE;
  key: string;
  nodeId: string;
  patch: Partial<ProcessFlowNode>;
};
export type UpdateTaskAction = {
  type: typeof UPDATE_TASK;
  key: string;
  taskKey: string;
  patch: Partial<ProcessTask>;
};
export type UpdateEdgeAction = {
  type: typeof UPDATE_EDGE;
  key: string;
  source: string;
  target: string;
  patch: { condition?: string };
};

export type ProcessesAction =
  | LoadRequestAction
  | LoadSuccessAction
  | LoadFailureAction
  | SelectProcessAction
  | DeleteProcessAction
  | UpdateProcessMetaAction
  | UpdateProcessNodeAction
  | UpdateTaskAction
  | UpdateEdgeAction;

// ---------- Action creators ----------
export const loadRequest = (): LoadRequestAction => ({ type: LOAD_REQUEST });
export const loadSuccess = (items: ProcessDoc[]): LoadSuccessAction => ({
  type: LOAD_SUCCESS,
  payload: items,
});
export const loadFailure = (error: string): LoadFailureAction => ({ type: LOAD_FAILURE, error });

export const selectProcess = (processKey: string | null): SelectProcessAction => ({
  type: SELECT_PROCESS,
  payload: processKey,
});

/** Remove a process from the store by process_key. */
export const deleteProcess = (key: string): DeleteProcessAction => ({
  type: DELETE_PROCESS,
  key,
});

/** Patch process-level metadata (name, version, status, description, domain, operator, points…). */
export const updateProcessMeta = (
  key: string,
  patch: Record<string, unknown>,
): UpdateProcessMetaAction => ({ type: UPDATE_PROCESS_META, key, patch });

/** Patch a flow node (merges `config` shallowly). */
export const updateProcessNode = (
  key: string,
  nodeId: string,
  patch: Partial<ProcessFlowNode>,
): UpdateProcessNodeAction => ({ type: UPDATE_PROCESS_NODE, key, nodeId, patch });

/** Patch a task by task_key (merges `task_steps` so unsurfaced step fields survive). */
export const updateTask = (
  key: string,
  taskKey: string,
  patch: Partial<ProcessTask>,
): UpdateTaskAction => ({ type: UPDATE_TASK, key, taskKey, patch });

/** Patch an edge identified by source+target. */
export const updateEdge = (
  key: string,
  source: string,
  target: string,
  patch: { condition?: string },
): UpdateEdgeAction => ({ type: UPDATE_EDGE, key, source, target, patch });

/**
 * Resolve the dummy fixture asynchronously (simulated latency), then publish it
 * and auto-select the first process.
 */
export const loadProcesses = () => {
  return async (dispatch: Dispatch<ProcessesAction>): Promise<void> => {
    dispatch(loadRequest());
    try {
      // TODO: replace with api.getProcesses()
      const items = await new Promise<ProcessDoc[]>((resolve) => {
        setTimeout(() => resolve(dummyProcesses), 300);
      });
      dispatch(loadSuccess(items));
      if (items.length > 0) {
        dispatch(selectProcess(items[0].process_key));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load processes';
      dispatch(loadFailure(message));
    }
  };
};

// TODO: replace with api.saveProcess() — a save thunk will live here once the
// backend exists; for now all UPDATE_* actions mutate the in-store doc only.
