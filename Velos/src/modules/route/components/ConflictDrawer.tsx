import type { CorridorReservationResponse, RouteConflictZoneResponse } from '../types';
import { btn, pill } from './uiStyles';
import ReservationCountdown from './ReservationCountdown';

interface Props {
  reservation: CorridorReservationResponse | null;
  conflicts: RouteConflictZoneResponse[];
  onClose: () => void;
}

const fmtDt = (s?: string) => (s ? new Date(s).toLocaleString() : '—');

export default function ConflictDrawer({ reservation, conflicts, onClose }: Props) {
  if (!reservation) return null;

  const related = conflicts.filter((c) => reservation.conflictZoneIds?.includes(c.conflictZoneId));

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,0.25)',
          zIndex: 1200,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          background: '#FFFFFF',
          borderLeft: '1px solid #E2E8F0',
          boxShadow: '-8px 0 24px rgba(15,23,42,0.08)',
          padding: 20,
          zIndex: 1201,
          overflowY: 'auto',
        }}
      >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>Reservation Details</div>
        <button style={btn} onClick={onClose}>
          Close
        </button>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={pill('#1E40AF', '#DBEAFE')}>{reservation.reservationStatus}</span>
        <span style={pill('#475569', '#F1F5F9')}>{reservation.lockType || '—'}</span>
        {reservation.priorityClass && (
          <span style={pill('#92400E', '#FEF3C7')}>{reservation.priorityClass}</span>
        )}
        {reservation.conflictsDetected && (
          <span style={pill('#9F1239', '#FFE4E6')}>⚠ CONFLICT</span>
        )}
        <ReservationCountdown expiresAt={reservation.softLockExpiresAt} />
      </div>

      <Section title="Schedule">
        <Row k="Planned Entry" v={fmtDt(reservation.plannedEntryTime)} />
        <Row k="Planned Exit" v={fmtDt(reservation.plannedExitTime)} />
        <Row k="Effective Entry" v={fmtDt(reservation.effectiveEntryTime)} />
        <Row k="Effective Exit" v={fmtDt(reservation.effectiveExitTime)} />
      </Section>

      <Section title="Locks">
        <Row k="Soft Lock Created" v={fmtDt(reservation.softLockCreatedAt)} />
        <Row k="Soft Lock Expires" v={fmtDt(reservation.softLockExpiresAt)} />
        <Row
          k="Extensions"
          v={`${reservation.softLockExtendedCount ?? 0} / ${reservation.maxSoftLockExtensions ?? '∞'}`}
        />
        <Row k="Hard Lock Created" v={fmtDt(reservation.hardLockCreatedAt)} />
      </Section>

      <Section title="UTM / NOTAM">
        <Row k="UTM Auth Status" v={reservation.utmAuthorisationStatus} />
        <Row k="UTM Auth Time" v={fmtDt(reservation.utmAuthorisationTime)} />
        <Row k="NOTAM Ref" v={reservation.notamReference} />
      </Section>

      {related.length > 0 && (
        <Section title={`Conflicts (${related.length})`}>
          {related.map((c) => (
            <div
              key={c.conflictZoneId}
              style={{
                padding: 10,
                border: '1px solid #FCA5A5',
                background: '#FEF2F2',
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#991B1B', marginBottom: 4 }}>
                {c.conflictType} · {c.resolutionMethod || 'unresolved'}
              </div>
              <Row k="Intersect ∠" v={c.intersectionAngleDeg != null ? `${c.intersectionAngleDeg}°` : '—'} />
              <Row k="Horiz Sep" v={c.horizontalSeparationM != null ? `${c.horizontalSeparationM} m` : '—'} />
              <Row k="Vert Sep" v={c.verticalSeparationFt != null ? `${c.verticalSeparationFt} ft` : '—'} />
              <Row
                k="Min Achievable"
                v={c.minSeparationAchievableSec != null ? `${c.minSeparationAchievableSec} s` : '—'}
              />
              <Row k="Required" v={c.requiredTimeSepSec != null ? `${c.requiredTimeSepSec} s` : '—'} />
              {c.notes && (
                <div style={{ fontSize: 11, color: '#7F1D1D', marginTop: 6 }}>{c.notes}</div>
              )}
            </div>
          ))}
        </Section>
      )}
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#64748B',
          letterSpacing: '0.06em',
          marginBottom: 6,
        }}
      >
        {title.toUpperCase()}
      </div>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0' }}>
      <span style={{ color: '#64748B' }}>{k}</span>
      <span style={{ color: '#0F172A', fontWeight: 600 }}>{v || '—'}</span>
    </div>
  );
}
