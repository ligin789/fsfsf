import { useState } from 'react';
import { HiOutlineCalendar, HiOutlineExclamation } from 'react-icons/hi';
import ReservationGantt from '../components/ReservationGantt';
import ConflictDrawer from '../components/ConflictDrawer';
import {
  mockCorridors,
  mockReservations,
  mockConflictZones,
} from '../data/mockRoutes';
import {
  btn,
  card,
  pageHeader,
  pageSubtitle,
  pageTitle,
  pill,
} from '../components/uiStyles';
import type { CorridorReservationResponse } from '../types';

export default function ReservationsPage() {
  const [selected, setSelected] = useState<CorridorReservationResponse | null>(null);
  const [windowHours, setWindowHours] = useState(4);

  const totalConflicts = mockReservations.filter((r) => r.conflictsDetected).length;

  return (
    <div style={{ padding: 24 }}>
      <div style={pageHeader}>
        <div>
          <h1 style={pageTitle}>Scheduling & Corridor Reservations</h1>
          <p style={pageSubtitle}>Time-axis view of corridor bookings with conflict surface.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {totalConflicts > 0 && (
            <span style={pill('#9F1239', '#FFE4E6')}>
              <HiOutlineExclamation style={{ marginRight: 4 }} />
              {totalConflicts} conflict{totalConflicts > 1 ? 's' : ''} detected
            </span>
          )}
          <div style={{ display: 'flex', gap: 4 }}>
            {[2, 4, 8, 12].map((h) => (
              <button
                key={h}
                style={{ ...btn, padding: '6px 10px', background: windowHours === h ? '#EFF6FF' : '#FFFFFF' }}
                onClick={() => setWindowHours(h)}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={card}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 700,
            color: '#0F172A',
            marginBottom: 12,
          }}
        >
          <HiOutlineCalendar />
          Corridors × Time
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Legend color="#2563EB" label="Hard Lock" />
            <Legend color="#94A3B8" label="Soft Lock" />
            <Legend color="#EF4444" label="Conflict" />
            <Legend color="#CBD5E1" label="Cancelled" />
          </div>
        </div>
        <ReservationGantt
          corridors={mockCorridors}
          reservations={mockReservations}
          windowHours={windowHours}
          onSelect={setSelected}
          selectedId={selected?.reservationId}
        />
      </div>

      <ConflictDrawer
        reservation={selected}
        conflicts={mockConflictZones}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569' }}>
      <span
        style={{
          width: 12,
          height: 12,
          background: color,
          opacity: 0.4,
          borderRadius: 3,
          border: `1.5px solid ${color}`,
        }}
      />
      {label}
    </div>
  );
}
