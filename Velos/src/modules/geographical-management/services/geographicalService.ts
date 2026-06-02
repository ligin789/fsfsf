/**
 * Geographical Management Service
 *
 * REST calls strictly mapped to cluster.yaml (Geographical Management Service API).
 * Uses the project-wide axios instance.
 */
import axiosInstance from '../../../utils/axios';
import type {
  CreateOperatingClusterDTO,
  UpdateOperatingClusterDTO,
  OperatingClusterDTO,
  PageOperatingClusterDTO,
  ListClusterParams,
  CreateRegionDTO,
  UpdateRegionDTO,
  RegionDTO,
  CreateOperatingZoneDTO,
  UpdateOperatingZoneDTO,
  OperatingZoneDTO,
  PageOperatingZoneDTO,
  PageQuery,
  ClusterHierarchyResponse,
} from '../store/geographicalTypes';

// ---------- Cluster endpoints ----------
const CLUSTER_BASE = '/api/v1/operatingcluster';

export const clusterService = {
  list(params: ListClusterParams = {}): Promise<PageOperatingClusterDTO> {
    return axiosInstance
      .get<PageOperatingClusterDTO>(CLUSTER_BASE, { params })
      .then((r) => r.data);
  },

  getById(id: string): Promise<OperatingClusterDTO> {
    return axiosInstance
      .get<OperatingClusterDTO>(`${CLUSTER_BASE}/${id}`)
      .then((r) => r.data);
  },

  getByCode(cityCode: string): Promise<OperatingClusterDTO> {
    return axiosInstance
      .get<OperatingClusterDTO>(`${CLUSTER_BASE}/code/${cityCode}`)
      .then((r) => r.data);
  },

  create(payload: CreateOperatingClusterDTO): Promise<OperatingClusterDTO> {
    return axiosInstance
      .post<OperatingClusterDTO>(CLUSTER_BASE, payload)
      .then((r) => r.data);
  },

  update(payload: UpdateOperatingClusterDTO): Promise<OperatingClusterDTO> {
    return axiosInstance
      .put<OperatingClusterDTO>(CLUSTER_BASE, payload)
      .then((r) => r.data);
  },

  remove(id: string): Promise<void> {
    return axiosInstance.delete<void>(`${CLUSTER_BASE}/${id}`).then(() => undefined);
  },

  hierarchyAll(): Promise<ClusterHierarchyResponse[]> {
    return axiosInstance
      .get<ClusterHierarchyResponse[]>(`${CLUSTER_BASE}/hierarchy`)
      .then((r) => r.data);
  },

  hierarchyOne(id: number | string): Promise<ClusterHierarchyResponse> {
    return axiosInstance
      .get<ClusterHierarchyResponse>(`${CLUSTER_BASE}/${id}/hierarchy`)
      .then((r) => r.data);
  },
};

// ---------- Region endpoints ----------
const REGION_BASE = '/region';

export const regionService = {
  list(): Promise<RegionDTO[]> {
    return axiosInstance.get<RegionDTO[]>(REGION_BASE).then((r) => r.data);
  },

  getById(regionId: string): Promise<RegionDTO> {
    return axiosInstance
      .get<RegionDTO>(`${REGION_BASE}/${regionId}`)
      .then((r) => r.data);
  },

  create(payload: CreateRegionDTO): Promise<RegionDTO> {
    return axiosInstance.post<RegionDTO>(REGION_BASE, payload).then((r) => r.data);
  },

  update(payload: UpdateRegionDTO): Promise<RegionDTO> {
    return axiosInstance.put<RegionDTO>(REGION_BASE, payload).then((r) => r.data);
  },

  remove(regionId: string): Promise<void> {
    return axiosInstance.delete<void>(`${REGION_BASE}/${regionId}`).then(() => undefined);
  },
};

// ---------- Zone endpoints ----------
const ZONE_BASE = '/api/v1/operatingzone';

export const zoneService = {
  list(): Promise<OperatingZoneDTO[]> {
    return axiosInstance.get<OperatingZoneDTO[]>(ZONE_BASE).then((r) => r.data);
  },

  getById(zoneId: string): Promise<OperatingZoneDTO> {
    return axiosInstance
      .get<OperatingZoneDTO>(`${ZONE_BASE}/${zoneId}`)
      .then((r) => r.data);
  },

  getByCode(zoneCode: string): Promise<OperatingZoneDTO> {
    return axiosInstance
      .get<OperatingZoneDTO>(`${ZONE_BASE}/code/${zoneCode}`)
      .then((r) => r.data);
  },

  getByRegion(regionId: string, params: PageQuery = {}): Promise<PageOperatingZoneDTO> {
    return axiosInstance
      .get<PageOperatingZoneDTO>(`${ZONE_BASE}/region/${regionId}`, { params })
      .then((r) => r.data);
  },

  getActiveByRegion(regionId: string): Promise<OperatingZoneDTO[]> {
    return axiosInstance
      .get<OperatingZoneDTO[]>(`${ZONE_BASE}/region/${regionId}/active`)
      .then((r) => r.data);
  },

  getByCluster(clusterId: string, params: PageQuery = {}): Promise<PageOperatingZoneDTO> {
    return axiosInstance
      .get<PageOperatingZoneDTO>(`${ZONE_BASE}/cluster/${clusterId}`, { params })
      .then((r) => r.data);
  },

  getByStatus(status: string, params: PageQuery = {}): Promise<PageOperatingZoneDTO> {
    return axiosInstance
      .get<PageOperatingZoneDTO>(`${ZONE_BASE}/status/${status}`, { params })
      .then((r) => r.data);
  },

  countByStatus(status: string): Promise<number> {
    return axiosInstance
      .get<number>(`${ZONE_BASE}/status/${status}/count`)
      .then((r) => r.data);
  },

  getByType(zoneType: string, params: PageQuery = {}): Promise<PageOperatingZoneDTO> {
    return axiosInstance
      .get<PageOperatingZoneDTO>(`${ZONE_BASE}/type/${zoneType}`, { params })
      .then((r) => r.data);
  },

  searchByName(namePattern: string, params: PageQuery = {}): Promise<PageOperatingZoneDTO> {
    return axiosInstance
      .get<PageOperatingZoneDTO>(`${ZONE_BASE}/search`, {
        params: { namePattern, ...params },
      })
      .then((r) => r.data);
  },

  getByVertiport(vertiportId: string): Promise<OperatingZoneDTO[]> {
    return axiosInstance
      .get<OperatingZoneDTO[]>(`${ZONE_BASE}/vertiport/${vertiportId}`)
      .then((r) => r.data);
  },

  create(payload: CreateOperatingZoneDTO): Promise<OperatingZoneDTO> {
    return axiosInstance
      .post<OperatingZoneDTO>(ZONE_BASE, payload)
      .then((r) => r.data);
  },

  update(payload: UpdateOperatingZoneDTO): Promise<OperatingZoneDTO> {
    return axiosInstance
      .put<OperatingZoneDTO>(ZONE_BASE, payload)
      .then((r) => r.data);
  },

  remove(zoneId: string): Promise<void> {
    return axiosInstance.delete<void>(`${ZONE_BASE}/${zoneId}`).then(() => undefined);
  },
};

export default {
  clusterService,
  regionService,
  zoneService,
};
