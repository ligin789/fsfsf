import type { RouteSegmentResponse, RouteWayPointResponse } from '../types';
import { pill, sectionTitle } from './uiStyles';

interface Props {
  segments: RouteSegmentResponse[];
  waypoints: RouteWayPointResponse[];
}

const fmtMin = (sec?: number) => (sec == null ? '—' : `${Math.round(sec / 60)}m`);

export default function SegmentList({ segments, waypoints }: Props) {
  const wpName = (id?: string) => waypoints.find((w) => w.waypointId === id)?.waypointName || '—';
  const ordered = [...segments].sort((a, b) => a.sequenceNumber - b.sequenceNumber);

  return (
    <div>
      <div style={sectionTitle}>Segments ({ordered.length})</div>
      {ordered.map((seg) => (
        <div
          key={seg.segmentId}
          style={{
            padding: 12,
            border: '1px solid var(--app-border)',
            borderRadius: 10,
            marginBottom: 10,
            background: 'var(--app-surface-subtle)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--app-text)' }}>
              {wpName(seg.fromWaypointId)} → {wpName(seg.toWaypointId)}
            </div>
            <span style={pill('#1E40AF', '#DBEAFE')}>{seg.segmentType || seg.legType || 'SEG'}</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
              gap: 8,
              marginTop: 10,
              fontSize: 12,
              color: 'var(--app-text-muted)',
            }}
          >
            <Stat label="Dist" value={`${seg.greatCircleDistanceNm ?? '—'} NM`} />
            <Stat label="Time" value={fmtMin(seg.nominalTransitTimeSec)} />
            <Stat label="Energy" value={`${seg.energyKwh ?? '—'} kWh`} />
            <Stat label="ΔSoC" value={socDelta(seg)} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {seg.urbanOverfly && <span style={pill('#9F1239', '#FFE4E6')}>URBAN</span>}
            {seg.noiseSensitive && <span style={pill('#92400E', '#FEF3C7')}>NOISE</span>}
            {seg.overflyRiskClass && (
              <span style={pill('var(--app-text-muted)', 'var(--app-border-subtle)')}>RISK {seg.overflyRiskClass}</span>
            )}
            {seg.requiredSeparationNm != null && (
              <span style={pill('#1E40AF', '#DBEAFE')}>SEP {seg.requiredSeparationNm} NM</span>
            )}
          </div>
        </div>
      ))}
      {ordered.length === 0 && (
        <div style={{ padding: 16, color: 'var(--app-text-faint)', fontSize: 13 }}>No segments yet.</div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--app-text-faint)', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--app-text)' }}>{value}</div>
    </div>
  );
}

const socDelta = (s: RouteSegmentResponse) => {
  if (s.batterySocStartPct == null || s.batterySocEndPct == null) return '—';
  return `${(s.batterySocStartPct - s.batterySocEndPct).toFixed(1)}%`;
};
