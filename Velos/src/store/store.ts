import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import { geographicalReducer } from '../modules/geographical-management';
import { regulatorsReducer } from '../modules/regulators';
import { oemReducer } from '../modules/oem';
import { ruleReducer } from '../modules/goRule';
import { threeDMapReducer } from '../modules/3dmap';
// import directly from the reducer file (not the barrel) so the lazy route
// stays the only thing that pulls in Monaco / the editor UI.
import schemaEditorReducer from '../modules/schema-editor/store/reducer';
// likewise: import the reducer directly so the lazy route stays the only thing
// that pulls in React Flow / dagre.
import processGroupsReducer from '../modules/process-groups/store/reducer';
import processesReducer from '../modules/processes/store/reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    geographical: geographicalReducer,
    regulators: regulatorsReducer,
    oem: oemReducer,
    rule: ruleReducer,
    threeDMap: threeDMapReducer,
    schemaEditor: schemaEditorReducer,
    processGroups: processGroupsReducer,
    processes: processesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
