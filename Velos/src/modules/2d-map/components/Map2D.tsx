import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type {
  FeatureCollection,
  Feature,
  Polygon,
  GeoJsonProperties,
} from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';
import geoData from '../data/geoZones.json';

// ---------- Types for the dummy data ----------
interface Zone {
  id: string;
  code: string;
  name: string;
  type: string;
  status: string;
  geometry: number[][][];
}
interface Region {
  id: string;
  code: string;
  name: string;
  status: string;
  geometry: number[][][];
  zones: Zone[];
}
interface Cluster {
  id: string;
  code: string;
  name: string;
  status: string;
  geometry: number[][][];
  regions: Region[];
}

const clusters = (geoData as { clusters: Cluster[] }).clusters;

const BANGALORE_CENTER: [number, number] = [77.66, 12.97];

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

const NONE = '__none__';

// ---------- Helpers ----------
const poly = (
  geometry: number[][][],
  properties: GeoJsonProperties,
): Feature<Polygon> => ({
  type: 'Feature',
  geometry: { type: 'Polygon', coordinates: geometry },
  properties,
});

const fc = (features: Feature<Polygon>[]): FeatureCollection => ({
  type: 'FeatureCollection',
  features,
});

const boundsOf = (geometry: number[][][]): maplibregl.LngLatBounds => {
  const b = new maplibregl.LngLatBounds();
  geometry[0].forEach(([lng, lat]) => b.extend([lng, lat]));
  return b;
};

// Colours (literal — map paints can't read CSS vars)
const C_CLUSTER = '#2563EB';
const C_REGION = '#0D9488';
const C_ZONE = '#D97706';

export default function Map2D() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCluster = useMemo(
    () => clusters.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );

  // Pre-build the GeoJSON feature collections once.
  const collections = useMemo(() => {
    const clusterFeatures: Feature<Polygon>[] = [];
    const regionFeatures: Feature<Polygon>[] = [];
    const zoneFeatures: Feature<Polygon>[] = [];

    clusters.forEach((cl) => {
      clusterFeatures.push(
        poly(cl.geometry, { id: cl.id, name: cl.name, code: cl.code, status: cl.status }),
      );
      cl.regions.forEach((rg) => {
        regionFeatures.push(
          poly(rg.geometry, {
            id: rg.id,
            name: rg.name,
            code: rg.code,
            status: rg.status,
            clusterId: cl.id,
          }),
        );
        rg.zones.forEach((zn) => {
          zoneFeatures.push(
            poly(zn.geometry, {
              id: zn.id,
              name: zn.name,
              code: zn.code,
              status: zn.status,
              type: zn.type,
              clusterId: cl.id,
              regionId: rg.id,
            }),
          );
        });
      });
    });

    return {
      clusters: fc(clusterFeatures),
      regions: fc(regionFeatures),
      zones: fc(zoneFeatures),
    };
  }, []);

  // ---------- Init map ----------
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: OSM_STYLE,
      center: BANGALORE_CENTER,
      zoom: 10.2,
    });
    map.current = m;

    m.on('load', () => {
      m.addSource('clusters', { type: 'geojson', data: collections.clusters, promoteId: 'id' });
      m.addSource('regions', { type: 'geojson', data: collections.regions });
      m.addSource('zones', { type: 'geojson', data: collections.zones });

      // Cluster fill — brighter when selected (feature-state)
      m.addLayer({
        id: 'cluster-fill',
        type: 'fill',
        source: 'clusters',
        paint: {
          'fill-color': C_CLUSTER,
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            0.22,
            0.05,
          ],
        },
      });
      m.addLayer({
        id: 'cluster-line',
        type: 'line',
        source: 'clusters',
        paint: {
          'line-color': C_CLUSTER,
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            3,
            1.4,
          ],
        },
      });

      // Regions — only shown for the selected cluster
      m.addLayer({
        id: 'region-fill',
        type: 'fill',
        source: 'regions',
        filter: ['==', ['get', 'clusterId'], NONE],
        paint: { 'fill-color': C_REGION, 'fill-opacity': 0.18 },
      });
      m.addLayer({
        id: 'region-line',
        type: 'line',
        source: 'regions',
        filter: ['==', ['get', 'clusterId'], NONE],
        paint: { 'line-color': C_REGION, 'line-width': 1.6, 'line-dasharray': [2, 1] },
      });

      // Zones — only shown for the selected cluster
      m.addLayer({
        id: 'zone-fill',
        type: 'fill',
        source: 'zones',
        filter: ['==', ['get', 'clusterId'], NONE],
        paint: { 'fill-color': C_ZONE, 'fill-opacity': 0.32 },
      });
      m.addLayer({
        id: 'zone-line',
        type: 'line',
        source: 'zones',
        filter: ['==', ['get', 'clusterId'], NONE],
        paint: { 'line-color': C_ZONE, 'line-width': 1.4 },
      });

      // Click a cluster polygon to select it
      m.on('click', 'cluster-fill', (e) => {
        const id = e.features?.[0]?.properties?.id as string | undefined;
        if (id) setSelectedId(id);
      });
      m.on('mouseenter', 'cluster-fill', () => {
        m.getCanvas().style.cursor = 'pointer';
      });
      m.on('mouseleave', 'cluster-fill', () => {
        m.getCanvas().style.cursor = '';
      });

      setReady(true);
    });

    return () => {
      m.remove();
      map.current = null;
      setReady(false);
    };
  }, [collections]);

  // ---------- React to selection ----------
  useEffect(() => {
    const m = map.current;
    if (!m || !ready) return;

    // Highlight the chosen cluster, clear the rest.
    clusters.forEach((cl) => {
      m.setFeatureState({ source: 'clusters', id: cl.id }, { selected: cl.id === selectedId });
    });

    const filter: maplibregl.FilterSpecification = [
      '==',
      ['get', 'clusterId'],
      selectedId ?? NONE,
    ];
    ['region-fill', 'region-line', 'zone-fill', 'zone-line'].forEach((layer) =>
      m.setFilter(layer, filter),
    );

    if (selectedCluster) {
      m.fitBounds(boundsOf(selectedCluster.geometry), { padding: 60, duration: 600 });
    }
  }, [selectedId, selectedCluster, ready]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '600px' }}>
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100%', minHeight: '600px', borderRadius: '12px' }}
      />

      {/* Cluster selector / hierarchy panel */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          width: 280,
          maxHeight: 'calc(100% - 28px)',
          overflowY: 'auto',
          background: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
          borderRadius: 12,
          boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
          padding: 14,
          zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--app-text)' }}>
            Operating Clusters
          </span>
          {selectedId && (
            <button
              onClick={() => setSelectedId(null)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--app-primary)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>

        {clusters.map((cl) => {
          const active = cl.id === selectedId;
          return (
            <div key={cl.id} style={{ marginBottom: 8 }}>
              <button
                onClick={() => setSelectedId(active ? null : cl.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 9,
                  border: `1px solid ${active ? C_CLUSTER : 'var(--app-border)'}`,
                  background: active ? 'var(--app-primary-subtle)' : 'var(--app-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: 3, background: C_CLUSTER, flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--app-text)' }}>
                    {cl.name}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--app-text-faint)' }}>
                    {cl.code} · {cl.regions.length} regions
                  </span>
                </span>
                <StatusDot status={cl.status} />
              </button>

              {/* Expand the selected cluster's regions → zones */}
              {active && (
                <div style={{ margin: '6px 0 2px 14px', borderLeft: '2px solid var(--app-border)', paddingLeft: 10 }}>
                  {cl.regions.map((rg) => (
                    <div key={rg.id} style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: C_REGION }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--app-text-strong)' }}>
                          {rg.name}
                        </span>
                      </div>
                      <div style={{ marginLeft: 14 }}>
                        {rg.zones.map((zn) => (
                          <div
                            key={zn.id}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C_ZONE }} />
                            <span style={{ fontSize: 11.5, color: 'var(--app-text-subtle)' }}>
                              {zn.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--app-border-subtle)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <LegendRow color={C_CLUSTER} label="Cluster" />
          <LegendRow color={C_REGION} label="Region" />
          <LegendRow color={C_ZONE} label="Zone" />
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === 'ACTIVE' ? '#16A34A' : status === 'PLANNED' ? '#2563EB' : status === 'RESTRICTED' ? '#DC2626' : '#94A3B8';
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        color,
        background: `${color}22`,
        padding: '2px 6px',
        borderRadius: 999,
        letterSpacing: '0.04em',
        flexShrink: 0,
      }}
    >
      {status}
    </span>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 14, height: 8, borderRadius: 2, background: color, opacity: 0.6, border: `1px solid ${color}` }} />
      <span style={{ fontSize: 11, color: 'var(--app-text-subtle)' }}>{label}</span>
    </div>
  );
}
