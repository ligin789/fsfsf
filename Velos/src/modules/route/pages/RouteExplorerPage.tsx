import { useMemo, useState } from 'react';
import { HiOutlinePlus, HiOutlineCube } from 'react-icons/hi';
import RouteMapView from '../components/RouteMapView';
import RouteApprovalBanner from '../components/RouteApprovalBanner';
import RouteListSidebar from '../components/RouteListSidebar';
import RouteMetadataPanel from '../components/RouteMetadataPanel';
import WaypointStepper from '../components/WaypointStepper';
import SegmentList from '../components/SegmentList';
import CreateRouteWizard from '../components/CreateRouteWizard';
import { mockRoutes, mockWaypoints, mockSegments } from '../data/mockRoutes';
import {
  btn,
  btnPrimary,
  card,
  pageHeader,
  pageSubtitle,
  pageTitle,
  tabBar,
  tabItem,
} from '../components/uiStyles';
import type { RouteResponse } from '../types';

type ConfigTab = 'meta' | 'waypoints' | 'segments';

export default function RouteExplorerPage() {
  const [routes, setRoutes] = useState<RouteResponse[]>(mockRoutes);
  const [selectedId, setSelectedId] = useState<string>(mockRoutes[0]?.routeId ?? '');
  const [tab, setTab] = useState<ConfigTab>('meta');
  const [showCorridor, setShowCorridor] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const selected = useMemo(() => routes.find((r) => r.routeId === selectedId) ?? null, [routes, selectedId]);
  const waypoints = useMemo(() => mockWaypoints.filter((w) => w.routeId === selectedId), [selectedId]);
  const segments = useMemo(() => mockSegments.filter((s) => s.routeId === selectedId), [selectedId]);

  const handleCreated = (created: RouteResponse) => {
    setRoutes((prev) => [created, ...prev]);
    setSelectedId(created.routeId);
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={pageHeader}>
        <div>
          <h1 style={pageTitle}>Route Explorer & Designer</h1>
          <p style={pageSubtitle}>Spatial designer for routes, waypoints, and 3D corridor volumes.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btn} onClick={() => setShowCorridor((v) => !v)} title="Toggle corridor volume">
            <HiOutlineCube style={{ marginRight: 6 }} />
            {showCorridor ? 'Hide corridor' : 'Show corridor'}
          </button>
          <button style={btnPrimary} onClick={() => setShowCreate(true)}>
            <HiOutlinePlus style={{ marginRight: 6 }} />
            New Route
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <RouteApprovalBanner route={selected} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 380px',
          gap: 14,
          minHeight: 'calc(100vh - 280px)',
        }}
      >
        <div style={{ ...card, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--app-text)', marginBottom: 10 }}>
            Routes ({routes.length})
          </div>
          <RouteListSidebar routes={routes} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        <div style={{ ...card, padding: 8 }}>
          <RouteMapView route={selected} waypoints={waypoints} showCorridorVolume={showCorridor} />
        </div>

        <div style={card}>
          <div style={tabBar}>
            <div style={tabItem(tab === 'meta')} onClick={() => setTab('meta')}>
              Metadata
            </div>
            <div style={tabItem(tab === 'waypoints')} onClick={() => setTab('waypoints')}>
              Waypoints
            </div>
            <div style={tabItem(tab === 'segments')} onClick={() => setTab('segments')}>
              Segments
            </div>
          </div>
          {tab === 'meta' && <RouteMetadataPanel route={selected} />}
          {tab === 'waypoints' && <WaypointStepper waypoints={waypoints} />}
          {tab === 'segments' && <SegmentList segments={segments} waypoints={waypoints} />}
        </div>
      </div>

      <CreateRouteWizard
        show={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
