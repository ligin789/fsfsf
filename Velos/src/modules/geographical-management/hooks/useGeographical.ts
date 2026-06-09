/**
 * useGeographical
 *
 * Single hook that exposes the Geographical Management slice state and
 * dispatcher handlers. Consumed by Cluster, Region, and Zone pages.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store/store';
import {
  fetchClusters,
  createCluster,
  updateCluster,
  deleteCluster,
  fetchRegions,
  createRegion,
  updateRegion,
  deleteRegion,
  fetchZones,
  fetchZonesByRegion,
  fetchZonesByCluster,
  createZone,
  updateZone,
  deleteZone,
} from '../store/geographicalActions';
import {
  clearClusterFeedback,
  clearRegionFeedback,
  clearZoneFeedback,
  clearAllFeedback,
} from '../store/geographicalReducer';
import type {
  CreateOperatingClusterDTO,
  UpdateOperatingClusterDTO,
  ListClusterParams,
  CreateRegionDTO,
  UpdateRegionDTO,
  CreateOperatingZoneDTO,
  UpdateOperatingZoneDTO,
  PageQuery,
} from '../store/geographicalTypes';

export const useGeographical = () => {
  const dispatch = useDispatch<AppDispatch>();
  const clusters = useSelector((s: RootState) => s.geographical.clusters);
  const regions = useSelector((s: RootState) => s.geographical.regions);
  const zones = useSelector((s: RootState) => s.geographical.zones);

  // ---------- Cluster handlers ----------
  const loadClusters = useCallback(
    (params?: ListClusterParams) => dispatch(fetchClusters(params)),
    [dispatch],
  );
  const addCluster = useCallback(
    (payload: CreateOperatingClusterDTO) => dispatch(createCluster(payload)),
    [dispatch],
  );
  const editCluster = useCallback(
    (payload: UpdateOperatingClusterDTO) => dispatch(updateCluster(payload)),
    [dispatch],
  );
  const removeCluster = useCallback(
    (clusterId: string) => dispatch(deleteCluster(clusterId)),
    [dispatch],
  );

  // ---------- Region handlers ----------
  const loadRegions = useCallback(() => dispatch(fetchRegions()), [dispatch]);
  const addRegion = useCallback(
    (payload: CreateRegionDTO) => dispatch(createRegion(payload)),
    [dispatch],
  );
  const editRegion = useCallback(
    (payload: UpdateRegionDTO) => dispatch(updateRegion(payload)),
    [dispatch],
  );
  const removeRegion = useCallback(
    (regionId: string) => dispatch(deleteRegion(regionId)),
    [dispatch],
  );

  // ---------- Zone handlers ----------
  const loadZones = useCallback(() => dispatch(fetchZones()), [dispatch]);
  const loadZonesByRegion = useCallback(
    (regionId: string, params?: PageQuery) =>
      dispatch(fetchZonesByRegion({ regionId, params })),
    [dispatch],
  );
  const loadZonesByCluster = useCallback(
    (clusterId: string, params?: PageQuery) =>
      dispatch(fetchZonesByCluster({ clusterId, params })),
    [dispatch],
  );
  const addZone = useCallback(
    (payload: CreateOperatingZoneDTO) => dispatch(createZone(payload)),
    [dispatch],
  );
  const editZone = useCallback(
    (payload: UpdateOperatingZoneDTO) => dispatch(updateZone(payload)),
    [dispatch],
  );
  const removeZone = useCallback(
    (zoneId: string) => dispatch(deleteZone(zoneId)),
    [dispatch],
  );

  // ---------- Feedback ----------
  const resetClusterFeedback = useCallback(() => dispatch(clearClusterFeedback()), [dispatch]);
  const resetRegionFeedback = useCallback(() => dispatch(clearRegionFeedback()), [dispatch]);
  const resetZoneFeedback = useCallback(() => dispatch(clearZoneFeedback()), [dispatch]);
  const resetAllFeedback = useCallback(() => dispatch(clearAllFeedback()), [dispatch]);

  return {
    // state
    clusters,
    regions,
    zones,
    // cluster
    loadClusters,
    addCluster,
    editCluster,
    removeCluster,
    // region
    loadRegions,
    addRegion,
    editRegion,
    removeRegion,
    // zone
    loadZones,
    loadZonesByRegion,
    loadZonesByCluster,
    addZone,
    editZone,
    removeZone,
    // feedback
    resetClusterFeedback,
    resetRegionFeedback,
    resetZoneFeedback,
    resetAllFeedback,
  };
};

export default useGeographical;
