import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { geographicalReducer } from '../modules/geographical-management';
import { regulatorsReducer } from '../modules/regulators';
import { oemReducer } from '../modules/oem';
import { ruleReducer } from '../modules/goRule';
import { threeDMapReducer } from '../modules/3dmap';
// import directly from the reducer file (not the barrel) so the lazy route
// stays the only thing that pulls in Monaco / the editor UI.
import schemaEditorReducer from '../modules/schema-editor/store/reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    geographical: geographicalReducer,
    regulators: regulatorsReducer,
    oem: oemReducer,
    rule: ruleReducer,
    threeDMap: threeDMapReducer,
    schemaEditor: schemaEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
