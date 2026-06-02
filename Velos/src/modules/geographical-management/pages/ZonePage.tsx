import { useEffect, useMemo, useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import useGeographical from '../hooks/useGeographical';
import ZoneTable from '../components/Zone/ZoneTable';
import ZoneFormModal from '../components/Zone/ZoneFormModal';
import GeoOverviewMap from '../components/Map/GeoOverviewMap';
import {
  banner,
  btnPrimary,
  card,
  label,
  pageHeader,
  pageSubtitle,
  pageTitle,
  sectionTitle,
  select as selectStyle,
  spinnerWrap,
} from '../components/uiStyles';
import type { OperatingZoneDTO } from '../store/geographicalTypes';

export default function ZonePage() {
  const {
    clusters,
    regions,
    zones,
    loadClusters,
    loadRegions,
    loadZones,
    addZone,
    editZone,
    removeZone,
    resetZoneFeedback,
  } = useGeographical();

  const [filterClusterId, setFilterClusterId] = useState<string>('');
  const [filterRegionId, setFilterRegionId] = useState<string>('');
  const [modalShow, setModalShow] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget] = useState<OperatingZoneDTO | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadClusters();
    loadRegions();
    loadZones();
  }, [loadClusters, loadRegions, loadZones]);

  // When a different cluster is picked, reset the region filter if it doesn't belong.
  useEffect(() => {
    if (!filterRegionId) return;
    const r = regions.items.find((x) => x.regionId === filterRegionId);
    if (!r) return;
    if (filterClusterId && r.clusterId !== filterClusterId) setFilterRegionId('');
  }, [filterClusterId, filterRegionId, regions.items]);

  const filteredRegions = useMemo(
    () =>
      filterClusterId
        ? regions.items.filter((r) => r.clusterId === filterClusterId)
        : regions.items,
    [regions.items, filterClusterId],
  );

  const filteredZones = useMemo(() => {
    let list = zones.items;
    if (filterClusterId) list = list.filter((z) => z.clusterId === filterClusterId);
    if (filterRegionId) list = list.filter((z) => z.regionId === filterRegionId);
    return list;
  }, [zones.items, filterClusterId, filterRegionId]);

  const selected = useMemo(
    () => zones.items.find((z) => z.zoneId === selectedId) || null,
    [zones.items, selectedId],
  );
  const mapItems = useMemo(
    () =>
      filteredZones.map((z) => ({
        id: z.zoneId,
        label: z.zoneCode,
        wkt: z.boundaryGeometry,
      })),
    [filteredZones],
  );

  const openCreate = () => {
    resetZoneFeedback();
    setEditTarget(null);
    setModalMode('create');
    setModalShow(true);
  };

  const openEdit = (zone: OperatingZoneDTO) => {
    resetZoneFeedback();
    setEditTarget(zone);
    setModalMode('edit');
    setModalShow(true);
  };

  const handleDelete = async (zone: OperatingZoneDTO) => {
    if (!window.confirm(`Delete zone "${zone.zoneCode}"?`)) return;
    await removeZone(zone.zoneId);
    if (selectedId === zone.zoneId) setSelectedId(null);
  };

  const handleCreate = async (payload: Parameters<typeof addZone>[0]) => {
    const result = await addZone(payload);
    if ((result as { type: string }).type.endsWith('/fulfilled')) setModalShow(false);
  };

  const handleUpdate = async (payload: Parameters<typeof editZone>[0]) => {
    const result = await editZone(payload);
    if ((result as { type: string }).type.endsWith('/fulfilled')) setModalShow(false);
  };

  const canCreate = clusters.items.length > 0 && regions.items.length > 0;

  return (
    <div>
      <div style={pageHeader}>
        <div>
          <h1 style={pageTitle}>Operating Zones</h1>
          <p style={pageSubtitle}>
            Zones are the smallest geographical unit and belong to a region and a cluster.
          </p>
        </div>
        <button
          type="button"
          style={btnPrimary}
          onClick={openCreate}
          disabled={!canCreate}
          title={canCreate ? '' : 'Create a cluster and region first'}
        >
          <HiOutlinePlus size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          New Zone
        </button>
      </div>

      {zones.success && <div style={banner('success')}>{zones.success}</div>}
      {zones.error && <div style={banner('error')}>{zones.error}</div>}

      <div className="row g-3">
        <div className="col-12 col-xl-7">
          <div style={card}>
            <h3 style={sectionTitle}>Zones</h3>
            <div className="row g-3" style={{ marginBottom: 14 }}>
              <div className="col-sm-6">
                <label style={label}>Cluster</label>
                <select
                  style={selectStyle}
                  value={filterClusterId}
                  onChange={(e) => setFilterClusterId(e.target.value)}
                >
                  <option value="">All clusters</option>
                  {clusters.items.map((c) => (
                    <option key={c.clusterId} value={c.clusterId}>
                      {c.clusterCode} — {c.clusterName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-6">
                <label style={label}>Region</label>
                <select
                  style={selectStyle}
                  value={filterRegionId}
                  onChange={(e) => setFilterRegionId(e.target.value)}
                  disabled={!filterClusterId && !regions.items.length}
                >
                  <option value="">All regions</option>
                  {filteredRegions.map((r) => (
                    <option key={r.regionId} value={r.regionId}>
                      {r.regionCode} — {r.regionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {zones.loading && !zones.items.length ? (
              <div style={spinnerWrap}>Loading zones…</div>
            ) : (
              <ZoneTable
                zones={filteredZones}
                clusters={clusters.items}
                regions={regions.items}
                selectedId={selectedId}
                onSelect={(z) => setSelectedId(z.zoneId)}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <div style={card}>
            <h3 style={sectionTitle}>Map</h3>
            <div style={{ marginBottom: 10, fontSize: 13, color: '#475569', minHeight: 20 }}>
              {selected ? (
                <>
                  <strong style={{ color: '#0F172A' }}>{selected.zoneCode}</strong> —{' '}
                  {selected.zoneName}
                </>
              ) : (
                'Click a zone row (or a polygon) to highlight it.'
              )}
            </div>
            {mapItems.length ? (
              <GeoOverviewMap
                items={mapItems}
                selectedId={selectedId}
                onSelect={setSelectedId}
                height={420}
              />
            ) : (
              <div style={spinnerWrap}>No zones to display yet.</div>
            )}
          </div>
        </div>
      </div>

      <ZoneFormModal
        show={modalShow}
        mode={modalMode}
        initial={editTarget}
        clusters={clusters.items}
        regions={regions.items}
        defaultClusterId={filterClusterId || undefined}
        defaultRegionId={filterRegionId || undefined}
        loading={zones.loading}
        onClose={() => setModalShow(false)}
        onSubmitCreate={handleCreate}
        onSubmitUpdate={handleUpdate}
      />
    </div>
  );
}
