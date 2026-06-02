import Gauge from './Gauge';
import { card, pill, sectionTitle } from './uiStyles';
import { mockWeather } from '../data/mockRoutes';

export default function WeatherConstraintsTab({ routeId }: { routeId: string }) {
  const w = mockWeather.find((x) => x.routeId === routeId) ?? mockWeather[0];

  return (
    <div>
      <div style={card}>
        <div style={sectionTitle}>{w?.constraintName || 'Weather Constraint'}</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12,
          }}
        >
          <Gauge label="Max Headwind" value={w?.maxHeadwindKts} unit="kt" max={50} warnAt={40} />
          <Gauge label="Max Tailwind" value={w?.maxTailwindKts} unit="kt" max={20} warnAt={15} />
          <Gauge label="Max Crosswind" value={w?.maxCrosswindKts} unit="kt" max={30} warnAt={25} />
          <Gauge label="Max Gust" value={w?.maxGustKts} unit="kt" max={50} warnAt={40} />
          <Gauge label="Min Visibility" value={w?.minVisibilitySm} unit="sm" max={3} />
          <Gauge label="Min Ceiling" value={w?.minCeilingFt} unit="ft" max={2000} />
          <Gauge label="Min RVR" value={w?.minRvrFt} unit="ft" max={4000} />
          <Gauge label="Min Temp" value={w?.minTempC} unit="°C" max={40} />
          <Gauge label="Max Temp" value={w?.maxTempC} unit="°C" max={50} warnAt={40} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>
          <span style={pill('#475569', '#F1F5F9')}>Precip: {w?.precipitationAllowed || 'NONE'}</span>
          <span style={pill('#475569', '#F1F5F9')}>
            Turbulence ≤ {w?.maxTurbulenceIntensity || '—'}
          </span>
          {w?.freezingPrecipAllowed ? (
            <span style={pill('#92400E', '#FEF3C7')}>Freezing allowed</span>
          ) : (
            <span style={pill('#065F46', '#D1FAE5')}>No freezing</span>
          )}
          {w?.icingConditionsAllowed ? (
            <span style={pill('#92400E', '#FEF3C7')}>Icing allowed</span>
          ) : (
            <span style={pill('#065F46', '#D1FAE5')}>No icing</span>
          )}
          {w?.autoCloseOnSigmet && <span style={pill('#9F1239', '#FFE4E6')}>Auto-close · SIGMET</span>}
          {w?.autoCloseOnPirep && <span style={pill('#9F1239', '#FFE4E6')}>Auto-close · PIREP</span>}
          {w?.breachAction && (
            <span style={pill('#1E40AF', '#DBEAFE')}>On breach: {w.breachAction}</span>
          )}
        </div>
      </div>
    </div>
  );
}
