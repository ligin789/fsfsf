/**
 * Classic Redux reducer for the Processes module.
 *
 * All UPDATE_* cases are immutable and merge-by-spread so that any nested fields
 * the UI does not surface are preserved on the raw document.
 */
import type { Reducer } from 'redux';
import type { ProcessDoc, ProcessesState } from './types';
import {
  LOAD_REQUEST,
  LOAD_SUCCESS,
  LOAD_FAILURE,
  SELECT_PROCESS,
  DELETE_PROCESS,
  UPDATE_PROCESS_META,
  UPDATE_PROCESS_NODE,
  UPDATE_TASK,
  UPDATE_EDGE,
  type ProcessesAction,
} from './actions';

const initialState: ProcessesState = {
  items: [],
  status: 'idle',
  error: null,
  selectedProcessKey: null,
};

/** Apply `updater` to the item matching `key`, leaving the rest untouched. */
function mapItem(
  items: ProcessDoc[],
  key: string,
  updater: (doc: ProcessDoc) => ProcessDoc,
): ProcessDoc[] {
  return items.map((doc) => (doc.process_key === key ? updater(doc) : doc));
}

function reducer(
  state: ProcessesState = initialState,
  action: ProcessesAction,
): ProcessesState {
  switch (action.type) {
    case LOAD_REQUEST:
      return { ...state, status: 'loading', error: null };
    case LOAD_SUCCESS:
      return { ...state, status: 'succeeded', items: action.payload };
    case LOAD_FAILURE:
      return { ...state, status: 'failed', error: action.error };
    case SELECT_PROCESS:
      return { ...state, selectedProcessKey: action.payload };

    case DELETE_PROCESS: {
      const items = state.items.filter((doc) => doc.process_key !== action.key);
      const selectedProcessKey =
        state.selectedProcessKey === action.key ? null : state.selectedProcessKey;
      return { ...state, items, selectedProcessKey };
    }

    case UPDATE_PROCESS_META: {
      const items = mapItem(state.items, action.key, (doc) => ({ ...doc, ...action.patch }));
      // If the process_key itself was renamed, keep the selection pointing at it.
      const renamed =
        typeof action.patch.process_key === 'string' && action.patch.process_key !== action.key;
      const selectedProcessKey =
        renamed && state.selectedProcessKey === action.key
          ? (action.patch.process_key as string)
          : state.selectedProcessKey;
      return { ...state, items, selectedProcessKey };
    }

    case UPDATE_PROCESS_NODE: {
      const items = mapItem(state.items, action.key, (doc) => ({
        ...doc,
        processFlow: {
          ...doc.processFlow,
          nodes: doc.processFlow.nodes.map((node) =>
            node.id === action.nodeId
              ? {
                  ...node,
                  ...action.patch,
                  config: action.patch.config
                    ? { ...node.config, ...action.patch.config }
                    : node.config,
                }
              : node,
          ),
        },
      }));
      return { ...state, items };
    }

    case UPDATE_TASK: {
      const items = mapItem(state.items, action.key, (doc) => ({
        ...doc,
        tasks: doc.tasks.map((task) =>
          task.task_key === action.taskKey ? { ...task, ...action.patch } : task,
        ),
      }));
      return { ...state, items };
    }

    case UPDATE_EDGE: {
      const items = mapItem(state.items, action.key, (doc) => ({
        ...doc,
        processFlow: {
          ...doc.processFlow,
          edges: doc.processFlow.edges.map((edge) =>
            edge.source === action.source && edge.target === action.target
              ? { ...edge, ...action.patch }
              : edge,
          ),
        },
      }));
      return { ...state, items };
    }

    default:
      return state;
  }
}

// Cast to the redux Reducer signature (UnknownAction) so configureStore accepts
// it while the body keeps exhaustive narrowing over ProcessesAction.
const processesReducer = reducer as Reducer<ProcessesState>;

export default processesReducer;
