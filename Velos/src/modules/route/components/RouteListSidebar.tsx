import type { RouteResponse } from '../types';
import { statusBadge } from './uiStyles';

interface Props {
  routes: RouteResponse[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function RouteListSidebar({ routes, selectedId, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {routes.map((r) => {
        const active = r.routeId === selectedId;
        return (
          <button
            key={r.routeId}
            onClick={() => onSelect(r.routeId)}
            style={{
              textAlign: 'left',
              padding: 12,
              borderRadius: 10,
              border: `1px solid ${active ? '#2563EB' : '#E2E8F0'}`,
              background: active ? '#EFF6FF' : '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{r.routeDesignator}</div>
              <span style={statusBadge(r.status)}>{r.status}</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{r.routeName}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
              {r.totalDistanceNm ?? '—'} NM · v{r.currentVersion ?? 1}
            </div>
          </button>
        );
      })}
      {routes.length === 0 && (
        <div style={{ padding: 16, color: '#94A3B8', fontSize: 13 }}>No routes available.</div>
      )}
    </div>
  );
}
