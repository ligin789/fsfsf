import { mockPerformance } from '../data/mockRoutes';
import { card, pill, sectionTitle } from './uiStyles';

export default function PerformanceTab({ routeId }: { routeId: string }) {
  const profiles = mockPerformance.filter((p) => p.routeId === routeId);
  const list = profiles.length ? profiles : mockPerformance;

  return (
    <div>
      {list.map((p) => (
        <div key={p.profileId} style={{ ...card, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={sectionTitle}>{p.aircraftTypeCode}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {p.oeiCapable && <span style={pill('#065F46', '#D1FAE5')}>OEI capable</span>}
              {p.noiseClass && <span style={pill('#475569', '#F1F5F9')}>Noise {p.noiseClass}</span>}
              {p.certificationBasis && (
                <span style={pill('#1E40AF', '#DBEAFE')}>{p.certificationBasis}</span>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 12,
              marginTop: 8,
            }}
          >
            <Cell
              label="Block Time"
              value={p.nominalBlockTimeSec ? `${Math.round(p.nominalBlockTimeSec / 60)} min` : '—'}
            />
            <Cell label="Total Energy" value={p.totalEnergyKwh ? `${p.totalEnergyKwh} kWh` : '—'} />
            <Cell label="Climb Energy" value={p.climbEnergyKwh ? `${p.climbEnergyKwh} kWh` : '—'} />
            <Cell label="Cruise Energy" value={p.cruiseEnergyKwh ? `${p.cruiseEnergyKwh} kWh` : '—'} />
            <Cell label="Descent Energy" value={p.descentEnergyKwh ? `${p.descentEnergyKwh} kWh` : '—'} />
            <Cell label="Hover Energy" value={p.hoverEnergyKwh ? `${p.hoverEnergyKwh} kWh` : '—'} />
            <Cell label="SoC at Departure" value={p.minSocAtDeparturePct ? `${p.minSocAtDeparturePct}%` : '—'} />
            <Cell
              label="Expected SoC arrival"
              value={p.expectedSocAtArrivalPct ? `${p.expectedSocAtArrivalPct}%` : '—'}
            />
            <Cell label="Max Payload" value={p.maxPayloadKg ? `${p.maxPayloadKg} kg` : '—'} />
            <Cell label="Max Pax" value={p.maxPassengerCount?.toString()} />
            <Cell label="OEI Range" value={p.oeiMaxRangeNm ? `${p.oeiMaxRangeNm} NM` : '—'} />
            <Cell label="Effective" value={p.effectiveFrom} />
          </div>
        </div>
      ))}
      {list.length === 0 && (
        <div style={{ padding: 16, color: '#94A3B8', fontSize: 13 }}>No performance profiles.</div>
      )}
    </div>
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
