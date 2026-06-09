/**
 * Async thunks for the 3D Map module.
 *
 * The flight network is currently sourced from the local flightData module.
 * The thunk is async so it can be swapped for a live API call later without
 * touching the reducer or components.
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES, VERTIPORTS, type FlightRoute, type Vertiport } from '../data/flightData';

export interface FlightNetwork {
  routes: FlightRoute[];
  vertiports: Vertiport[];
}

export const loadFlightNetwork = createAsyncThunk<FlightNetwork>(
  'threeDMap/loadFlightNetwork',
  async () => {
    // Placeholder for a future REST call. Returns the local Bangalore network.
    return {
      routes: ROUTES,
      vertiports: Object.values(VERTIPORTS),
    };
  },
);
