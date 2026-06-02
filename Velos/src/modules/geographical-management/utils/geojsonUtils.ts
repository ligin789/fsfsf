/**
 * Helpers to convert between WKT (the format used by the Geographical Management
 * API as per cluster.yaml) and GeoJSON (the format used internally by MapLibre).
 *
 * Supported geometry types: POLYGON, MULTIPOLYGON.
 */

export interface PolygonFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // [ring][point][lng,lat]
  };
  properties: Record<string, unknown>;
}

export interface MultiPolygonFeature {
  type: 'Feature';
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][]; // [polygon][ring][point][lng,lat]
  };
  properties: Record<string, unknown>;
}

export type GeoFeature = PolygonFeature | MultiPolygonFeature;

export interface GeoFeatureCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

const EMPTY_FC: GeoFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

export const emptyFeatureCollection = (): GeoFeatureCollection => ({
  type: 'FeatureCollection',
  features: [],
});

// ---------- WKT -> GeoJSON ----------

const parseRing = (ringStr: string): number[][] => {
  return ringStr
    .trim()
    .split(',')
    .map((pair) => {
      const [lng, lat] = pair.trim().split(/\s+/).map(Number);
      return [lng, lat];
    });
};

const parsePolygonBody = (body: string): number[][][] => {
  // body like: (ring1),(ring2)
  const rings: string[] = [];
  let depth = 0;
  let buf = '';
  for (const ch of body) {
    if (ch === '(') {
      if (depth === 0) buf = '';
      else buf += ch;
      depth++;
    } else if (ch === ')') {
      depth--;
      if (depth === 0) rings.push(buf);
      else buf += ch;
    } else if (depth > 0) {
      buf += ch;
    }
  }
  return rings.map(parseRing);
};

/**
 * Convert a WKT string to a GeoJSON FeatureCollection.
 * Returns an empty FeatureCollection on parse failure / empty input.
 */
export const wktToFeatureCollection = (wkt?: string | null): GeoFeatureCollection => {
  if (!wkt || typeof wkt !== 'string') return emptyFeatureCollection();
  const trimmed = wkt.trim();
  if (!trimmed) return emptyFeatureCollection();

  try {
    const upper = trimmed.toUpperCase();

    if (upper.startsWith('POLYGON')) {
      const start = trimmed.indexOf('(');
      const end = trimmed.lastIndexOf(')');
      const inner = trimmed.substring(start + 1, end);
      const coords = parsePolygonBody(`(${inner})`);
      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: coords },
            properties: {},
          },
        ],
      };
    }

    if (upper.startsWith('MULTIPOLYGON')) {
      const start = trimmed.indexOf('(');
      const end = trimmed.lastIndexOf(')');
      const inner = trimmed.substring(start + 1, end);

      // split top-level polygons
      const polygons: string[] = [];
      let depth = 0;
      let buf = '';
      for (const ch of inner) {
        if (ch === '(') {
          if (depth === 0) buf = '';
          else buf += ch;
          depth++;
        } else if (ch === ')') {
          depth--;
          if (depth === 0) polygons.push(buf);
          else buf += ch;
        } else if (depth > 0) {
          buf += ch;
        }
      }

      const coordinates = polygons.map((p) => parsePolygonBody(p));
      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'MultiPolygon', coordinates },
            properties: {},
          },
        ],
      };
    }
  } catch {
    return emptyFeatureCollection();
  }

  return EMPTY_FC;
};

// ---------- GeoJSON -> WKT ----------

const formatRing = (ring: number[][]): string =>
  ring.map((p) => `${p[0]} ${p[1]}`).join(', ');

const formatPolygonCoords = (coords: number[][][]): string =>
  coords.map((ring) => `(${formatRing(ring)})`).join(', ');

/**
 * Convert a single GeoJSON Polygon feature to a WKT POLYGON string.
 */
export const polygonFeatureToWkt = (feature: PolygonFeature): string => {
  return `POLYGON (${formatPolygonCoords(feature.geometry.coordinates)})`;
};

/**
 * Convert a FeatureCollection to a WKT MULTIPOLYGON string.
 * Each Polygon feature becomes one polygon in the multipolygon.
 * Returns "" when there are no polygon features.
 */
export const featureCollectionToWkt = (fc: GeoFeatureCollection): string => {
  if (!fc?.features?.length) return '';

  const polys: number[][][][] = [];
  fc.features.forEach((f) => {
    if (f.geometry.type === 'Polygon') {
      polys.push(f.geometry.coordinates as number[][][]);
    } else if (f.geometry.type === 'MultiPolygon') {
      (f.geometry.coordinates as number[][][][]).forEach((p) => polys.push(p));
    }
  });

  if (!polys.length) return '';

  if (polys.length === 1) {
    return `POLYGON (${formatPolygonCoords(polys[0])})`;
  }

  const inner = polys.map((p) => `(${formatPolygonCoords(p)})`).join(', ');
  return `MULTIPOLYGON (${inner})`;
};

// ---------- GeoJSON string <-> FeatureCollection ----------

type RawGeometry = {
  type?: string;
  coordinates?: unknown;
};

const isPolygonCoords = (c: unknown): c is number[][][] =>
  Array.isArray(c) &&
  Array.isArray(c[0]) &&
  Array.isArray((c[0] as unknown[])[0]) &&
  typeof ((c[0] as number[][])[0] as number[])[0] === 'number';

const isMultiPolygonCoords = (c: unknown): c is number[][][][] =>
  Array.isArray(c) &&
  Array.isArray(c[0]) &&
  Array.isArray((c[0] as unknown[])[0]) &&
  Array.isArray(((c[0] as unknown[])[0] as unknown[])[0]);

const geometryToFeature = (geom: RawGeometry): GeoFeature | null => {
  if (!geom || typeof geom.type !== 'string') return null;
  const type = geom.type.toLowerCase();
  if (type === 'polygon' && isPolygonCoords(geom.coordinates)) {
    return {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: geom.coordinates },
      properties: {},
    };
  }
  if (type === 'multipolygon' && isMultiPolygonCoords(geom.coordinates)) {
    return {
      type: 'Feature',
      geometry: { type: 'MultiPolygon', coordinates: geom.coordinates },
      properties: {},
    };
  }
  return null;
};

export interface ParseResult {
  fc: GeoFeatureCollection;
  error: string | null;
}

/**
 * Parse user-pasted text into a FeatureCollection.
 * Accepts: GeoJSON (Geometry | Feature | FeatureCollection) OR raw WKT
 * (POLYGON / MULTIPOLYGON). Only Polygon / MultiPolygon geometries are kept.
 */
export const parseGeometryInput = (text?: string | null): ParseResult => {
  const trimmed = (text || '').trim();
  if (!trimmed) return { fc: emptyFeatureCollection(), error: null };

  // WKT fallback
  const upper = trimmed.toUpperCase();
  if (upper.startsWith('POLYGON') || upper.startsWith('MULTIPOLYGON')) {
    const fc = wktToFeatureCollection(trimmed);
    if (!fc.features.length) {
      return { fc: emptyFeatureCollection(), error: 'Could not parse the WKT geometry.' };
    }
    return { fc, error: null };
  }

  // GeoJSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { fc: emptyFeatureCollection(), error: 'Invalid JSON. Paste valid GeoJSON or WKT.' };
  }

  const obj = parsed as { type?: string; features?: unknown[]; geometry?: RawGeometry };
  const features: GeoFeature[] = [];

  if (obj?.type === 'FeatureCollection' && Array.isArray(obj.features)) {
    obj.features.forEach((f) => {
      const feat = geometryToFeature((f as { geometry?: RawGeometry })?.geometry || {});
      if (feat) features.push(feat);
    });
  } else if (obj?.type === 'Feature') {
    const feat = geometryToFeature(obj.geometry || {});
    if (feat) features.push(feat);
  } else if (typeof obj?.type === 'string') {
    // bare geometry
    const feat = geometryToFeature(obj as RawGeometry);
    if (feat) features.push(feat);
  }

  if (!features.length) {
    return {
      fc: emptyFeatureCollection(),
      error: 'No Polygon / MultiPolygon geometry found in the GeoJSON.',
    };
  }

  return { fc: { type: 'FeatureCollection', features }, error: null };
};

/**
 * Serialise a FeatureCollection to a pretty GeoJSON string for display / editing.
 * Returns "" when empty.
 */
export const featureCollectionToGeoJSONString = (fc: GeoFeatureCollection): string => {
  if (!fc?.features?.length) return '';
  return JSON.stringify(fc, null, 2);
};

// ---------- Bounds ----------

export interface LngLatBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

/**
 * Compute LngLatBounds from a FeatureCollection. Returns null if empty.
 */
export const featureCollectionBounds = (fc: GeoFeatureCollection): LngLatBounds | null => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let any = false;

  const visit = (rings: number[][][]) => {
    rings.forEach((ring) =>
      ring.forEach(([x, y]) => {
        any = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }),
    );
  };

  fc.features.forEach((f) => {
    if (f.geometry.type === 'Polygon') {
      visit(f.geometry.coordinates as number[][][]);
    } else if (f.geometry.type === 'MultiPolygon') {
      (f.geometry.coordinates as number[][][][]).forEach(visit);
    }
  });

  if (!any) return null;
  return { west: minX, south: minY, east: maxX, north: maxY };
};

export const featureCollectionCentroid = (fc: GeoFeatureCollection): [number, number] | null => {
  const b = featureCollectionBounds(fc);
  if (!b) return null;
  return [(b.west + b.east) / 2, (b.south + b.north) / 2];
};

/**
 * Build a closed Polygon feature from a list of [lng, lat] points.
 * Caller is expected to pass at least 3 unique points.
 */
export const buildPolygonFeature = (points: [number, number][]): PolygonFeature | null => {
  if (!points || points.length < 3) return null;
  const ring = [...points];
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }
  return {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [ring] },
    properties: {},
  };
};
