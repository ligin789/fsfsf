import type { CorridorReservationResponse, RouteCorridorResponse } from '../types';

interface Props {
  corridors: RouteCorridorResponse[];
  reservations: CorridorReservationResponse[];
  windowHours?: number;
  onSelect: (r: CorridorReservationResponse) => void;
  selectedId?: string;
}

const colorFor = (r: CorridorReservationResponse) => {
  if (r.conflictsDetected) return { fill: '#FEE2E2', border: '#EF4444', text: '#991B1B' };
  if (r.reservationStatus === 'CANCELLED') return { fill: '#F1F5F9', border: '#CBD5E1', text: '#64748B' };
  if (r.lockType === 'HARD_LOCK' || r.reservationStatus === 'CONFIRMED')
    return { fill: '#DBEAFE', border: '#2563EB', text: '#1E3A8A' };
  // soft lock
  return { fill: '#E2E8F0', border: '#94A3B8', text: '#334155' };
};

export default function ReservationGantt({
  corridors,
  reservations,
  windowHours = 4,
  onSelect,
  selectedId,
}: Props) {
  const startMs = Date.now() - 30 * 60_000;
  const endMs = startMs + windowHours * 3600_000;
  const span = endMs - startMs;

  const hourTicks: number[] = [];
  for (let t = startMs; t <= endMs; t += 30 * 60_000) hourTicks.push(t);

  const fmt = (ms: number) => {
    const d = new Date(ms);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const ROW_H = 48;
  const LABEL_W = 220;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ minWidth: 800 }}>
        {/* Time header */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ width: LABEL_W, padding: 8, fontSize: 11, fontWeight: 700, color: '#64748B' }}>
            CORRIDOR
          </div>
          <div style={{ flex: 1, position: 'relative', height: 28 }}>
            {hourTicks.map((t) => {
              const pct = ((t - startMs) / span) * 100;
              return (
                <div
                  key={t}
                  style={{
                    position: 'absolute',
                    left: `${pct}%`,
                    top: 0,
                    bottom: 0,
                    borderLeft: '1px dashed #E2E8F0',
                    fontSize: 10,
                    color: '#64748B',
                    paddingLeft: 4,
                  }}
                >
                  {fmt(t)}
                </div>
              );
            })}
          </div>
        </div>

        {corridors.map((c) => {
          const rows = reservations.filter((r) => r.corridorId === c.corridorId);
          return (
            <div key={c.corridorId} style={{ display: 'flex', borderBottom: '1px solid #F1F5F9' }}>
              <div
                style={{
                  width: LABEL_W,
                  padding: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#0F172A',
                  borderRight: '1px solid #F1F5F9',
                }}
              >
                {c.corridorName}
                <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>
                  {c.floorAltitudeFt}–{c.ceilingAltitudeFt} ft
                </div>
              </div>
              <div style={{ flex: 1, position: 'relative', height: ROW_H }}>
                {hourTicks.map((t) => {
                  const pct = ((t - startMs) / span) * 100;
                  return (
                    <div
                      key={t}
                      style={{
                        position: 'absolute',
                        left: `${pct}%`,
                        top: 0,
                        bottom: 0,
                        borderLeft: '1px dashed #F1F5F9',
                      }}
                    />
                  );
                })}
                {rows.map((r) => {
                  const a = r.plannedEntryTime ? new Date(r.plannedEntryTime).getTime() : 0;
                  const b = r.plannedExitTime ? new Date(r.plannedExitTime).getTime() : 0;
                  if (!a || !b) return null;
                  const left = Math.max(0, ((a - startMs) / span) * 100);
                  const right = Math.min(100, ((b - startMs) / span) * 100);
                  const width = Math.max(2, right - left);
                  const c = colorFor(r);
                  const active = selectedId === r.reservationId;
                  return (
                    <button
                      key={r.reservationId}
                      onClick={() => onSelect(r)}
                      style={{
                        position: 'absolute',
                        left: `${left}%`,
                        width: `${width}%`,
                        top: 6,
                        bottom: 6,
                        background: c.fill,
                        border: `2px solid ${active ? '#0F172A' : c.border}`,
                        color: c.text,
                        borderRadius: 6,
                        padding: '2px 6px',
                        fontSize: 11,
                        fontWeight: 700,
                        textAlign: 'left',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                      title={`${r.flightId || r.reservationId} · ${r.reservationStatus}`}
                    >
                      {r.flightId || r.reservationId.slice(0, 6)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
