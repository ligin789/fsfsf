/**
 * Offline seed data for the Geographical Management module — Bengaluru network.
 * Used as a fallback when the backend API is unreachable so the pages remain
 * usable (e.g. so "New Region" / "New Zone" become enabled).
 */
import type {
  OperatingClusterDTO,
  RegionDTO,
  OperatingZoneDTO,
} from '../store/geographicalTypes';

export const mockClusters: OperatingClusterDTO[] = [
  {
    clusterId: 'cl-blr-metro',
    clusterCode: 'BLR-METRO',
    clusterName: 'Bengaluru Metro Cluster',
    countryCode: 'IN',
    countryName: 'India',
    stateProvince: 'Karnataka',
    clusterGeometry:
      'POLYGON ((77.46 12.80, 77.78 12.80, 77.78 13.14, 77.46 13.14, 77.46 12.80))',
    centroid: 'POINT (77.62 12.97)',
    timezoneCode: 'Asia/Kolkata',
    utcOffsetHours: 5.5,
    caaAuthorityCode: 'DGCA',
    caaAuthorityName: 'Directorate General of Civil Aviation',
    airspaceClass: 'G',
    altitudeLimitFtAgl: 400,
    clusterStatus: 'ACTIVE',
    maxConcurrentFlights: 80,
    allowOperatorZoneOverride: true,
    allowOperatorRegionOverride: true,
    requireClusterApprovalForOverride: false,
    notes: 'Primary metropolitan AAM cluster covering Bengaluru.',
    createdAt: '2025-01-12T08:00:00Z',
  },
];

export const mockRegions: RegionDTO[] = [
  {
    regionId: 'rg-blr-north',
    regionCode: 'BLR-N',
    regionName: 'Bengaluru North (Hebbal / Yelahanka)',
    clusterId: 'cl-blr-metro',
    regionGeometry:
      'POLYGON ((77.55 13.00, 77.72 13.00, 77.72 13.14, 77.55 13.14, 77.55 13.00))',
    airspaceClass: 'G',
    altitudeFloorFtAmsl: 0,
    altitudeCeilingFtAmsl: 4000,
    regionStatus: 'ACTIVE',
    maxFleetSize: 30,
    notes: 'Covers KIA approach corridor, Hebbal and Yelahanka.',
    createdAt: '2025-02-01T08:00:00Z',
  },
  {
    regionId: 'rg-blr-east',
    regionCode: 'BLR-E',
    regionName: 'Bengaluru East (Whitefield)',
    clusterId: 'cl-blr-metro',
    regionGeometry:
      'POLYGON ((77.68 12.93, 77.78 12.93, 77.78 13.00, 77.68 13.00, 77.68 12.93))',
    airspaceClass: 'G',
    altitudeFloorFtAmsl: 0,
    altitudeCeilingFtAmsl: 3500,
    regionStatus: 'ACTIVE',
    maxFleetSize: 20,
    notes: 'Whitefield tech-park belt.',
    createdAt: '2025-02-01T08:00:00Z',
  },
  {
    regionId: 'rg-blr-south',
    regionCode: 'BLR-S',
    regionName: 'Bengaluru South (Electronic City)',
    clusterId: 'cl-blr-metro',
    regionGeometry:
      'POLYGON ((77.62 12.80, 77.72 12.80, 77.72 12.90, 77.62 12.90, 77.62 12.80))',
    airspaceClass: 'G',
    altitudeFloorFtAmsl: 0,
    altitudeCeilingFtAmsl: 3500,
    regionStatus: 'PLANNED',
    maxFleetSize: 15,
    notes: 'Electronic City phase I & II.',
    createdAt: '2025-02-01T08:00:00Z',
  },
];

export const mockZones: OperatingZoneDTO[] = [
  {
    zoneId: 'zn-hebbal-core',
    zoneCode: 'BLR-N-HBL',
    zoneName: 'Hebbal Urban Core',
    regionId: 'rg-blr-north',
    clusterId: 'cl-blr-metro',
    zoneType: 'OPERATION',
    zoneSubtype: 'URBAN_CORE',
    zoneStatus: 'ACTIVE',
    altitudeFloorFtAmsl: 0,
    altitudeCeilingFtAmsl: 2500,
    airspaceClass: 'G',
    boundaryGeometry:
      'POLYGON ((77.58 13.02, 77.63 13.02, 77.63 13.06, 77.58 13.06, 77.58 13.02))',
    centerLatitude: 13.04,
    centerLongitude: 77.605,
    createdAt: '2025-02-15T08:00:00Z',
  },
  {
    zoneId: 'zn-whitefield-tech',
    zoneCode: 'BLR-E-WTF',
    zoneName: 'Whitefield Tech Zone',
    regionId: 'rg-blr-east',
    clusterId: 'cl-blr-metro',
    zoneType: 'OPERATION',
    zoneSubtype: 'SUBURBAN',
    zoneStatus: 'ACTIVE',
    altitudeFloorFtAmsl: 0,
    altitudeCeilingFtAmsl: 2500,
    airspaceClass: 'G',
    boundaryGeometry:
      'POLYGON ((77.70 12.95, 77.76 12.95, 77.76 12.99, 77.70 12.99, 77.70 12.95))',
    centerLatitude: 12.97,
    centerLongitude: 77.73,
    createdAt: '2025-02-15T08:00:00Z',
  },
  {
    zoneId: 'zn-ecity',
    zoneCode: 'BLR-S-EC',
    zoneName: 'Electronic City Zone',
    regionId: 'rg-blr-south',
    clusterId: 'cl-blr-metro',
    zoneType: 'OPERATION',
    zoneSubtype: 'PERIURBAN',
    zoneStatus: 'PLANNED',
    altitudeFloorFtAmsl: 0,
    altitudeCeilingFtAmsl: 2500,
    airspaceClass: 'G',
    boundaryGeometry:
      'POLYGON ((77.64 12.83, 77.70 12.83, 77.70 12.87, 77.64 12.87, 77.64 12.83))',
    centerLatitude: 12.85,
    centerLongitude: 77.67,
    createdAt: '2025-02-15T08:00:00Z',
  },
];

export const mockClusterPage = () => ({
  content: mockClusters,
  totalElements: mockClusters.length,
  totalPages: 1,
  size: mockClusters.length,
  number: 0,
  numberOfElements: mockClusters.length,
  first: true,
  last: true,
  empty: mockClusters.length === 0,
});

export const mockZonePage = (zones: OperatingZoneDTO[]) => ({
  content: zones,
  totalElements: zones.length,
  totalPages: 1,
  size: zones.length,
  number: 0,
  numberOfElements: zones.length,
  first: true,
  last: true,
  empty: zones.length === 0,
});

export const newId = (prefix: string): string => {
  const rnd =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${rnd}`;
};
