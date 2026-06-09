/**
 * GeoOverviewMap
 *
 * Read-only map that plots ALL geographical entities (clusters / regions / zones)
 * at once and highlights the currently selected one — zooming/fitting to it.
 * Clicking a polygon selects it too.
 */
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  wktToFeatureCollection,
  featureCollectionBounds,
  type GeoFeatureCollection,
} from '../../utils/geojsonUtils';

export interface GeoOverviewItem {
  id: string;
  label?: string;
  wkt?: string | null;
}

interface Props {
  items: GeoOverviewItem[];
  selectedId?: string | null;
  height?: number;
  onSelect?: (id: string) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
  /** Accent colour for the highlight overlay around the selected boundary. */
  overlayColor?: 'blue' | 'red';
}

const OVERLAY_PALETTE = {
  blue: { halo: '#3B82F6', line: '#1D4ED8', fill: '#2563EB' },
  red: { halo: '#F87171', line: '#DC2626', fill: '#EF4444' },
} as const;

const ALL_SRC = 'geo-ov-all-src';
const ALL_FILL = 'geo-ov-all-fill';
const ALL_LINE = 'geo-ov-all-line';
const SEL_SRC = 'geo-ov-sel-src';
const SEL_FILL = 'geo-ov-sel-fill';
const SEL_HALO = 'geo-ov-sel-halo';
const SEL_LINE = 'geo-ov-sel-line';
const LABEL_SRC = 'geo-ov-label-src';
const LABEL_LAYER = 'geo-ov-label-layer';

const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

const centroidOf = (fc: GeoFeatureCollection): [number, number] | null => {
  const b = featureCollectionBounds(fc);
  if (!b) return null;
  return [(b.west + b.east) / 2, (b.south + b.north) / 2];
};

export default function GeoOverviewMap({
  items,
  selectedId,
  height = 420,
  onSelect,
  initialCenter = [77.62, 12.97], // Bengaluru
  initialZoom = 9.5,
  overlayColor = 'blue',
}: Props) {
  const palette = OVERLAY_PALETTE[overlayColor];
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const styleLoadedRef = useRef(false);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Build "all" + "label" feature collections, tagged with id/label.
  const buildAll = (): GeoJSON.FeatureCollection => {
    const features: GeoJSON.Feature[] = [];
    items.forEach((it) => {
      const fc = wktToFeatureCollection(it.wkt);
      fc.features.forEach((f) =>
        features.push({
          type: 'Feature',
          geometry: f.geometry as GeoJSON.Geometry,
          properties: { id: it.id, label: it.label || '' },
        }),
      );
    });
    return { type: 'FeatureCollection', features };
  };

  const buildLabels = (): GeoJSON.FeatureCollection => {
    const features: GeoJSON.Feature[] = [];
    items.forEach((it) => {
      const fc = wktToFeatureCollection(it.wkt);
      const c = centroidOf(fc);
      if (c) {
        features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: c },
          properties: { id: it.id, label: it.label || '' },
        });
      }
    });
    return { type: 'FeatureCollection', features };
  };

  const buildSelected = (): GeoJSON.FeatureCollection => {
    if (!selectedId) return EMPTY;
    const it = items.find((x) => x.id === selectedId);
    if (!it) return EMPTY;
    const fc = wktToFeatureCollection(it.wkt);
    return {
      type: 'FeatureCollection',
      features: fc.features.map((f) => ({
        type: 'Feature',
        geometry: f.geometry as GeoJSON.Geometry,
        properties: { id: it.id },
      })),
    };
  };

  const setData = (srcId: string, data: GeoJSON.FeatureCollection) => {
    const map = mapRef.current;
    if (!map || !styleLoadedRef.current) return;
    const src = map.getSource(srcId) as maplibregl.GeoJSONSource | undefined;
    if (src) src.setData(data as never);
  };

  const fitToSelection = (animate = true) => {
    const map = mapRef.current;
    if (!map) return;
    const selId = selectedId;
    const target = selId
      ? wktToFeatureCollection(items.find((x) => x.id === selId)?.wkt)
      : null;
    const bounds = target && target.features.length ? featureCollectionBounds(target) : null;
    if (bounds) {
      map.fitBounds(
        [
          [bounds.west, bounds.south],
          [bounds.east, bounds.north],
        ],
        { padding: 60, duration: animate ? 500 : 0, maxZoom: 13 },
      );
    }
  };

  // ---------- init map once ----------
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

      map.addSource(ALL_SRC, { type: 'geojson', data: buildAll() });
      map.addLayer({
        id: ALL_FILL,
        type: 'fill',
        source: ALL_SRC,
        paint: { 'fill-color': '#94A3B8', 'fill-opacity': 0.12 },
      });
      map.addLayer({
        id: ALL_LINE,
        type: 'line',
        source: ALL_SRC,
        paint: { 'line-color': '#64748B', 'line-width': 1.5 },
      });

      map.addSource(SEL_SRC, { type: 'geojson', data: buildSelected() });
      map.addLayer({
        id: SEL_FILL,
        type: 'fill',
        source: SEL_SRC,
        paint: { 'fill-color': palette.fill, 'fill-opacity': 0.18 },
      });
      // Wide, soft halo overlay around the boundary.
      map.addLayer({
        id: SEL_HALO,
        type: 'line',
        source: SEL_SRC,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': palette.halo,
          'line-width': 12,
          'line-opacity': 0.35,
          'line-blur': 4,
        },
      });
      // Crisp boundary line on top of the halo.
      map.addLayer({
        id: SEL_LINE,
        type: 'line',
        source: SEL_SRC,
        paint: { 'line-color': palette.line, 'line-width': 3 },
      });

      map.addSource(LABEL_SRC, { type: 'geojson', data: buildLabels() });
      map.addLayer({
        id: LABEL_LAYER,
        type: 'symbol',
        source: LABEL_SRC,
        layout: {
          'text-field': ['get', 'label'],
          'text-size': 11,
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#0F172A',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.4,
        },
      });

      // click to select
      const clickHandler = (e: maplibregl.MapLayerMouseEvent) => {
        const id = (e.features?.[0]?.properties as { id?: string } | undefined)?.id;
        if (id && onSelectRef.current) onSelectRef.current(id);
      };
      map.on('click', ALL_FILL, clickHandler);
      map.on('click', SEL_FILL, clickHandler);
      map.on('mouseenter', ALL_FILL, () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', ALL_FILL, () => (map.getCanvas().style.cursor = ''));

      // initial fit
      if (selectedId) {
        fitToSelection(false);
      } else {
        const allBounds = featureCollectionBounds({
          type: 'FeatureCollection',
          features: items.flatMap((it) => wktToFeatureCollection(it.wkt).features),
        });
        if (allBounds) {
          map.fitBounds(
            [
              [allBounds.west, allBounds.south],
              [allBounds.east, allBounds.north],
            ],
            { padding: 50, duration: 0, maxZoom: 12 },
          );
        }
      }
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

  // refresh all/labels when items change
  useEffect(() => {
    setData(ALL_SRC, buildAll());
    setData(LABEL_SRC, buildLabels());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // refresh selection + fit when selection changes
  useEffect(() => {
    setData(SEL_SRC, buildSelected());
    fitToSelection(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, items]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid var(--app-border)',
      }}
    />
  );
}
