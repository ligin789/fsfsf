/**
 * Classic Redux reducer for the Process Groups module.
 */
import type { Reducer } from 'redux';
import type { ProcessGroupsState } from './types';
import {
  LOAD_REQUEST,
  LOAD_SUCCESS,
  LOAD_FAILURE,
  SELECT_PROCESS_GROUP,
  type ProcessGroupsAction,
} from './actions';

const initialState: ProcessGroupsState = {
  items: [],
  status: 'idle',
  error: null,
  selectedGroupId: null,
};

function reducer(
  state: ProcessGroupsState = initialState,
  action: ProcessGroupsAction,
): ProcessGroupsState {
  switch (action.type) {
    case LOAD_REQUEST:
      return { ...state, status: 'loading', error: null };
    case LOAD_SUCCESS:
      return { ...state, status: 'succeeded', items: action.payload };
    case LOAD_FAILURE:
      return { ...state, status: 'failed', error: action.error };
    case SELECT_PROCESS_GROUP:
      return { ...state, selectedGroupId: action.payload };
    default:
      return state;
  }
}

// Cast to the redux Reducer signature (which dispatches UnknownAction) so the
// host's configureStore accepts it while the body keeps exhaustive narrowing.
const processGroupsReducer = reducer as Reducer<ProcessGroupsState>;

export default processGroupsReducer;
