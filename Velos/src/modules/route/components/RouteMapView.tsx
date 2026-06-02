import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { wktToGeoJSON, geometryBounds } from '../utils/wkt';
import type { RouteResponse, RouteWayPointResponse } from '../types';

const OSM_STYLE: maplibregl.StyleSpecification = {
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
};

interface Props {
  route: RouteResponse | null;
  waypoints: RouteWayPointResponse[];
  showCorridorVolume?: boolean;
  height?: number | string;
}

export default function RouteMapView({ route, waypoints, showCorridorVolume = false, height = '100%' }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!container.current || map.current) return;
    map.current = new maplibregl.Map({
      container: container.current,
      style: OSM_STYLE,
      center: [77.5946, 12.9716], // Bengaluru
      zoom: 10,
    });
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m || !route) return;

    const apply = () => {
      // Clean prior layers
      ['route-line', 'route-line-casing', 'corridor-fill', 'waypoint-circles', 'waypoint-labels'].forEach((id) => {
        if (m.getLayer(id)) m.removeLayer(id);
      });
      ['route-source', 'corridor-source', 'waypoint-source'].forEach((id) => {
        if (m.getSource(id)) m.removeSource(id);
      });

      const lineGeom = wktToGeoJSON(route.routeGeometryWkt);
      if (lineGeom) {
        m.addSource('route-source', {
          type: 'geojson',
          data: { type: 'Feature', geometry: lineGeom, properties: {} } as GeoJSON.Feature,
        });
        m.addLayer({
          id: 'route-line-casing',
          type: 'line',
          source: 'route-source',
          paint: { 'line-color': '#FFFFFF', 'line-width': 8 },
        });
        m.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-source',
          paint: { 'line-color': '#2563EB', 'line-width': 4 },
        });

        if (showCorridorVolume) {
          // Build a faux 200m buffer using bbox padding for visual hint.
          const bounds = geometryBounds(lineGeom);
          if (bounds) {
            const [[a, b], [c, d]] = bounds;
            const pad = 0.005;
            const poly: GeoJSON.Feature = {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [a - pad, b - pad],
                  [c + pad, b - pad],
                  [c + pad, d + pad],
                  [a - pad, d + pad],
                  [a - pad, b - pad],
                ]],
              },
              properties: {},
            };
            m.addSource('corridor-source', { type: 'geojson', data: poly });
            m.addLayer({
              id: 'corridor-fill',
              type: 'fill',
              source: 'corridor-source',
              paint: { 'fill-color': '#2563EB', 'fill-opacity': 0.08 },
            });
          }
        }
      }

      if (waypoints.length) {
        const features: GeoJSON.Feature[] = waypoints
          .filter((wp) => wp.latitudeDeg != null && wp.longitudeDeg != null)
          .map((wp) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [wp.longitudeDeg!, wp.latitudeDeg!] },
            properties: {
              name: wp.waypointName || '',
              type: wp.waypointType || '',
              seq: wp.sequenceNumber,
            },
          }));
        m.addSource('waypoint-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features },
        });
        m.addLayer({
          id: 'waypoint-circles',
          type: 'circle',
          source: 'waypoint-source',
          paint: {
            'circle-radius': 7,
            'circle-color': '#FFFFFF',
            'circle-stroke-color': '#2563EB',
            'circle-stroke-width': 2.5,
          },
        });
        m.addLayer({
          id: 'waypoint-labels',
          type: 'symbol',
          source: 'waypoint-source',
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 11,
            'text-offset': [0, 1.4],
            'text-anchor': 'top',
          },
          paint: { 'text-color': '#0F172A', 'text-halo-color': '#FFFFFF', 'text-halo-width': 1 },
        });
      }

      const bounds = geometryBounds(lineGeom);
      if (bounds) {
        m.fitBounds(bounds, { padding: 60, duration: 400 });
      }
    };

    if (m.isStyleLoaded()) apply();
    else m.once('load', apply);
  }, [route, waypoints, showCorridorVolume]);

  return (
    <div
      ref={container}
      style={{
        width: '100%',
        height,
        minHeight: 400,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
      }}
    />
  );
}
