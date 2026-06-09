/**
 * GeoMap
 *
 * Reusable polygon plotting component for Cluster / Region / Zone.
 * Built on maplibre-gl.
 *
 * Features:
 *   - Display map
 *   - Draw polygon (click to add points, double-click / "Finish" to close)
 *   - Edit polygon (drag vertices)
 *   - Delete polygon
 *   - View existing polygon (loaded from API via WKT -> GeoJSON)
 *   - Fit map to polygon bounds
 *   - Emits FeatureCollection on every change
 */
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  emptyFeatureCollection,
  featureCollectionBounds,
  buildPolygonFeature,
  type GeoFeatureCollection,
  type PolygonFeature,
} from '../../utils/geojsonUtils';

interface GeoMapProps {
  /** Initial / controlled FeatureCollection. Pass empty FC to start blank. */
  value: GeoFeatureCollection;
  /** Called when the polygon is created / edited / cleared. */
  onChange: (fc: GeoFeatureCollection) => void;
  /** Disable all editing — read-only display. Defaults to false. */
  readOnly?: boolean;
  /** Map height in CSS units. Defaults to 420px. */
  height?: number | string;
  /** Initial center if no polygon. Defaults to a view centred on India. */
  initialCenter?: [number, number];
  initialZoom?: number;
  /** Color for the polygon boundary. Defaults to a brand blue. */
  strokeColor?: string;
  fillColor?: string;
}

type Mode = 'view' | 'draw' | 'edit';

const SOURCE_ID = 'geo-map-source';
const FILL_LAYER = 'geo-map-fill';
const LINE_LAYER = 'geo-map-line';
const VERTEX_SOURCE = 'geo-map-vertex-source';
const VERTEX_LAYER = 'geo-map-vertex-layer';
const PREVIEW_SOURCE = 'geo-map-preview-source';
const PREVIEW_LAYER = 'geo-map-preview-layer';

export default function GeoMap({
  value,
  onChange,
  readOnly = false,
  height = 420,
  // Default centre: India (lng, lat) — approx geographic centre of the country.
  initialCenter = [78.9629, 22.5937],
  initialZoom = 4.2,
  strokeColor = '#2563EB',
  fillColor = '#3B82F6',
}: GeoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const styleLoadedRef = useRef(false);

  // Drawing state held in refs so the map handlers always see the latest values.
  const modeRef = useRef<Mode>('view');
  const drawingPointsRef = useRef<[number, number][]>([]);
  const draggingVertexRef = useRef<number | null>(null);

  const [mode, setMode] = useState<Mode>('view');
  const [statusText, setStatusText] = useState<string>('');

  const fcRef = useRef<GeoFeatureCollection>(value || emptyFeatureCollection());
  useEffect(() => {
    fcRef.current = value || emptyFeatureCollection();
  }, [value]);

  // ---------- Helpers that operate on the map instance ----------

  const setSourceData = useCallback((sourceId: string, data: GeoJSON.FeatureCollection) => {
    const map = mapRef.current;
    if (!map || !styleLoadedRef.current) return;
    const src = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
    if (src) src.setData(data as never);
  }, []);

  const refreshPolygon = useCallback(() => {
    setSourceData(SOURCE_ID, fcRef.current as unknown as GeoJSON.FeatureCollection);
  }, [setSourceData]);

  const refreshVertices = useCallback(() => {
    const points: [number, number][] = [];
    if (modeRef.current === 'draw') {
      drawingPointsRef.current.forEach((p) => points.push(p));
    } else if (modeRef.current === 'edit') {
      const f = fcRef.current.features[0] as PolygonFeature | undefined;
      if (f && f.geometry.type === 'Polygon') {
        const ring = f.geometry.coordinates[0];
        // Skip last (closing) point — it's a duplicate of the first.
        for (let i = 0; i < ring.length - 1; i++) {
          points.push([ring[i][0], ring[i][1]]);
        }
      }
    }
    const fc: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: points.map((p, idx) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: p },
        properties: { idx },
      })),
    };
    setSourceData(VERTEX_SOURCE, fc);
  }, [setSourceData]);

  const refreshDrawPreview = useCallback(
    (mouseLngLat?: [number, number]) => {
      if (modeRef.current !== 'draw') {
        setSourceData(PREVIEW_SOURCE, { type: 'FeatureCollection', features: [] });
        return;
      }
      const pts = [...drawingPointsRef.current];
      if (mouseLngLat) pts.push(mouseLngLat);
      if (pts.length < 2) {
        setSourceData(PREVIEW_SOURCE, { type: 'FeatureCollection', features: [] });
        return;
      }
      const lineCoords = [...pts];
      // close visual hint when ≥ 3 points
      if (pts.length >= 3) lineCoords.push(pts[0]);
      const fc: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: lineCoords },
            properties: {},
          },
        ],
      };
      setSourceData(PREVIEW_SOURCE, fc);
    },
    [setSourceData],
  );

  const emitChange = useCallback(
    (next: GeoFeatureCollection) => {
      fcRef.current = next;
      refreshPolygon();
      refreshVertices();
      onChange(next);
    },
    [onChange, refreshPolygon, refreshVertices],
  );

  // ---------- Map event handlers ----------

  const handleMapClick = useCallback(
    (e: maplibregl.MapMouseEvent) => {
      if (readOnly) return;
      if (modeRef.current !== 'draw') return;
      drawingPointsRef.current = [
        ...drawingPointsRef.current,
        [e.lngLat.lng, e.lngLat.lat],
      ];
      refreshVertices();
      refreshDrawPreview([e.lngLat.lng, e.lngLat.lat]);
      setStatusText(`Drawing — ${drawingPointsRef.current.length} point(s). Double-click to finish.`);
    },
    [readOnly, refreshVertices, refreshDrawPreview],
  );

  const handleMapMouseMove = useCallback(
    (e: maplibregl.MapMouseEvent) => {
      if (modeRef.current === 'draw') {
        refreshDrawPreview([e.lngLat.lng, e.lngLat.lat]);
      }
      if (modeRef.current === 'edit' && draggingVertexRef.current !== null) {
        const f = fcRef.current.features[0] as PolygonFeature | undefined;
        if (!f || f.geometry.type !== 'Polygon') return;
        const idx = draggingVertexRef.current;
        const ring = [...f.geometry.coordinates[0]];
        ring[idx] = [e.lngLat.lng, e.lngLat.lat];
        // keep ring closed
        if (idx === 0) ring[ring.length - 1] = [e.lngLat.lng, e.lngLat.lat];
        const next: GeoFeatureCollection = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: { type: 'Polygon', coordinates: [ring] },
              properties: f.properties,
            },
          ],
        };
        fcRef.current = next;
        refreshPolygon();
        refreshVertices();
      }
    },
    [refreshDrawPreview, refreshPolygon, refreshVertices],
  );

  const finishDrawing = useCallback(() => {
    const pts = drawingPointsRef.current;
    if (pts.length < 3) {
      setStatusText('Need at least 3 points to make a polygon.');
      return;
    }
    const feature = buildPolygonFeature(pts);
    if (!feature) return;
    const fc: GeoFeatureCollection = {
      type: 'FeatureCollection',
      features: [feature],
    };
    drawingPointsRef.current = [];
    modeRef.current = 'view';
    setMode('view');
    setStatusText('Polygon saved.');
    emitChange(fc);
    refreshDrawPreview();
  }, [emitChange, refreshDrawPreview]);

  const handleDoubleClick = useCallback(
    (e: maplibregl.MapMouseEvent) => {
      if (modeRef.current !== 'draw') return;
      e.preventDefault();
      finishDrawing();
    },
    [finishDrawing],
  );

  const handleVertexMouseDown = useCallback(
    (e: maplibregl.MapLayerMouseEvent) => {
      if (readOnly) return;
      if (modeRef.current !== 'edit') return;
      const map = mapRef.current;
      if (!map) return;
      const feat = e.features?.[0];
      if (!feat) return;
      const idx = (feat.properties as { idx?: number } | null)?.idx;
      if (typeof idx !== 'number') return;
      e.preventDefault();
      draggingVertexRef.current = idx;
      map.getCanvas().style.cursor = 'grabbing';
      map.dragPan.disable();
    },
    [readOnly],
  );

  const handleMouseUp = useCallback(() => {
    if (draggingVertexRef.current !== null) {
      const map = mapRef.current;
      draggingVertexRef.current = null;
      if (map) {
        map.getCanvas().style.cursor = '';
        map.dragPan.enable();
      }
      // emit final state from drag
      onChange(fcRef.current);
    }
  }, [onChange]);

  // ---------- Public actions ----------

  const startDraw = useCallback(() => {
    if (readOnly) return;
    drawingPointsRef.current = [];
    modeRef.current = 'draw';
    setMode('draw');
    setStatusText('Click to add points. Double-click (or "Finish") to close polygon.');
    // clear any existing polygon when starting a fresh draw
    const empty = emptyFeatureCollection();
    fcRef.current = empty;
    refreshPolygon();
    refreshVertices();
    refreshDrawPreview();
    onChange(empty);
  }, [onChange, readOnly, refreshDrawPreview, refreshPolygon, refreshVertices]);

  const startEdit = useCallback(() => {
    if (readOnly) return;
    if (!fcRef.current.features.length) {
      setStatusText('No polygon to edit.');
      return;
    }
    modeRef.current = 'edit';
    setMode('edit');
    setStatusText('Drag any vertex to reshape the polygon.');
    refreshVertices();
  }, [readOnly, refreshVertices]);

  const cancelDraw = useCallback(() => {
    drawingPointsRef.current = [];
    modeRef.current = 'view';
    setMode('view');
    refreshVertices();
    refreshDrawPreview();
    setStatusText('');
  }, [refreshDrawPreview, refreshVertices]);

  const finishEdit = useCallback(() => {
    modeRef.current = 'view';
    setMode('view');
    refreshVertices();
    setStatusText('Edit finished.');
  }, [refreshVertices]);

  const deletePolygon = useCallback(() => {
    if (readOnly) return;
    drawingPointsRef.current = [];
    modeRef.current = 'view';
    setMode('view');
    setStatusText('Polygon deleted.');
    emitChange(emptyFeatureCollection());
    refreshDrawPreview();
  }, [emitChange, readOnly, refreshDrawPreview]);

  const fitToPolygon = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const b = featureCollectionBounds(fcRef.current);
    if (!b) {
      setStatusText('No polygon to fit.');
      return;
    }
    map.fitBounds(
      [
        [b.west, b.south],
        [b.east, b.north],
      ],
      { padding: 40, duration: 600, maxZoom: 16 },
    );
  }, []);

  // ---------- Map init ----------

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: initialCenter,
      zoom: initialZoom,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right');

    map.on('load', () => {
      styleLoadedRef.current = true;

      // polygon source + layers
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: fcRef.current as unknown as GeoJSON.FeatureCollection,
      });
      map.addLayer({
        id: FILL_LAYER,
        type: 'fill',
        source: SOURCE_ID,
        paint: { 'fill-color': fillColor, 'fill-opacity': 0.18 },
      });
      map.addLayer({
        id: LINE_LAYER,
        type: 'line',
        source: SOURCE_ID,
        paint: { 'line-color': strokeColor, 'line-width': 2.5 },
      });

      // preview line while drawing
      map.addSource(PREVIEW_SOURCE, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: PREVIEW_LAYER,
        type: 'line',
        source: PREVIEW_SOURCE,
        paint: { 'line-color': strokeColor, 'line-width': 1.5, 'line-dasharray': [2, 2] },
      });

      // vertices (draw + edit)
      map.addSource(VERTEX_SOURCE, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: VERTEX_LAYER,
        type: 'circle',
        source: VERTEX_SOURCE,
        paint: {
          'circle-radius': 6,
          'circle-color': '#FFFFFF',
          'circle-stroke-color': strokeColor,
          'circle-stroke-width': 2,
        },
      });

      // initial fit if we already have a polygon
      const b = featureCollectionBounds(fcRef.current);
      if (b) {
        map.fitBounds(
          [
            [b.west, b.south],
            [b.east, b.north],
          ],
          { padding: 40, duration: 0, maxZoom: 16 },
        );
      }

      // handlers
      map.on('click', handleMapClick);
      map.on('dblclick', handleDoubleClick);
      map.on('mousemove', handleMapMouseMove);
      map.on('mouseup', handleMouseUp);
      map.on('mousedown', VERTEX_LAYER, handleVertexMouseDown);
      map.on('mouseenter', VERTEX_LAYER, () => {
        if (!readOnly && modeRef.current === 'edit') {
          map.getCanvas().style.cursor = 'grab';
        }
      });
      map.on('mouseleave', VERTEX_LAYER, () => {
        if (draggingVertexRef.current === null) map.getCanvas().style.cursor = '';
      });
    });

    return () => {
      try {
        map.remove();
      } catch {
        /* noop */
      }
      mapRef.current = null;
      styleLoadedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push fresh polygon data into the map when `value` prop changes from outside.
  useEffect(() => {
    refreshPolygon();
    refreshVertices();
    // auto-fit on first load of a non-empty polygon
    const b = featureCollectionBounds(value);
    if (b && mapRef.current && styleLoadedRef.current) {
      mapRef.current.fitBounds(
        [
          [b.west, b.south],
          [b.east, b.north],
        ],
        { padding: 40, duration: 400, maxZoom: 16 },
      );
    }
  }, [value, refreshPolygon, refreshVertices]);

  // ---------- UI ----------

  const buttonStyle = useMemo<React.CSSProperties>(
    () => ({
      padding: '8px 14px',
      borderRadius: 8,
      border: '1px solid var(--app-border)',
      background: 'var(--app-surface)',
      color: 'var(--app-text)',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
    }),
    [],
  );
  const primaryStyle = useMemo<React.CSSProperties>(
    () => ({
      ...buttonStyle,
      background: 'var(--app-primary)',
      borderColor: 'var(--app-primary)',
      color: '#FFFFFF',
    }),
    [buttonStyle],
  );
  const dangerStyle = useMemo<React.CSSProperties>(
    () => ({
      ...buttonStyle,
      background: '#FEE2E2',
      borderColor: '#FCA5A5',
      color: '#B91C1C',
    }),
    [buttonStyle],
  );

  return (
    <div
      style={{
        background: 'var(--app-surface)',
        borderRadius: 14,
        border: '1px solid var(--app-border-subtle)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
        padding: 16,
      }}
    >
      {!readOnly && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          {mode === 'view' && (
            <>
              <button type="button" style={primaryStyle} onClick={startDraw}>
                Draw Polygon
              </button>
              <button type="button" style={buttonStyle} onClick={startEdit}>
                Edit Polygon
              </button>
              <button type="button" style={dangerStyle} onClick={deletePolygon}>
                Delete Polygon
              </button>
              <button type="button" style={buttonStyle} onClick={fitToPolygon}>
                Fit to Bounds
              </button>
            </>
          )}
          {mode === 'draw' && (
            <>
              <button type="button" style={primaryStyle} onClick={finishDrawing}>
                Finish
              </button>
              <button type="button" style={buttonStyle} onClick={cancelDraw}>
                Cancel
              </button>
            </>
          )}
          {mode === 'edit' && (
            <>
              <button type="button" style={primaryStyle} onClick={finishEdit}>
                Done
              </button>
              <button type="button" style={dangerStyle} onClick={deletePolygon}>
                Delete Polygon
              </button>
            </>
          )}
          {statusText && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 12,
                color: 'var(--app-text-muted)',
                fontWeight: 500,
              }}
            >
              {statusText}
            </span>
          )}
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: typeof height === 'number' ? `${height}px` : height,
          borderRadius: 10,
          overflow: 'hidden',
        }}
      />
    </div>
  );
}
