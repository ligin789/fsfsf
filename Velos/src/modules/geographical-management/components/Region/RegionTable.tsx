import type { OperatingClusterDTO, RegionDTO } from '../../store/geographicalTypes';
import { btn, btnDanger, statusBadge, table, tableWrap, td, th } from '../uiStyles';

interface Props {
  regions: RegionDTO[];
  clusters: OperatingClusterDTO[];
  selectedId?: string | null;
  onSelect?: (region: RegionDTO) => void;
  onEdit: (region: RegionDTO) => void;
  onDelete: (region: RegionDTO) => void;
}

export default function RegionTable({
  regions,
  clusters,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  if (!regions.length) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--app-text-subtle)', fontSize: 13 }}>
        No regions found.
      </div>
    );
  }

  const clusterCode = (id: string) =>
    clusters.find((c) => c.clusterId === id)?.clusterCode || id.slice(0, 8);

  return (
    <div style={tableWrap}>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Code</th>
            <th style={th}>Name</th>
            <th style={th}>Cluster</th>
            <th style={th}>Airspace</th>
            <th style={th}>Floor / Ceiling (ft)</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((r) => {
            const isSelected = selectedId === r.regionId;
            return (
              <tr
                key={r.regionId}
                onClick={() => onSelect?.(r)}
                style={{
                  cursor: onSelect ? 'pointer' : 'default',
                  background: isSelected ? 'var(--app-primary-subtle)' : 'transparent',
                }}
              >
                <td style={td}>
                  <strong style={{ color: 'var(--app-text)' }}>{r.regionCode}</strong>
                </td>
                <td style={td}>{r.regionName}</td>
                <td style={td}>{clusterCode(r.clusterId)}</td>
                <td style={td}>{r.airspaceClass || '—'}</td>
                <td style={td}>
                  {(r.altitudeFloorFtAmsl ?? '—') + ' / ' + (r.altitudeCeilingFtAmsl ?? '—')}
                </td>
                <td style={td}>
                  <span style={statusBadge(r.regionStatus)}>{r.regionStatus || '—'}</span>
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      style={btn}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(r);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={btnDanger}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(r);
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
