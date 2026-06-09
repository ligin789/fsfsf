import type { RouteWayPointResponse } from '../types';
import { pill, sectionTitle } from './uiStyles';

interface Props {
  waypoints: RouteWayPointResponse[];
}

export default function WaypointStepper({ waypoints }: Props) {
  const ordered = [...waypoints].sort((a, b) => a.sequenceNumber - b.sequenceNumber);

  return (
    <div>
      <div style={sectionTitle}>Waypoints ({ordered.length})</div>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 11,
            top: 6,
            bottom: 6,
            width: 2,
            background: 'var(--app-border)',
          }}
        />
        {ordered.map((wp) => (
          <div key={wp.waypointId} style={{ position: 'relative', paddingLeft: 36, marginBottom: 14 }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 2,
                width: 24,
                height: 24,
                borderRadius: 999,
                background: 'var(--app-surface)',
                border: '2px solid var(--app-primary)',
                color: 'var(--app-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {wp.sequenceNumber}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--app-text)' }}>
              {wp.waypointName}{' '}
              <span style={{ fontSize: 11, color: 'var(--app-text-subtle)', fontWeight: 600 }}>{wp.waypointType}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--app-text-subtle)', marginTop: 2 }}>
              {wp.latitudeDeg?.toFixed(4)}°, {wp.longitudeDeg?.toFixed(4)}°
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {wp.altitudeTargetFt != null && (
                <span style={pill('#1E40AF', '#DBEAFE')}>ALT {wp.altitudeTargetFt}ft</span>
              )}
              {wp.altitudeFloorFt != null && wp.altitudeCeilingFt != null && (
                <span style={pill('var(--app-text-muted)', 'var(--app-border-subtle)')}>
                  {wp.altitudeFloorFt}–{wp.altitudeCeilingFt}ft
                </span>
              )}
              {wp.speedTargetKts != null && (
                <span style={pill('#065F46', '#D1FAE5')}>SPD {wp.speedTargetKts}kt</span>
              )}
              {wp.isCompulsoryReport && <span style={pill('#9F1239', '#FFE4E6')}>RPT</span>}
            </div>
          </div>
        ))}
        {ordered.length === 0 && (
          <div style={{ padding: 16, color: 'var(--app-text-faint)', fontSize: 13 }}>No waypoints defined.</div>
        )}
      </div>
    </div>
  );
}
