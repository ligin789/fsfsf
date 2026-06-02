import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThreeDMapState } from './threeDMapTypes';
import { loadFlightNetwork } from './threeDMapActions';

const initialState: ThreeDMapState = {
  routes: [],
  vertiports: [],
  selectedFlightId: null,
  status: 'idle',
  error: null,
};

const threeDMapSlice = createSlice({
  name: 'threeDMap',
  initialState,
  reducers: {
    setSelectedFlight(state, action: PayloadAction<string | null>) {
      state.selectedFlightId = action.payload;
    },
    clearSelectedFlight(state) {
      state.selectedFlightId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFlightNetwork.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadFlightNetwork.fulfilled, (state, action) => {
        state.status = 'ready';
        state.routes = action.payload.routes;
        state.vertiports = action.payload.vertiports;
      })
      .addCase(loadFlightNetwork.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message || 'Failed to load flight network';
      });
  },
});

export const { setSelectedFlight, clearSelectedFlight } = threeDMapSlice.actions;
export default threeDMapSlice.reducer;
