import { useState } from 'react';
import WeatherConstraintsTab from '../components/WeatherConstraintsTab';
import OperatingWindowsTab from '../components/OperatingWindowsTab';
import PerformanceTab from '../components/PerformanceTab';
import { mockRoutes } from '../data/mockRoutes';
import { input, pageHeader, pageSubtitle, pageTitle, tabBar, tabItem } from '../components/uiStyles';

type Tab = 'weather' | 'windows' | 'performance';

export default function ConstraintsPage() {
  const [routeId, setRouteId] = useState<string>(mockRoutes[0]?.routeId ?? '');
  const [tab, setTab] = useState<Tab>('weather');

  return (
    <div style={{ padding: 24 }}>
      <div style={pageHeader}>
        <div>
          <h1 style={pageTitle}>Constraints & Performance</h1>
          <p style={pageSubtitle}>Weather thresholds, operating windows, and aircraft performance per route.</p>
        </div>
        <select value={routeId} onChange={(e) => setRouteId(e.target.value)} style={{ ...input, maxWidth: 280 }}>
          {mockRoutes.map((r) => (
            <option key={r.routeId} value={r.routeId}>
              {r.routeDesignator} — {r.routeName}
            </option>
          ))}
        </select>
      </div>

      <div style={tabBar}>
        <div style={tabItem(tab === 'weather')} onClick={() => setTab('weather')}>
          Weather
        </div>
        <div style={tabItem(tab === 'windows')} onClick={() => setTab('windows')}>
          Operating Windows
        </div>
        <div style={tabItem(tab === 'performance')} onClick={() => setTab('performance')}>
          Performance Profiles
        </div>
      </div>

      {tab === 'weather' && <WeatherConstraintsTab routeId={routeId} />}
      {tab === 'windows' && <OperatingWindowsTab routeId={routeId} />}
      {tab === 'performance' && <PerformanceTab routeId={routeId} />}
    </div>
  );
}
