/**
 * TypeScript types derived strictly from the OEM Onboarding OpenAPI spec.
 * Do not add fields that are not in the spec.
 */

// ---------- Enums ----------
export const CERTIFICATION_BASIS = [
  'EASA_SC_VTOL',
  'FAA_AC21_37',
  'TCCA_VTOL',
  'CAAC_VTOL',
  'BILATERAL',
  'TC_PENDING',
  'EXPERIMENTAL',
] as const;
export const AIRWORTHINESS_CATEGORY = [
  'ENHANCED',
  'BASIC',
  'SPECIFIC',
  'STANDARD',
  'SPECIAL',
  'EXPERIMENTAL',
] as const;
export const OPERATIONAL_CATEGORY = [
  'COMMERCIAL_TRANSPORT',
  'AERIAL_WORK',
  'PRIVATE',
  'AUTONOMOUS_UAS',
  'CARGO_UAS',
] as const;
export const UAM_CLASS = [
  'UAM_PASSENGER',
  'UAM_CARGO',
  'UAM_MEDEVAC',
  'UAM_HYBRID',
  'UAM_AUTONOMOUS',
] as const;
export const PROPULSION_TYPE = [
  'FULL_ELECTRIC',
  'HYBRID_ELECTRIC',
  'HYDROGEN_ELECTRIC',
  'TURBOELECTRIC',
] as const;
export const VTOL_TOPOLOGY = [
  'LIFT_CRUISE',
  'VECTORED_THRUST',
  'MULTIROTOR',
  'TILTROTOR',
  'TILTWING',
  'COAXIAL',
  'DISTRIBUTED_LIFT',
] as const;
export const NOISE_CLASS = [
  'ICAO_CHAPTER_14',
  'EASA_CS36',
  'QUIET_URBAN',
  'STANDARD',
] as const;
export const AIRCRAFT_STATUS = [
  'ACTIVE',
  'PHASED_OUT',
  'IN_DEVELOPMENT',
  'TC_SUSPENDED',
  'GROUNDED_FLEET',
] as const;
export const PACK_ROLE = [
  'PRIMARY',
  'RESERVE',
  'AUXILIARY',
  'HYBRID_ICE_BUFFER',
] as const;
export const CELL_CHEMISTRY = [
  'LI_ION_NMC',
  'LI_ION_LFP',
  'LI_ION_NCA',
  'SOLID_STATE',
  'LI_S',
  'NA_ION',
] as const;
export const CHARGE_PROTOCOL = [
  'CC_CV',
  'MULTI_STAGE',
  'ADAPTIVE',
  'OEM_PROPRIETARY',
] as const;

export const OEM_STATUS_OPTIONS = [
  'ACTIVE',
  'PENDING',
  'SUSPENDED',
  'OFFBOARDED',
];
export const LEGAL_ENTITY_TYPES = [
  'CORPORATION',
  'LLC',
  'PARTNERSHIP',
  'SUBSIDIARY',
  'JOINT_VENTURE',
];
export const CONTACT_ROLE_OPTIONS = [
  'PRIMARY',
  'COMMERCIAL',
  'TECHNICAL',
  'SUPPORT',
  'QUALITY',
];
export const PREFERRED_CHANNEL_OPTIONS = ['EMAIL', 'PHONE', 'PORTAL', 'SMS'];
export const CONTACT_STATUS_OPTIONS = ['ACTIVE', 'INACTIVE'];

// ---------- API Error ----------
export interface ApiError {
  status?: number;
  error?: string;
  timestamp?: number;
  fieldErrors?: Record<string, string>;
}

// ---------- OEM Master ----------
export interface MasterRequest {
  oemCode: string;
  partnerId: string;
  oemName: string;
  legalEntityType: string;
  registrationNumber: string;
  registrationCountry: string;
  registration_date: string;
  websiteUrl?: string;
  oemStatus: string;
  createdBy: string;
  notes: string;
}

export interface MasterDto extends Partial<MasterRequest> {
  oemId: string;
  oemCode: string;
  oemName: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- OEM Contact ----------
export interface ContactRequest {
  partnerId: string;
  contactRole: string;
  fullName: string;
  jobTitle?: string;
  email: string;
  phonePrimary: string;
  phoneSecondary?: string;
  is247Available: boolean;
  isPrimaryContact: boolean;
  preferredChannel: string;
  timezone?: string;
  platformUserId?: string;
  contactStatus: string;
}

export interface ContactDto extends Partial<ContactRequest> {
  oemContactId: string;
  fullName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- Aircraft Type ----------
export interface AircraftTypeRequest {
  partnerId: string;
  manufacturer: string;
  typeCode: string;
  modelName: string;
  variant?: string;
  certificationBasis: (typeof CERTIFICATION_BASIS)[number];
  typeCertificateNumber?: string;
  tcIssuingAuthority?: string;
  tcIssueDate?: string;
  tcExpiryDate?: string;
  airworthinessCategory: (typeof AIRWORTHINESS_CATEGORY)[number];
  operationalCategory: (typeof OPERATIONAL_CATEGORY)[number];
  uamClass: (typeof UAM_CLASS)[number];
  propulsionType: (typeof PROPULSION_TYPE)[number];
  vtolTopology: (typeof VTOL_TOPOLOGY)[number];
  rotorCount: number;
  motorCount: number;
  oeiCapable: boolean;
  oeiFlightTimeMin?: number;
  vtolToFixedTransition: boolean;
  mtowKg: number;
  mzfwKg?: number;
  mlwKg?: number;
  oweKg: number;
  maxPayloadKg: number;
  maxPassengerCount: number;
  pilotRequired: boolean;
  pilotSeats: number;
  standardPaxWeightKg: number;
  maxBaggageKgPerPax?: number;
  vneKts: number;
  vmoKts: number;
  cruiseSpeedKts: number;
  hoverMaxDurationMin?: number;
  maxWindKts: number;
  maxCrosswindKts: number;
  maxTailwindKts: number;
  maxDensityAltitudeFt: number;
  ceilingFt: number;
  maxRangeNm: number;
  typicalRangeNm: number;
  noiseClass: (typeof NOISE_CLASS)[number];
  maxNoiseEpndb?: number;
  co2gPerKm?: number;
  minTempOpsC: number;
  maxTempOpsC: number;
  status: (typeof AIRCRAFT_STATUS)[number];
  entryIntoServiceDate?: string;
}

export interface AircraftTypeDto extends Partial<AircraftTypeRequest> {
  typeId: string;
  manufacturer?: string;
  typeCode?: string;
  modelName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- Aircraft Battery Profile ----------
export interface AircraftBatteryProfileRequest {
  typeId: string;
  manufacturer: string;
  partnerId: string;
  typeCode: string;
  specCode: string;
  specName: string;
  packRole: (typeof PACK_ROLE)[number];
  cellChemistry: (typeof CELL_CHEMISTRY)[number];
  nominalVoltageV: number;
  usableCapacityKwh: number;
  grossCapacityKwh: number;
  minSocPct: number;
  maxSocPct: number;
  reserveSocPct: number;
  contingencySocPct: number;
  alternateSocPct?: number;
  dispatchMinSocPct: number;
  maxChargeRateKw: number;
  maxChargeCRate: number;
  fastChargeMaxKw?: number;
  trickleChargeKw?: number;
  chargeProtocol: (typeof CHARGE_PROTOCOL)[number];
  chargingStandard: string;
  regenBrakingCapable: boolean;
  regenMaxKw?: number;
  minChargeTempC: number;
  maxChargeTempC: number;
  minDischargeTempC: number;
  maxDischargeTempC: number;
  thermalRunawayTempC: number;
  activeThermalMgmt: boolean;
  thermalMgmtPowerKw?: number;
  designCycleLife: number;
  soh80pctThresholdCycles?: number;
  calendarLifeYears?: number;
  capacityFadePctPer100c?: number;
  sohRemovalThresholdPct: number;
  packWeightKg: number;
  effectiveFrom: string;
  isCurrent: boolean;
}

export interface AircraftBatteryProfileDto
  extends Partial<AircraftBatteryProfileRequest> {
  batterySpecId: string;
  typeId?: string;
  specCode?: string;
  specName?: string;
  createdAt?: string;
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

export type PageMasterDto = Page<MasterDto>;
export type PageContactDto = Page<ContactDto>;
export type PageAircraftTypeDto = Page<AircraftTypeDto>;
export type PageAircraftBatteryProfileDto = Page<AircraftBatteryProfileDto>;

export interface PageQuery {
  page?: number;
  size?: number;
  sort?: string;
}

// ---------- Sample foreign-key reference data ----------
export interface RefOption {
  id: string;
  label: string;
}

export const SAMPLE_PARTNERS: RefOption[] = [
  { id: 'a1b2c3d4-0001-4000-8000-000000000001', label: 'TCS Velos Aviation' },
  { id: 'a1b2c3d4-0002-4000-8000-000000000002', label: 'SkyGrid Partners' },
  { id: 'a1b2c3d4-0003-4000-8000-000000000003', label: 'AeroLink Global' },
  { id: 'a1b2c3d4-0004-4000-8000-000000000004', label: 'UrbanAir Mobility Co.' },
];

// ---------- Redux state shape ----------
export interface OemState {
  masters: {
    items: MasterDto[];
    loading: boolean;
    error: string | null;
    success: string | null;
  };
  contacts: {
    byOem: Record<string, ContactDto[]>;
    loading: boolean;
    error: string | null;
    success: string | null;
  };
  aircraftTypes: {
    byOem: Record<string, AircraftTypeDto[]>;
    loading: boolean;
    error: string | null;
    success: string | null;
  };
  batteryProfiles: {
    byOem: Record<string, AircraftBatteryProfileDto[]>;
    loading: boolean;
    error: string | null;
    success: string | null;
  };
}
