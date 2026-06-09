/**
 * Route module API services.
 * Maps directly to the OpenAPI contract (route-controller, route-waypoint-controller, ...).
 */
import axiosInstance from '../../../utils/axios';
import type {
  RouteResponse,
  RouteCreateDto,
  RouteUpdateDto,
  RouteWayPointResponse,
  RouteWayPointCreate,
  RouteWayPointUpdate,
  RouteSegmentResponse,
  RouteSegmentCreate,
  RouteSegmentUpdate,
  RouteCorridorResponse,
  RouteCorridorCreate,
  RouteCorridorUpdate,
  CorridorReservationResponse,
  CorridorReservationCreate,
  CorridorReservationUpdate,
  RouteConflictZoneResponse,
  RouteConflictZoneCreate,
  RouteConflictZoneUpdate,
  CorridorCrossSectionResponse,
  CorridorCrossSectionCreate,
  CorridorCrossSectionUpdate,
  CorridorAltitudeBandResponse,
  CorridorAltitudeBandCreate,
  CorridorAltitudeBandUpdate,
  RouteWeatherConstraintResponse,
  RouteWeatherConstraintCreate,
  RouteWeatherConstraintUpdate,
  RouteOperatingWindowResponse,
  RouteOperatingWindowCreate,
  RouteOperatingWindowUpdate,
  RoutePerformanceResponse,
  RoutePerformanceCreate,
  RoutePerformanceUpdate,
  RouteVersionResponse,
  RouteVersionCreate,
  RouteVersionUpdate,
} from '../types';

const ROUTE = '/api/v1/route';
const WAYPOINT = '/api/v1/route-waypoint';
const SEGMENT = '/api/v1/route-segments';
const CORRIDOR = '/api/v1/route-corridor';
const RESERVATION = '/api/v1/corridor-reservation';
const CONFLICT = '/api/v1/route-conflict-zones';
const CROSS_SECTION = '/api/v1/corridor-cross-sections';
const ALT_BAND = '/api/v1/corridor-altitude-band';
const WEATHER = '/api/v1/route-weather-contraint';
const WINDOW = '/api/v1/route-operating-windows';
const PERFORMANCE = '/api/v1/route-performance';
const VERSION = '/api/v1/route-version';

const crud = <Res, Create = Partial<Res>, Update = Partial<Res>>(base: string) => ({
  list: (): Promise<Res[]> => axiosInstance.get<Res[]>(base).then((r) => r.data),
  getById: (id: string): Promise<Res> =>
    axiosInstance.get<Res>(`${base}/${id}`).then((r) => r.data),
  create: (payload: Create): Promise<Res> =>
    axiosInstance.post<Res>(base, payload).then((r) => r.data),
  update: (id: string, payload: Update): Promise<Res> =>
    axiosInstance.put<Res>(`${base}/${id}`, payload).then((r) => r.data),
  remove: (id: string): Promise<void> =>
    axiosInstance.delete<void>(`${base}/${id}`).then(() => undefined),
});

// Collection-level PUT (no id in path) — used by weather/window/version/conflict/reservation.
const crudCollectionPut = <Res, Create = Partial<Res>, Update = Partial<Res>>(base: string) => ({
  list: (): Promise<Res[]> => axiosInstance.get<Res[]>(base).then((r) => r.data),
  getById: (id: string): Promise<Res> =>
    axiosInstance.get<Res>(`${base}/${id}`).then((r) => r.data),
  create: (payload: Create): Promise<Res> =>
    axiosInstance.post<Res>(base, payload).then((r) => r.data),
  update: (payload: Update): Promise<Res> =>
    axiosInstance.put<Res>(base, payload).then((r) => r.data),
  remove: (id: string): Promise<void> =>
    axiosInstance.delete<void>(`${base}/${id}`).then(() => undefined),
});

export const routeService = crud<RouteResponse, RouteCreateDto, RouteUpdateDto>(ROUTE);
export const waypointService = crud<RouteWayPointResponse, RouteWayPointCreate, RouteWayPointUpdate>(WAYPOINT);
export const segmentService = crud<RouteSegmentResponse, RouteSegmentCreate, RouteSegmentUpdate>(SEGMENT);
export const corridorService = crud<RouteCorridorResponse, RouteCorridorCreate, RouteCorridorUpdate>(CORRIDOR);
export const crossSectionService = crud<
  CorridorCrossSectionResponse,
  CorridorCrossSectionCreate,
  CorridorCrossSectionUpdate
>(CROSS_SECTION);
export const altitudeBandService = crud<
  CorridorAltitudeBandResponse,
  CorridorAltitudeBandCreate,
  CorridorAltitudeBandUpdate
>(ALT_BAND);
export const performanceService = crud<RoutePerformanceResponse, RoutePerformanceCreate, RoutePerformanceUpdate>(
  PERFORMANCE,
);

export const reservationService = crudCollectionPut<
  CorridorReservationResponse,
  CorridorReservationCreate,
  CorridorReservationUpdate
>(RESERVATION);
export const conflictZoneService = crudCollectionPut<
  RouteConflictZoneResponse,
  RouteConflictZoneCreate,
  RouteConflictZoneUpdate
>(CONFLICT);
export const weatherConstraintService = crudCollectionPut<
  RouteWeatherConstraintResponse,
  RouteWeatherConstraintCreate,
  RouteWeatherConstraintUpdate
>(WEATHER);
export const operatingWindowService = crudCollectionPut<
  RouteOperatingWindowResponse,
  RouteOperatingWindowCreate,
  RouteOperatingWindowUpdate
>(WINDOW);
export const versionService = crudCollectionPut<RouteVersionResponse, RouteVersionCreate, RouteVersionUpdate>(
  VERSION,
);

export default {
  routeService,
  waypointService,
  segmentService,
  corridorService,
  reservationService,
  conflictZoneService,
  crossSectionService,
  altitudeBandService,
  weatherConstraintService,
  operatingWindowService,
  performanceService,
  versionService,
};
