import type { FlightRoute, Vertiport } from '../data/flightData';

export type ThreeDMapStatus = 'idle' | 'loading' | 'ready';

export interface ThreeDMapState {
  routes: FlightRoute[];
  vertiports: Vertiport[];
  selectedFlightId: string | null;
  status: ThreeDMapStatus;
  error: string | null;
}
