import { useEffect, useMemo, useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import useGeographical from '../hooks/useGeographical';
import RegionTable from '../components/Region/RegionTable';
import RegionFormModal from '../components/Region/RegionFormModal';
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
import type { RegionDTO } from '../store/geographicalTypes';

export default function RegionPage() {
  const {
    clusters,
    regions,
    loadClusters,
    loadRegions,
    addRegion,
    editRegion,
    removeRegion,
    resetRegionFeedback,
  } = useGeographical();

  const [filterClusterId, setFilterClusterId] = useState<string>('');
  const [modalShow, setModalShow] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget] = useState<RegionDTO | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadClusters();
    loadRegions();
  }, [loadClusters, loadRegions]);

  const filteredRegions = useMemo(
    () =>
      filterClusterId
        ? regions.items.filter((r) => r.clusterId === filterClusterId)
        : regions.items,
    [regions.items, filterClusterId],
  );

  const selected = useMemo(
    () => regions.items.find((r) => r.regionId === selectedId) || null,
    [regions.items, selectedId],
  );
  const mapItems = useMemo(
    () =>
      filteredRegions.map((r) => ({
        id: r.regionId,
        label: r.regionCode,
        wkt: r.regionGeometry,
      })),
    [filteredRegions],
  );

  const openCreate = () => {
    resetRegionFeedback();
    setEditTarget(null);
    setModalMode('create');
    setModalShow(true);
  };

  const openEdit = (region: RegionDTO) => {
    resetRegionFeedback();
    setEditTarget(region);
    setModalMode('edit');
    setModalShow(true);
  };

  const handleDelete = async (region: RegionDTO) => {
    if (!window.confirm(`Delete region "${region.regionCode}"?`)) return;
    await removeRegion(region.regionId);
    if (selectedId === region.regionId) setSelectedId(null);
  };

  const handleCreate = async (payload: Parameters<typeof addRegion>[0]) => {
    const result = await addRegion(payload);
    if ((result as { type: string }).type.endsWith('/fulfilled')) setModalShow(false);
  };

  const handleUpdate = async (payload: Parameters<typeof editRegion>[0]) => {
    const result = await editRegion(payload);
    if ((result as { type: string }).type.endsWith('/fulfilled')) setModalShow(false);
  };

  const canCreate = clusters.items.length > 0;

  return (
    <div>
      <div style={pageHeader}>
        <div>
          <h1 style={pageTitle}>Operating Regions</h1>
          <p style={pageSubtitle}>
            Regions belong to a parent cluster and group operating zones.
          </p>
        </div>
        <button
          type="button"
          style={btnPrimary}
          onClick={openCreate}
          disabled={!canCreate}
          title={canCreate ? '' : 'Create a cluster first'}
        >
          <HiOutlinePlus size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          New Region
        </button>
      </div>

      {regions.success && <div style={banner('success')}>{regions.success}</div>}
      {regions.error && <div style={banner('error')}>{regions.error}</div>}

      <div className="row g-3">
        <div className="col-12 col-xl-7">
          <div style={card}>
            <h3 style={sectionTitle}>Regions</h3>
            <div style={{ marginBottom: 14, maxWidth: 360 }}>
              <label style={label}>Filter by parent Cluster</label>
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
            {regions.loading && !regions.items.length ? (
              <div style={spinnerWrap}>Loading regions…</div>
            ) : (
              <RegionTable
                regions={filteredRegions}
                clusters={clusters.items}
                selectedId={selectedId}
                onSelect={(r) => setSelectedId(r.regionId)}
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
                  <strong style={{ color: '#0F172A' }}>{selected.regionCode}</strong> —{' '}
                  {selected.regionName}
                </>
              ) : (
                'Click a region row (or a polygon) to highlight it.'
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
              <div style={spinnerWrap}>No regions to display yet.</div>
            )}
          </div>
        </div>
      </div>

      <RegionFormModal
        show={modalShow}
        mode={modalMode}
        initial={editTarget}
        clusters={clusters.items}
        defaultClusterId={filterClusterId || undefined}
        loading={regions.loading}
        onClose={() => setModalShow(false)}
        onSubmitCreate={handleCreate}
        onSubmitUpdate={handleUpdate}
      />
    </div>
  );
}
