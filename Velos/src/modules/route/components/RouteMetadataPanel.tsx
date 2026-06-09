import type { RouteResponse } from '../types';
import { label, sectionTitle, statusBadge, value as valueStyle } from './uiStyles';

interface Props {
  route: RouteResponse | null;
}

export default function RouteMetadataPanel({ route }: Props) {
  if (!route) return <div style={{ color: 'var(--app-text-faint)', fontSize: 13 }}>Select a route to view metadata.</div>;

  return (
    <div>
      <div style={sectionTitle}>Route Metadata</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 14 }}>
        <Field label="Designator" value={route.routeDesignator} />
        <Field label="Type" value={route.routeType} />
        <Field label="Class" value={route.routeClass} />
        <Field label="Flight Rules" value={route.flightRules} />
        <Field label="Category" value={route.routeCategory} />
        <div>
          <div style={label}>Status</div>
          <span style={statusBadge(route.status)}>{route.status || '—'}</span>
        </div>
        <Field label="Bidirectional" value={route.isBidirectional ? 'Yes' : 'No'} />
        <Field label="Version" value={route.currentVersion != null ? `v${route.currentVersion}` : undefined} />
        <Field label="Total Dist" value={route.totalDistanceNm ? `${route.totalDistanceNm} NM` : undefined} />
        <Field label="Cruise Alt" value={route.cruiseAltitudeFt ? `${route.cruiseAltitudeFt} ft` : undefined} />
        <Field label="Speed (nom)" value={route.nominalSpeedKts ? `${route.nominalSpeedKts} kt` : undefined} />
        <Field
          label="Block Time"
          value={route.nominalBlockTimeSec ? `${Math.round(route.nominalBlockTimeSec / 60)} min` : undefined}
        />
        <Field label="Waypoints" value={route.waypointCount?.toString()} />
        <Field label="Segments" value={route.segmentCount?.toString()} />
        <Field
          label="Airspace"
          value={route.airspaceClasses?.length ? route.airspaceClasses.join(', ') : undefined}
        />
        <Field label="FIR" value={route.firCodes?.length ? route.firCodes.join(', ') : undefined} />
        <Field label="Effective From" value={route.effectiveFrom} />
        <Field label="Effective Until" value={route.effectiveUntil} />
      </div>
    </div>
  );
}

function Field({ label: l, value }: { label: string; value?: string }) {
  return (
    <div>
      <div style={label}>{l}</div>
      <div style={valueStyle}>{value || '—'}</div>
    </div>
  );
}
