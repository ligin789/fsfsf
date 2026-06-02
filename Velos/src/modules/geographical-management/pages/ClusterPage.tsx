import { useEffect, useMemo, useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import useGeographical from '../hooks/useGeographical';
import ClusterTable from '../components/Cluster/ClusterTable';
import ClusterFormModal from '../components/Cluster/ClusterFormModal';
import GeoOverviewMap from '../components/Map/GeoOverviewMap';
import {
  banner,
  btnPrimary,
  card,
  pageHeader,
  pageSubtitle,
  pageTitle,
  sectionTitle,
  spinnerWrap,
} from '../components/uiStyles';
import type { OperatingClusterDTO } from '../store/geographicalTypes';

export default function ClusterPage() {
  const {
    clusters,
    loadClusters,
    addCluster,
    editCluster,
    removeCluster,
    resetClusterFeedback,
  } = useGeographical();

  const [modalShow, setModalShow] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget] = useState<OperatingClusterDTO | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadClusters();
  }, [loadClusters]);

  const selected = useMemo(
    () => clusters.items.find((c) => c.clusterId === selectedId) || null,
    [clusters.items, selectedId],
  );

  const mapItems = useMemo(
    () =>
      clusters.items.map((c) => ({
        id: c.clusterId,
        label: c.clusterCode,
        wkt: c.clusterGeometry,
      })),
    [clusters.items],
  );

  const openCreate = () => {
    resetClusterFeedback();
    setEditTarget(null);
    setModalMode('create');
    setModalShow(true);
  };

  const openEdit = (cluster: OperatingClusterDTO) => {
    resetClusterFeedback();
    setEditTarget(cluster);
    setModalMode('edit');
    setModalShow(true);
  };

  const handleDelete = async (cluster: OperatingClusterDTO) => {
    if (!window.confirm(`Delete cluster "${cluster.clusterCode}"? This cannot be undone.`)) return;
    await removeCluster(cluster.clusterId);
    if (selectedId === cluster.clusterId) setSelectedId(null);
  };

  const handleCreate = async (payload: Parameters<typeof addCluster>[0]) => {
    const result = await addCluster(payload);
    if ((result as { type: string }).type.endsWith('/fulfilled')) {
      setModalShow(false);
    }
  };

  const handleUpdate = async (payload: Parameters<typeof editCluster>[0]) => {
    const result = await editCluster(payload);
    if ((result as { type: string }).type.endsWith('/fulfilled')) {
      setModalShow(false);
    }
  };

  return (
    <div>
      <div style={pageHeader}>
        <div>
          <h1 style={pageTitle}>Operating Clusters</h1>
          <p style={pageSubtitle}>
            Manage top-level geographical units. Clusters group regions and zones.
          </p>
        </div>
        <button type="button" style={btnPrimary} onClick={openCreate}>
          <HiOutlinePlus size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          New Cluster
        </button>
      </div>

      {clusters.success && <div style={banner('success')}>{clusters.success}</div>}
      {clusters.error && <div style={banner('error')}>{clusters.error}</div>}

      <div className="row g-3">
        <div className="col-12 col-xl-7">
          <div style={card}>
            <h3 style={sectionTitle}>Clusters</h3>
            {clusters.loading && !clusters.items.length ? (
              <div style={spinnerWrap}>Loading clusters…</div>
            ) : (
              <ClusterTable
                clusters={clusters.items}
                selectedId={selectedId}
                onSelect={(c) => setSelectedId(c.clusterId)}
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
                  <strong style={{ color: '#0F172A' }}>{selected.clusterCode}</strong> —{' '}
                  {selected.clusterName}
                </>
              ) : (
                'Click a cluster row (or a polygon) to highlight it.'
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
              <div style={spinnerWrap}>No clusters to display yet.</div>
            )}
          </div>
        </div>
      </div>

      <ClusterFormModal
        show={modalShow}
        mode={modalMode}
        initial={editTarget}
        loading={clusters.loading}
        onClose={() => setModalShow(false)}
        onSubmitCreate={handleCreate}
        onSubmitUpdate={handleUpdate}
      />
    </div>
  );
}
