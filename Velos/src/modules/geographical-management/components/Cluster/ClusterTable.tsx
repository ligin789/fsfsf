import type { OperatingClusterDTO } from '../../store/geographicalTypes';
import { btn, btnDanger, statusBadge, table, tableWrap, td, th } from '../uiStyles';

interface Props {
  clusters: OperatingClusterDTO[];
  selectedId?: string | null;
  onSelect?: (cluster: OperatingClusterDTO) => void;
  onEdit: (cluster: OperatingClusterDTO) => void;
  onDelete: (cluster: OperatingClusterDTO) => void;
}

export default function ClusterTable({
  clusters,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  if (!clusters.length) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
        No clusters found.
      </div>
    );
  }

  return (
    <div style={tableWrap}>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Code</th>
            <th style={th}>Name</th>
            <th style={th}>Country</th>
            <th style={th}>Timezone</th>
            <th style={th}>Status</th>
            <th style={th}>Max Flights</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clusters.map((c) => {
            const isSelected = selectedId === c.clusterId;
            return (
              <tr
                key={c.clusterId}
                onClick={() => onSelect?.(c)}
                style={{
                  cursor: onSelect ? 'pointer' : 'default',
                  background: isSelected ? '#EFF6FF' : 'transparent',
                }}
              >
                <td style={td}>
                  <strong style={{ color: '#0F172A' }}>{c.clusterCode}</strong>
                </td>
                <td style={td}>{c.clusterName}</td>
                <td style={td}>
                  {c.countryName} <span style={{ color: '#94A3B8' }}>({c.countryCode})</span>
                </td>
                <td style={td}>{c.timezoneCode || '—'}</td>
                <td style={td}>
                  <span style={statusBadge(c.clusterStatus)}>{c.clusterStatus || '—'}</span>
                </td>
                <td style={td}>{c.maxConcurrentFlights ?? '—'}</td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      style={btn}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(c);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={btnDanger}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(c);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
