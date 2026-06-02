/**
 * TypeScript types derived strictly from the Regulator Onboarding Service
 * OpenAPI spec. Do not add fields that are not in the spec.
 */

// ---------- Enums ----------
export type IntegrationStatus =
  | 'ENABLED'
  | 'DISABLED'
  | 'SUSPENDED'
  | 'MAINTENANCE'
  | 'DECOMMISSIONED';
export type OperationalScope = 'ALL' | 'CIVIL' | 'GOVERNMENT' | 'EMERGENCY' | 'TEST';
export type ComplianceStatus = 'APPROVED' | 'CONDITIONAL' | 'REVOKED' | 'PENDING';
export type AuthStatus =
  | 'VALID'
  | 'SUSPENDED'
  | 'REVOKED'
  | 'EXPIRED'
  | 'PENDING'
  | 'UNDER_REVIEW';

export const INTEGRATION_STATUS_OPTIONS: IntegrationStatus[] = [
  'ENABLED',
  'DISABLED',
  'SUSPENDED',
  'MAINTENANCE',
  'DECOMMISSIONED',
];
export const OPERATIONAL_SCOPE_OPTIONS: OperationalScope[] = [
  'ALL',
  'CIVIL',
  'GOVERNMENT',
  'EMERGENCY',
  'TEST',
];
export const COMPLIANCE_STATUS_OPTIONS: ComplianceStatus[] = [
  'APPROVED',
  'CONDITIONAL',
  'REVOKED',
  'PENDING',
];

// ---------- API Error ----------
export interface ApiError {
  status?: number;
  error?: string;
  timestamp?: number;
  fieldErrors?: Record<string, string>;
}

// ---------- Regulator ----------
export interface RegulatorRequest {
  regulatorCode: string;
  partnerId: string;
  regulatorName: string;
  regulatorType: string;
  clusterIds: string[];
  primaryClusterId: string;
  countryIso2: string;
  additionalCountries?: string[];
  legalBasis?: string;
  websiteUrl?: string;
  isUtmOwner: boolean;
  utmFramework?: string;
  utmAuthorityLevel?: string;
  usspDesignationRequired: boolean;
  flightIntentRequired: boolean;
  intentSubmissionLeadHours: number;
  autonomousOpsPermitted: boolean;
  maxUtmAltitudeFtAgl?: number;
  opsEmail?: string;
  opsPhone?: string;
  emergencyContact?: string;
  onboardingStatus: string;
  onboardedAt?: string;
  onboardedBy?: string;
  notes?: string;
}

export interface RegulatorDto extends Partial<RegulatorRequest> {
  regulatorId: string;
  regulatorCode: string;
  regulatorName: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- Contact ----------
export interface ContactRequest {
  regulatorId: string;
  partnerId: string;
  contactRole: string;
  fullName: string;
  jobTitle?: string;
  email: string;
  phonePrimary: string;
  phoneSecondary?: string;
  isPrimaryContact: boolean;
  availableHours?: string;
  preferredChannel: string;
  platformUserId?: string;
  contactStatus: string;
}

export interface ContactDto extends Partial<ContactRequest> {
  regContactId: string;
  regulatorId: string;
  fullName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- UTM ----------
export interface UtmRequest {
  regulatorId: string;
  utmSystemId: string;
  clusterId: string;
  partnerId: string;
  utmIntegrationEnabled: boolean;
  integrationStatus: IntegrationStatus;
  integrationEffectiveFrom?: string;
  integrationEffectiveTo?: string;
  disableReason?: string;
  lastStateChangeUtc?: string;
  isPrimary: boolean;
  integrationPriority: number;
  isFailover: boolean;
  failoverUtmId?: string;
  operationalScope: OperationalScope;
  overrideResponseSlaMs?: number;
  overridePollingIntervalSec?: number;
  circuitBreakerEnabled: boolean;
  circuitOpenAfterFailures?: number;
  circuitResetAfterSec?: number;
  authScopeOverride?: string;
  clientCredentialRef?: string;
  mtlsCertRef?: string;
  supportsFlightIntent: boolean;
  supportsAuthorisation: boolean;
  supportsOperationalIntent: boolean;
  supportsConstraints: boolean;
  supportsTelemetry: boolean;
  supportsSubscriptions: boolean;
  lastSuccessfulCallUtc?: string;
  lastFailureUtc?: string;
  consecutiveFailures: number;
  observedLatencyP95Ms?: number;
  observedErrorRatePct?: number;
  slaBreached: boolean;
  approvalReference?: string;
  complianceStatus: ComplianceStatus;
  createdBy?: string;
  updatedBy?: string;
}

export interface UtmDto extends Partial<UtmRequest> {
  regulatorUtmId: string;
  regulatorId: string;
  createdAt?: string;
  updatedAt?: string;
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

export type PageRegulatorDto = Page<RegulatorDto>;
export type PageContactDto = Page<ContactDto>;
export type PageUtmDto = Page<UtmDto>;

export interface PageQuery {
  page?: number;
  size?: number;
  sort?: string;
}

// ---------- Sample foreign-key reference data ----------
// Used to populate dropdowns for partnerId / clusterId / utmSystemId
// until real lookup services are wired in.
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

export const SAMPLE_CLUSTERS: RefOption[] = [
  { id: 'c1000000-0000-4000-8000-000000000001', label: 'Dubai Metro Cluster' },
  { id: 'c1000000-0000-4000-8000-000000000002', label: 'Abu Dhabi Cluster' },
  { id: 'c1000000-0000-4000-8000-000000000003', label: 'Riyadh Cluster' },
  { id: 'c1000000-0000-4000-8000-000000000004', label: 'Singapore Cluster' },
];

export const SAMPLE_UTM_SYSTEMS: RefOption[] = [
  { id: 'u1000000-0000-4000-8000-000000000001', label: 'GAA U-Space Core' },
  { id: 'u1000000-0000-4000-8000-000000000002', label: 'AltitudeAngel GuardianUTM' },
  { id: 'u1000000-0000-4000-8000-000000000003', label: 'Unifly UTM Platform' },
  { id: 'u1000000-0000-4000-8000-000000000004', label: 'OneSky UTM' },
];

export const REGULATOR_TYPE_OPTIONS = [
  'CAA',
  'ANSP',
  'MILITARY',
  'MUNICIPAL',
  'FEDERAL',
];

export const ONBOARDING_STATUS_OPTIONS = [
  'DRAFT',
  'PENDING',
  'ACTIVE',
  'SUSPENDED',
  'OFFBOARDED',
];

export const CONTACT_ROLE_OPTIONS = [
  'PRIMARY',
  'OPERATIONS',
  'TECHNICAL',
  'LEGAL',
  'EMERGENCY',
];

export const PREFERRED_CHANNEL_OPTIONS = ['EMAIL', 'PHONE', 'PORTAL', 'SMS'];

export const CONTACT_STATUS_OPTIONS = ['ACTIVE', 'INACTIVE'];

// ---------- Redux state shape ----------
export interface RegulatorsState {
  regulators: {
    items: RegulatorDto[];
    loading: boolean;
    error: string | null;
    success: string | null;
  };
  contacts: {
    // keyed by regulatorId
    byRegulator: Record<string, ContactDto[]>;
    loading: boolean;
    error: string | null;
    success: string | null;
  };
  utms: {
    // keyed by regulatorId
    byRegulator: Record<string, UtmDto[]>;
    loading: boolean;
    error: string | null;
    success: string | null;
  };
}
