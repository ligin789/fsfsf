/**
 * Multi-route eVTOL flight data over Bangalore.
 * Each route: vertical takeoff -> curved cruise -> vertical landing.
 *
 * Pure data only (no Cesium imports) so it can be stored in Redux.
 */

export const TIME_STEP_IN_SECONDS = 15;
export const FLIGHT_START_ISO = '2026-04-21T09:00:00Z';

const CRUISE_ALTITUDE_MSL = 1500;

const TAKEOFF_STEPS = 4;
const LANDING_STEPS = 4;
const CRUISE_STEPS = 36;

export interface Waypoint {
  longitude: number;
  latitude: number;
  height: number;
}

export interface Vertiport {
  name: string;
  longitude: number;
  latitude: number;
  groundHeight: number;
}

export interface FlightRoute {
  id: string;
  label: string;
  from: Vertiport;
  to: Vertiport;
  startOffsetSeconds: number;
  waypoints: Waypoint[];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const VERTIPORTS: Record<string, Vertiport> = {
  KIA: { name: 'KIA Vertiport', longitude: 77.7066, latitude: 13.1986, groundHeight: 920 },
  ELECTRONIC_CITY: {
    name: 'Electronic City Vertiport',
    longitude: 77.6602,
    latitude: 12.8452,
    groundHeight: 900,
  },
  WHITEFIELD: { name: 'Whitefield Vertiport', longitude: 77.7499, latitude: 12.9698, groundHeight: 895 },
  HEBBAL: { name: 'Hebbal Vertiport', longitude: 77.5917, latitude: 13.0358, groundHeight: 905 },
  KORAMANGALA: { name: 'Koramangala Vertiport', longitude: 77.6245, latitude: 12.9352, groundHeight: 900 },
};

// Build a curved cruise path using a quadratic bezier with a perpendicular
// offset control point so the path arcs rather than going straight.
function buildCurvedRoute(
  from: Vertiport,
  to: Vertiport,
  { curveFactor = 0.22, curveDir = 1 }: { curveFactor?: number; curveDir?: number } = {},
): Waypoint[] {
  const points: Waypoint[] = [];

  for (let i = 0; i <= TAKEOFF_STEPS; i++) {
    const t = i / TAKEOFF_STEPS;
    points.push({
      longitude: from.longitude,
      latitude: from.latitude,
      height: lerp(from.groundHeight, CRUISE_ALTITUDE_MSL, t),
    });
  }

  const dx = to.longitude - from.longitude;
  const dy = to.latitude - from.latitude;
  const len = Math.hypot(dx, dy) || 1;
  const perpLon = (-dy / len) * len * curveFactor * curveDir;
  const perpLat = (dx / len) * len * curveFactor * curveDir;
  const ctrlLon = (from.longitude + to.longitude) / 2 + perpLon;
  const ctrlLat = (from.latitude + to.latitude) / 2 + perpLat;

  for (let i = 1; i <= CRUISE_STEPS; i++) {
    const t = i / (CRUISE_STEPS + 1);
    const mt = 1 - t;
    const lon = mt * mt * from.longitude + 2 * mt * t * ctrlLon + t * t * to.longitude;
    const lat = mt * mt * from.latitude + 2 * mt * t * ctrlLat + t * t * to.latitude;
    points.push({ longitude: lon, latitude: lat, height: CRUISE_ALTITUDE_MSL });
  }

  for (let i = 0; i <= LANDING_STEPS; i++) {
    const t = i / LANDING_STEPS;
    points.push({
      longitude: to.longitude,
      latitude: to.latitude,
      height: lerp(CRUISE_ALTITUDE_MSL, to.groundHeight, t),
    });
  }

  return points;
}

export const ROUTES: FlightRoute[] = [
  {
    id: 'kia-ec',
    label: 'KIA → Electronic City',
    from: VERTIPORTS.KIA,
    to: VERTIPORTS.ELECTRONIC_CITY,
    startOffsetSeconds: 0,
    waypoints: buildCurvedRoute(VERTIPORTS.KIA, VERTIPORTS.ELECTRONIC_CITY, {
      curveFactor: 0.28,
      curveDir: 1,
    }),
  },
  {
    id: 'whitefield-hebbal',
    label: 'Whitefield → Hebbal',
    from: VERTIPORTS.WHITEFIELD,
    to: VERTIPORTS.HEBBAL,
    startOffsetSeconds: 60,
    waypoints: buildCurvedRoute(VERTIPORTS.WHITEFIELD, VERTIPORTS.HEBBAL, {
      curveFactor: 0.35,
      curveDir: -1,
    }),
  },
  {
    id: 'hebbal-koramangala',
    label: 'Hebbal → Koramangala',
    from: VERTIPORTS.HEBBAL,
    to: VERTIPORTS.KORAMANGALA,
    startOffsetSeconds: 120,
    waypoints: buildCurvedRoute(VERTIPORTS.HEBBAL, VERTIPORTS.KORAMANGALA, {
      curveFactor: 0.3,
      curveDir: 1,
    }),
  },
];

export const TAKEOFF_POINTS = TAKEOFF_STEPS + 1;
export const LANDING_POINTS = LANDING_STEPS + 1;

export function getPhaseAtIndex(index: number, total: number): 'takeoff' | 'landing' | 'cruise' {
  if (index < TAKEOFF_POINTS) return 'takeoff';
  if (index >= total - LANDING_POINTS) return 'landing';
  return 'cruise';
}
