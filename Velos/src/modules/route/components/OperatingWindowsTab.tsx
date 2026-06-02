import { mockWindows } from '../data/mockRoutes';
import { card, pill, sectionTitle } from './uiStyles';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const parseHM = (t?: string): number => {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h + (m || 0) / 60;
};

export default function OperatingWindowsTab({ routeId }: { routeId: string }) {
  const windows = mockWindows.filter((w) => w.routeId === routeId);
  if (windows.length === 0) windows.push(...mockWindows);

  return (
    <div>
      {windows.map((w) => {
        const startH = parseHM(w.timeStartLocal);
        const endH = parseHM(w.timeEndLocal);
        return (
          <div key={w.windowId} style={{ ...card, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={sectionTitle}>{w.windowName}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={pill('#1E40AF', '#DBEAFE')}>{w.windowType}</span>
                <span style={pill('#475569', '#F1F5F9')}>{w.timezoneRef || '—'}</span>
                {w.nightOps && <span style={pill('#92400E', '#FEF3C7')}>Night ops</span>}
                {w.reducedNoiseRequired && (
                  <span style={pill('#065F46', '#D1FAE5')}>Reduced noise</span>
                )}
              </div>
            </div>

            {/* Day x Hour matrix */}
            <div style={{ overflowX: 'auto', marginTop: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(24, 1fr)', gap: 2 }}>
                <div />
                {Array.from({ length: 24 }).map((_, h) => (
                  <div
                    key={h}
                    style={{ fontSize: 9, color: '#94A3B8', textAlign: 'center', fontWeight: 700 }}
                  >
                    {h.toString().padStart(2, '0')}
                  </div>
                ))}
                {DAY_LABELS.map((d, di) => {
                  const dayIdx = di + 1;
                  const enabled = w.daysOfWeek?.includes(dayIdx);
                  return (
                    <FragmentRow
                      key={d}
                      label={d}
                      enabled={!!enabled}
                      startH={startH}
                      endH={endH}
                    />
                  );
                })}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
                gap: 12,
                marginTop: 14,
              }}
            >
              <Cell label="Window" value={`${w.timeStartLocal} – ${w.timeEndLocal}`} />
              <Cell label="Movements/hr" value={w.maxMovementsPerHour?.toString()} />
              <Cell label="Movements/day" value={w.maxMovementsPerDay?.toString()} />
              <Cell
                label="Slot duration"
                value={w.slotDurationSec ? `${Math.round(w.slotDurationSec / 60)} min` : '—'}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FragmentRow({
  label,
  enabled,
  startH,
  endH,
}: {
  label: string;
  enabled: boolean;
  startH: number;
  endH: number;
}) {
  return (
    <>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', padding: '4px 0' }}>{label}</div>
      {Array.from({ length: 24 }).map((_, h) => {
        const within = enabled && h >= startH && h < endH;
        return (
          <div
            key={h}
            style={{
              height: 18,
              background: within ? '#2563EB' : '#F1F5F9',
              borderRadius: 3,
              opacity: enabled ? 1 : 0.5,
            }}
          />
        );
      })}
    </>
  );
}

function Cell({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color: '#0F172A', fontWeight: 700 }}>{value || '—'}</div>
    </div>
  );
}
