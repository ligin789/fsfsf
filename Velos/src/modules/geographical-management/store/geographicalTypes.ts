/**
 * TypeScript types derived strictly from cluster.yaml (Geographical Management Service API).
 * Do not add fields that are not in the swagger.
 */

// ---------- Enums ----------
export type ClusterStatus = 'ACTIVE' | 'SUSPENDED' | 'PLANNED' | 'DECOMMISSIONED';
export type RegionStatus = 'ACTIVE' | 'SUSPENDED' | 'PLANNED' | 'DECOMMISSIONED';
export type ZoneStatus = 'ACTIVE' | 'SUSPENDED' | 'PLANNED' | 'DECOMMISSIONED' | 'RESTRICTED';
export type ZoneType = 'OPERATION' | 'TRANSIT' | 'EXCLUSION' | 'RESTRICTED';
export type ZoneSubtype = 'URBAN_CORE' | 'SUBURBAN' | 'PERIURBAN' | 'WATER' | 'AIRPORT_VICINITY';

export const CLUSTER_STATUS_OPTIONS: ClusterStatus[] = ['ACTIVE', 'SUSPENDED', 'PLANNED', 'DECOMMISSIONED'];
export const REGION_STATUS_OPTIONS: RegionStatus[] = ['ACTIVE', 'SUSPENDED', 'PLANNED', 'DECOMMISSIONED'];
export const ZONE_STATUS_OPTIONS: ZoneStatus[] = ['ACTIVE', 'SUSPENDED', 'PLANNED', 'DECOMMISSIONED', 'RESTRICTED'];
export const ZONE_TYPE_OPTIONS: ZoneType[] = ['OPERATION', 'TRANSIT', 'EXCLUSION', 'RESTRICTED'];
export const ZONE_SUBTYPE_OPTIONS: ZoneSubtype[] = ['URBAN_CORE', 'SUBURBAN', 'PERIURBAN', 'WATER', 'AIRPORT_VICINITY'];

// ---------- API Error ----------
export interface ApiError {
  status?: number;
  error?: string;
  timestamp?: number;
  fieldErrors?: Record<string, string>;
}

// ---------- Cluster DTOs ----------
export interface CreateOperatingClusterDTO {
  clusterCode: string;
  clusterName: string;
  countryCode: string;
  countryName: string;
  stateProvince?: string;
  clusterGeometry: string;
  timezoneCode: string;
  utcOffsetHours: number;
  caaAuthorityCode: string;
  caaAuthorityName: string;
  uspaceProvider?: string;
  utmSystem?: string;
  airspaceClass: string;
  altitudeLimitFtAgl?: number;
  clusterStatus: ClusterStatus;
  operationalSince?: string;
  maxConcurrentFlights: number;
  allowOperatorZoneOverride?: boolean;
  allowOperatorRegionOverride?: boolean;
  requireClusterApprovalForOverride?: boolean;
  notes?: string;
  createdBy: string;
}

export interface UpdateOperatingClusterDTO {
  clusterId: string;
  clusterCode?: string;
  clusterName?: string;
  countryCode?: string;
  countryName?: string;
  stateProvince?: string;
  clusterGeometry?: string;
  timezoneCode?: string;
  utcOffsetHours?: number;
  caaAuthorityCode?: string;
  caaAuthorityName?: string;
  uspaceProvider?: string;
  utmSystem?: string;
  airspaceClass?: string;
  altitudeLimitFtAgl?: number;
  clusterStatus?: ClusterStatus;
  operationalSince?: string;
  maxConcurrentFlights?: number;
  allowOperatorZoneOverride?: boolean;
  allowOperatorRegionOverride?: boolean;
  requireClusterApprovalForOverride?: boolean;
  notes?: string;
  updatedBy: string;
}

export interface OperatingClusterDTO {
  clusterId: string;
  clusterCode: string;
  clusterName: string;
  countryCode: string;
  countryName: string;
  stateProvince?: string;
  clusterGeometry?: string;
  centroid?: string;
  timezoneCode?: string;
  utcOffsetHours?: number;
  caaAuthorityCode?: string;
  caaAuthorityName?: string;
  uspaceProvider?: string;
  utmSystem?: string;
  airspaceClass?: string;
  altitudeLimitFtAgl?: number;
  clusterStatus?: ClusterStatus;
  operationalSince?: string;
  maxConcurrentFlights?: number;
  allowOperatorZoneOverride?: boolean;
  allowOperatorRegionOverride?: boolean;
  requireClusterApprovalForOverride?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// ---------- Region DTOs ----------
export interface CreateRegionDTO {
  regionCode: string;
  regionName: string;
  clusterId: string;
  regionGeometry: string;
  altitudeFloorFtAmsl?: number;
  altitudeCeilingFtAmsl?: number;
  responsibleAtcUnit?: string;
  airspaceClass: string;
  uspaceZoneId?: string;
  maxFleetSize?: number;
  primaryVertihubId?: string;
  wxOverrideEnabled?: boolean;
  perfOverrideEnabled?: boolean;
  regionStatus: RegionStatus;
  operationalSince?: string;
  notes?: string;
  createdBy: string;
}

export interface UpdateRegionDTO {
  regionId: string;
  regionCode?: string;
  regionName?: string;
  clusterId?: string;
  regionGeometry?: string;
  altitudeFloorFtAmsl?: number;
  altitudeCeilingFtAmsl?: number;
  responsibleAtcUnit?: string;
  airspaceClass?: string;
  uspaceZoneId?: string;
  maxFleetSize?: number;
  primaryVertihubId?: string;
  wxOverrideEnabled?: boolean;
  perfOverrideEnabled?: boolean;
  regionStatus?: RegionStatus;
  operationalSince?: string;
  notes?: string;
  updatedBy: string;
}

export interface RegionDTO {
  regionId: string;
  regionCode: string;
  regionName: string;
  clusterId: string;
  regionGeometry?: string;
  centroid?: string;
  areaSqKm?: number;
  altitudeFloorFtAmsl?: number;
  altitudeCeilingFtAmsl?: number;
  responsibleAtcUnit?: string;
  airspaceClass?: string;
  uspaceZoneId?: string;
  maxFleetSize?: number;
  primaryVertihubId?: string;
  wxOverrideEnabled?: boolean;
  perfOverrideEnabled?: boolean;
  regionStatus?: RegionStatus;
  operationalSince?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// ---------- Zone DTOs ----------
export interface CreateOperatingZoneDTO {
  zoneCode: string;
  zoneName: string;
  zoneDescription?: string;
  regionId: string;
  clusterId: string;
  zoneType: ZoneType;
  zoneSubtype?: ZoneSubtype;
  zoneStatus: ZoneStatus;
  areaSqKm?: number;
  altitudeFloorFtAmsl?: number;
  altitudeCeilingFtAmsl?: number;
  populationDensity?: number;
  baselineDemandPaxHr?: number;
  wxOverrideEnabled?: boolean;
  perfOverrideEnabled?: boolean;
  operatorAccessRestricted?: boolean;
  primaryVertiportId?: string;
  servingVertiportIds?: string;
  activationDate?: string;
  deactivationDate?: string;
  timezoneName?: string;
  responsibleAtcUnit?: string;
  airspaceClass?: string;
  maxFleetSize?: number;
  caaAuthorityCode?: string;
  centerLatitude?: number;
  centerLongitude?: number;
  boundaryGeometry?: string;
  createdBy: string;
}

export interface UpdateOperatingZoneDTO {
  zoneId: string;
  zoneCode: string;
  zoneName: string;
  zoneDescription?: string;
  regionId: string;
  clusterId: string;
  zoneType: ZoneType;
  zoneSubtype?: ZoneSubtype;
  zoneStatus: ZoneStatus;
  areaSqKm?: number;
  altitudeFloorFtAmsl?: number;
  altitudeCeilingFtAmsl?: number;
  populationDensity?: number;
  baselineDemandPaxHr?: number;
  wxOverrideEnabled?: boolean;
  perfOverrideEnabled?: boolean;
  operatorAccessRestricted?: boolean;
  primaryVertiportId?: string;
  servingVertiportIds?: string;
  activationDate?: string;
  deactivationDate?: string;
  timezoneName?: string;
  responsibleAtcUnit?: string;
  airspaceClass?: string;
  maxFleetSize?: number;
  caaAuthorityCode?: string;
  centerLatitude?: number;
  centerLongitude?: number;
  boundaryGeometry?: string;
  createdBy?: string;
  updatedBy: string;
}

export interface OperatingZoneDTO {
  zoneId: string;
  zoneCode: string;
  zoneName: string;
  zoneDescription?: string;
  regionId: string;
  clusterId: string;
  zoneType?: ZoneType;
  zoneSubtype?: ZoneSubtype;
  zoneStatus?: ZoneStatus;
  areaSqKm?: number;
  altitudeFloorFtAmsl?: number;
  altitudeCeilingFtAmsl?: number;
  populationDensity?: number;
  baselineDemandPaxHr?: number;
  wxOverrideEnabled?: boolean;
  perfOverrideEnabled?: boolean;
  operatorAccessRestricted?: boolean;
  primaryVertiportId?: string;
  servingVertiportIds?: string;
  activationDate?: string;
  deactivationDate?: string;
  timezoneName?: string;
  responsibleAtcUnit?: string;
  airspaceClass?: string;
  maxFleetSize?: number;
  caaAuthorityCode?: string;
  centerLatitude?: number;
  centerLongitude?: number;
  boundaryGeometry?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// ---------- Hierarchy ----------
export interface ZoneHierarchyResponse {
  zoneId: string;
  zoneCode: string;
  zoneName: string;
  zoneType?: string;
  zoneSubtype?: string;
  areaSqKm?: number;
  altitudeFloorFtAmsl?: number;
  altitudeCeilingFtAmsl?: number;
  populationDensity?: number;
  baselineDemandPaxHr?: number;
  zoneStatus?: string;
  wxOverrideEnabled?: boolean;
  perfOverrideEnabled?: boolean;
  operatorAccessRestricted?: boolean;
  activationDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegionHierarchyResponse {
  regionId: string;
  regionCode: string;
  regionName: string;
  areaSqKm?: number;
  altitudeFloorFtAmsl?: number;
  altitudeCeilingFtAmsl?: number;
  responsibleAtcUnit?: string;
  airspaceClass?: string;
  maxFleetSize?: number;
  regionStatus?: string;
  wxOverrideEnabled?: boolean;
  perfOverrideEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  zones?: ZoneHierarchyResponse[];
}

export interface ClusterHierarchyResponse {
  clusterId: string;
  clusterCode: string;
  clusterName: string;
  countryCode?: string;
  countryName?: string;
  stateProvince?: string;
  latitude?: number;
  longitude?: number;
  clusterGeometry?: string;
  centroid?: string;
  timezoneCode?: string;
  utcOffsetHours?: number;
  caaAuthorityCode?: string;
  caaAuthorityName?: string;
  clusterStatus?: string;
  operationalSince?: string;
  maxConcurrentFlights?: number;
  createdAt?: string;
  updatedAt?: string;
  regions?: RegionHierarchyResponse[];
}

// ---------- Pagination ----------
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type PageOperatingClusterDTO = Page<OperatingClusterDTO>;
export type PageOperatingZoneDTO = Page<OperatingZoneDTO>;

// ---------- Query params ----------
export interface ListClusterParams {
  countryCode?: string;
  timezoneCode?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageQuery {
  page?: number;
  size?: number;
  sort?: string;
}

// ---------- Redux state shape ----------
export interface GeographicalState {
  clusters: {
    items: OperatingClusterDTO[];
    page: PageOperatingClusterDTO | null;
    loading: boolean;
    error: string | null;
    success: string | null;
  };
  regions: {
    items: RegionDTO[];
    loading: boolean;
    error: string | null;
    success: string | null;
  };
  zones: {
    items: OperatingZoneDTO[];
    page: PageOperatingZoneDTO | null;
    loading: boolean;
    error: string | null;
    success: string | null;
  };
}
