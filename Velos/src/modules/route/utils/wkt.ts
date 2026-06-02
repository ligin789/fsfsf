/**
 * Minimal WKT → GeoJSON converters for LINESTRING / POLYGON / POINT.
 * Sufficient for rendering routes, corridors, and waypoints on a map.
 */

export type LngLat = [number, number];

const parseCoordPair = (s: string): LngLat => {
  const parts = s.trim().split(/\s+/).map(Number);
  return [parts[0], parts[1]];
};

const parseCoordList = (inner: string): LngLat[] =>
  inner.split(',').map((c) => parseCoordPair(c));

export function wktToGeoJSON(wkt?: string): GeoJSON.Geometry | null {
  if (!wkt) return null;
  const trimmed = wkt.trim().toUpperCase().replace(/\s+/, ' ');
  const matchType = trimmed.match(/^([A-Z]+)\s*\((.*)\)\s*$/);
  if (!matchType) return null;
  const type = matchType[1];
  const body = wkt.slice(wkt.indexOf('(') + 1, wkt.lastIndexOf(')'));

  switch (type) {
    case 'POINT':
      return { type: 'Point', coordinates: parseCoordPair(body) };
    case 'LINESTRING':
      return { type: 'LineString', coordinates: parseCoordList(body) };
    case 'POLYGON': {
      // POLYGON((... ),(... ))
      const rings = body.match(/\(([^)]+)\)/g)?.map((r) => parseCoordList(r.slice(1, -1))) ?? [];
      return { type: 'Polygon', coordinates: rings };
    }
    default:
      return null;
  }
}

export function geometryBounds(geom: GeoJSON.Geometry | null): [LngLat, LngLat] | null {
  if (!geom) return null;
  const collect: LngLat[] = [];
  const walk = (coords: unknown): void => {
    if (Array.isArray(coords) && typeof coords[0] === 'number') {
      collect.push(coords as LngLat);
    } else if (Array.isArray(coords)) {
      coords.forEach(walk);
    }
  };
  walk((geom as { coordinates: unknown }).coordinates);
  if (collect.length === 0) return null;
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const [lng, lat] of collect) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }
  return [[minLng, minLat], [maxLng, maxLat]];
}
