import type {
  OperatingClusterDTO,
  OperatingZoneDTO,
  RegionDTO,
} from '../../store/geographicalTypes';
import { btn, btnDanger, statusBadge, table, tableWrap, td, th } from '../uiStyles';

interface Props {
  zones: OperatingZoneDTO[];
  clusters: OperatingClusterDTO[];
  regions: RegionDTO[];
  selectedId?: string | null;
  onSelect?: (zone: OperatingZoneDTO) => void;
  onEdit: (zone: OperatingZoneDTO) => void;
  onDelete: (zone: OperatingZoneDTO) => void;
}

export default function ZoneTable({
  zones,
  clusters,
  regions,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  if (!zones.length) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
        No zones found.
      </div>
    );
  }

  const clusterCode = (id?: string) =>
    !id ? '—' : clusters.find((c) => c.clusterId === id)?.clusterCode || id.slice(0, 8);
  const regionCode = (id?: string) =>
    !id ? '—' : regions.find((r) => r.regionId === id)?.regionCode || id.slice(0, 8);

  return (
    <div style={tableWrap}>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Code</th>
            <th style={th}>Name</th>
            <th style={th}>Cluster</th>
            <th style={th}>Region</th>
            <th style={th}>Type</th>
            <th style={th}>Subtype</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((z) => {
            const isSelected = selectedId === z.zoneId;
            return (
              <tr
                key={z.zoneId}
                onClick={() => onSelect?.(z)}
                style={{
                  cursor: onSelect ? 'pointer' : 'default',
                  background: isSelected ? '#EFF6FF' : 'transparent',
                }}
              >
                <td style={td}>
                  <strong style={{ color: '#0F172A' }}>{z.zoneCode}</strong>
                </td>
                <td style={td}>{z.zoneName}</td>
                <td style={td}>{clusterCode(z.clusterId)}</td>
                <td style={td}>{regionCode(z.regionId)}</td>
                <td style={td}>{z.zoneType || '—'}</td>
                <td style={td}>{z.zoneSubtype || '—'}</td>
                <td style={td}>
                  <span style={statusBadge(z.zoneStatus)}>{z.zoneStatus || '—'}</span>
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      style={btn}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(z);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={btnDanger}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(z);
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
