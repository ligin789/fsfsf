// Mock admin data — shapes mirror the schemas in vertiport-onboarding-api-docs.yaml
// Used for read-only admin views; no functional API calls wired up.

export interface VtmRow {
  techSystemId: string;
  vtmSystemRegistryId: string;
  vtmIntegration: boolean;
  integrationStatus: "ENABLED" | "DISABLED" | "ONBOARDING" | "SUSPENDED" | "DECOMMISSIONED";
  trafficScope: "ALL" | "ARRIVAL_ONLY" | "DEPARTURE_ONLY" | "EMERGENCY_ONLY";
  integrationPriority: number;
  isFallback: boolean;
  regulatoryAuthority: "DGCA" | "FAA" | "EASA" | "CAA" | "LOCAL_ATC";
  complianceStatus: "APPROVED" | "CONDITIONAL" | "REVOKED" | "PENDING";
  observedErrorRatePct: number;
  slaBreached: boolean;
  updatedAt: string;
}

export const mockVtmRows: VtmRow[] = [
  { techSystemId: "ts-001", vtmSystemRegistryId: "reg-1001", vtmIntegration: true, integrationStatus: "ENABLED", trafficScope: "ALL", integrationPriority: 1, isFallback: false, regulatoryAuthority: "DGCA", complianceStatus: "APPROVED", observedErrorRatePct: 0.04, slaBreached: false, updatedAt: "2026-04-10T11:30:00Z" },
  { techSystemId: "ts-002", vtmSystemRegistryId: "reg-1002", vtmIntegration: true, integrationStatus: "ONBOARDING", trafficScope: "ARRIVAL_ONLY", integrationPriority: 2, isFallback: true, regulatoryAuthority: "LOCAL_ATC", complianceStatus: "PENDING", observedErrorRatePct: 1.2, slaBreached: false, updatedAt: "2026-04-08T09:12:00Z" },
  { techSystemId: "ts-003", vtmSystemRegistryId: "reg-1003", vtmIntegration: false, integrationStatus: "SUSPENDED", trafficScope: "ALL", integrationPriority: 3, isFallback: false, regulatoryAuthority: "DGCA", complianceStatus: "CONDITIONAL", observedErrorRatePct: 4.7, slaBreached: true, updatedAt: "2026-04-06T17:45:00Z" },
  { techSystemId: "ts-004", vtmSystemRegistryId: "reg-1004", vtmIntegration: true, integrationStatus: "ENABLED", trafficScope: "EMERGENCY_ONLY", integrationPriority: 1, isFallback: true, regulatoryAuthority: "LOCAL_ATC", complianceStatus: "APPROVED", observedErrorRatePct: 0.01, slaBreached: false, updatedAt: "2026-04-11T08:00:00Z" },
  { techSystemId: "ts-005", vtmSystemRegistryId: "reg-1005", vtmIntegration: false, integrationStatus: "DECOMMISSIONED", trafficScope: "ALL", integrationPriority: 4, isFallback: false, regulatoryAuthority: "FAA", complianceStatus: "REVOKED", observedErrorRatePct: 0, slaBreached: false, updatedAt: "2025-12-20T10:10:00Z" },
];

export interface VertihubRow {
  vertihubId: string;
  vertihubCode: string;
  vertihubName: string;
  hubType: string;
  maxParkedAircraft: number;
  hasMaintenance: boolean;
  hasCharging: boolean;
  chargingPadCount: number;
  maxChargePowerKw: number;
  hubStatus: string;
}

export const mockVertihubRows: VertihubRow[] = [
  { vertihubId: "vh-001", vertihubCode: "HUB-A", vertihubName: "Central Maintenance Hub", hubType: "MAINTENANCE_HUB", maxParkedAircraft: 12, hasMaintenance: true, hasCharging: true, chargingPadCount: 4, maxChargePowerKw: 350, hubStatus: "ACTIVE" },
  { vertihubId: "vh-002", vertihubCode: "HUB-B", vertihubName: "Fast Charge Hub", hubType: "CHARGING_HUB", maxParkedAircraft: 8, hasMaintenance: false, hasCharging: true, chargingPadCount: 8, maxChargePowerKw: 500, hubStatus: "ACTIVE" },
  { vertihubId: "vh-003", vertihubCode: "HUB-C", vertihubName: "Overnight Parking Hub", hubType: "PARKING_HUB", maxParkedAircraft: 20, hasMaintenance: false, hasCharging: true, chargingPadCount: 6, maxChargePowerKw: 250, hubStatus: "ACTIVE" },
  { vertihubId: "vh-004", vertihubCode: "HUB-D", vertihubName: "Heavy Maintenance Bay", hubType: "MAINTENANCE_HUB", maxParkedAircraft: 4, hasMaintenance: true, hasCharging: false, chargingPadCount: 0, maxChargePowerKw: 0, hubStatus: "MAINTENANCE" },
];

export interface VertihubEnergyRow {
  hubEnergyId: string;
  vertihubId: string;
  tariffPeriodType: string;
  dayOfWeek: string;
  gridCapacityKw: number;
  simultaneousChargeLimit: number;
  reservedCapacityKw: number;
  availableCapacityKw: number;
  tariffRatePerKwh: number;
  currencyCode: string;
  demandChargePerKw: number;
  gridOperator: string;
  recordStatus: string;
}

export const mockVertihubEnergyRows: VertihubEnergyRow[] = [
  { hubEnergyId: "he-001", vertihubId: "vh-001", tariffPeriodType: "PEAK", dayOfWeek: "MON-FRI", gridCapacityKw: 2000, simultaneousChargeLimit: 4, reservedCapacityKw: 800, availableCapacityKw: 1200, tariffRatePerKwh: 8.5, currencyCode: "INR", demandChargePerKw: 120, gridOperator: "Adani Electricity", recordStatus: "ACTIVE" },
  { hubEnergyId: "he-002", vertihubId: "vh-001", tariffPeriodType: "OFF_PEAK", dayOfWeek: "MON-FRI", gridCapacityKw: 2000, simultaneousChargeLimit: 6, reservedCapacityKw: 400, availableCapacityKw: 1600, tariffRatePerKwh: 5.2, currencyCode: "INR", demandChargePerKw: 60, gridOperator: "Adani Electricity", recordStatus: "ACTIVE" },
  { hubEnergyId: "he-003", vertihubId: "vh-002", tariffPeriodType: "STANDARD", dayOfWeek: "ALL", gridCapacityKw: 3500, simultaneousChargeLimit: 8, reservedCapacityKw: 1000, availableCapacityKw: 2500, tariffRatePerKwh: 6.8, currencyCode: "INR", demandChargePerKw: 90, gridOperator: "Tata Power", recordStatus: "ACTIVE" },
  { hubEnergyId: "he-004", vertihubId: "vh-003", tariffPeriodType: "NIGHT", dayOfWeek: "ALL", gridCapacityKw: 1500, simultaneousChargeLimit: 6, reservedCapacityKw: 200, availableCapacityKw: 1300, tariffRatePerKwh: 3.9, currencyCode: "INR", demandChargePerKw: 40, gridOperator: "BSES", recordStatus: "ACTIVE" },
];

export interface TerminalRow {
  terminalId: string;
  terminalCode: string;
  terminalName: string;
  terminalType: "DOMESTIC" | "INTERNATIONAL" | "MEDEVAC" | "VIP" | "CARGO" | "MIXED";
  floorCount: number;
  totalAreaSqm: number;
  paxCapacityPeak: number;
  paxThroughputPerHour: number;
  gateCount: number;
  accessibilityCompliant: boolean;
  hasBaggageHandling: boolean;
  hasLounge: boolean;
  status: "OPEN" | "CLOSED" | "MAINTENANCE" | "LIMITED_OPS";
}

export const mockTerminalRows: TerminalRow[] = [
  { terminalId: "t-001", terminalCode: "T1", terminalName: "Terminal 1 — Domestic", terminalType: "DOMESTIC", floorCount: 2, totalAreaSqm: 4800, paxCapacityPeak: 240, paxThroughputPerHour: 180, gateCount: 4, accessibilityCompliant: true, hasBaggageHandling: true, hasLounge: true, status: "OPEN" },
  { terminalId: "t-002", terminalCode: "T2", terminalName: "Terminal 2 — VIP", terminalType: "VIP", floorCount: 1, totalAreaSqm: 1200, paxCapacityPeak: 40, paxThroughputPerHour: 30, gateCount: 2, accessibilityCompliant: true, hasBaggageHandling: true, hasLounge: true, status: "OPEN" },
  { terminalId: "t-003", terminalCode: "T3", terminalName: "Cargo Terminal", terminalType: "CARGO", floorCount: 1, totalAreaSqm: 2400, paxCapacityPeak: 0, paxThroughputPerHour: 0, gateCount: 3, accessibilityCompliant: false, hasBaggageHandling: false, hasLounge: false, status: "OPEN" },
  { terminalId: "t-004", terminalCode: "T4", terminalName: "Medevac Wing", terminalType: "MEDEVAC", floorCount: 1, totalAreaSqm: 900, paxCapacityPeak: 12, paxThroughputPerHour: 20, gateCount: 2, accessibilityCompliant: true, hasBaggageHandling: false, hasLounge: false, status: "LIMITED_OPS" },
  { terminalId: "t-005", terminalCode: "T5", terminalName: "Mixed Use Terminal", terminalType: "MIXED", floorCount: 3, totalAreaSqm: 6200, paxCapacityPeak: 320, paxThroughputPerHour: 240, gateCount: 6, accessibilityCompliant: true, hasBaggageHandling: true, hasLounge: true, status: "MAINTENANCE" },
];

export interface PadRow {
  padId: string;
  padCode: string;
  padName: string;
  padType: string;
  padFunction: string;
  centroidLat: number;
  centroidLon: number;
  elevationFtAmsl: number;
  loadRatingMtowKg: number;
  surfaceType: string;
  hasLighting: boolean;
  vtmLiveStatus: string;
  isEmergencyPad: boolean;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "DECOMMISSIONED";
}

export const mockPadRows: PadRow[] = [
  { padId: "pad-001", padCode: "F01", padName: "FATO Alpha", padType: "FATO", padFunction: "BIDIRECTIONAL", centroidLat: 19.076, centroidLon: 72.8777, elevationFtAmsl: 45, loadRatingMtowKg: 3500, surfaceType: "CONCRETE", hasLighting: true, vtmLiveStatus: "AVAILABLE", isEmergencyPad: false, status: "ACTIVE" },
  { padId: "pad-002", padCode: "F02", padName: "FATO Bravo", padType: "FATO", padFunction: "ARRIVAL_ONLY", centroidLat: 19.077, centroidLon: 72.8779, elevationFtAmsl: 45, loadRatingMtowKg: 3200, surfaceType: "CONCRETE", hasLighting: true, vtmLiveStatus: "OCCUPIED", isEmergencyPad: false, status: "ACTIVE" },
  { padId: "pad-003", padCode: "P01", padName: "Parking Stand 1", padType: "PARKING", padFunction: "PARKING_ONLY", centroidLat: 19.0762, centroidLon: 72.8775, elevationFtAmsl: 45, loadRatingMtowKg: 3000, surfaceType: "ASPHALT", hasLighting: false, vtmLiveStatus: "AVAILABLE", isEmergencyPad: false, status: "ACTIVE" },
  { padId: "pad-004", padCode: "C01", padName: "Charge Pad 1", padType: "CHARGING", padFunction: "CHARGING_ONLY", centroidLat: 19.0764, centroidLon: 72.8773, elevationFtAmsl: 45, loadRatingMtowKg: 2800, surfaceType: "COMPOSITE", hasLighting: true, vtmLiveStatus: "RESERVED", isEmergencyPad: false, status: "ACTIVE" },
  { padId: "pad-005", padCode: "E01", padName: "Emergency Pad", padType: "EMERGENCY", padFunction: "MULTI_FUNCTION", centroidLat: 19.0767, centroidLon: 72.8771, elevationFtAmsl: 45, loadRatingMtowKg: 4000, surfaceType: "CONCRETE", hasLighting: true, vtmLiveStatus: "AVAILABLE", isEmergencyPad: true, status: "ACTIVE" },
  { padId: "pad-006", padCode: "M01", padName: "Maintenance Bay 1", padType: "MAINTENANCE", padFunction: "MAINTENANCE_ONLY", centroidLat: 19.0769, centroidLon: 72.877, elevationFtAmsl: 45, loadRatingMtowKg: 3500, surfaceType: "STEEL_DECK", hasLighting: true, vtmLiveStatus: "MAINTENANCE", isEmergencyPad: false, status: "MAINTENANCE" },
];

export interface PadCapabilityRow {
  capabilityId: string;
  padId: string;
  aircraftTypeCode: string;
  isCompatible: boolean;
  maxMtowKg: number;
  opsCategory: "IFR" | "VFR" | "BOTH";
  nightOpsCapable: boolean;
  autonomousOpsCapable: boolean;
  canCharge: boolean;
  chargingStandard: string;
  maxChargeRateKw: number;
  minTurnaroundMin: number;
  status: "ACTIVE" | "SUSPENDED" | "UNDER_REVIEW";
}

export const mockPadCapabilityRows: PadCapabilityRow[] = [
  { capabilityId: "cap-001", padId: "pad-001", aircraftTypeCode: "EVT-S4", isCompatible: true, maxMtowKg: 3200, opsCategory: "BOTH", nightOpsCapable: true, autonomousOpsCapable: true, canCharge: false, chargingStandard: "—", maxChargeRateKw: 0, minTurnaroundMin: 8, status: "ACTIVE" },
  { capabilityId: "cap-002", padId: "pad-001", aircraftTypeCode: "EVT-S6", isCompatible: true, maxMtowKg: 3500, opsCategory: "IFR", nightOpsCapable: true, autonomousOpsCapable: false, canCharge: false, chargingStandard: "—", maxChargeRateKw: 0, minTurnaroundMin: 10, status: "ACTIVE" },
  { capabilityId: "cap-003", padId: "pad-004", aircraftTypeCode: "EVT-S4", isCompatible: true, maxMtowKg: 3000, opsCategory: "VFR", nightOpsCapable: false, autonomousOpsCapable: false, canCharge: true, chargingStandard: "CCS2", maxChargeRateKw: 350, minTurnaroundMin: 25, status: "ACTIVE" },
  { capabilityId: "cap-004", padId: "pad-002", aircraftTypeCode: "EVT-S2", isCompatible: true, maxMtowKg: 2200, opsCategory: "VFR", nightOpsCapable: true, autonomousOpsCapable: true, canCharge: false, chargingStandard: "—", maxChargeRateKw: 0, minTurnaroundMin: 6, status: "UNDER_REVIEW" },
  { capabilityId: "cap-005", padId: "pad-006", aircraftTypeCode: "EVT-X1", isCompatible: false, maxMtowKg: 0, opsCategory: "BOTH", nightOpsCapable: false, autonomousOpsCapable: false, canCharge: false, chargingStandard: "—", maxChargeRateKw: 0, minTurnaroundMin: 0, status: "SUSPENDED" },
];

export interface OperatingScheduleRow {
  scheduleId: string;
  scheduleName: string;
  scheduleType: string;
  effectiveFrom: string;
  effectiveUntil: string;
  openTimeLocal: string;
  closeTimeLocal: string;
  is24hr: boolean;
  opsCategory: string;
  maxMovementsPerHour: number;
  maxPaxPerHour: number;
  nightOpsPermitted: boolean;
  appliesTo: string;
}

export const mockOperatingScheduleRows: OperatingScheduleRow[] = [
  { scheduleId: "sch-001", scheduleName: "Weekday Standard", scheduleType: "STANDARD", effectiveFrom: "2026-01-01", effectiveUntil: "2026-12-31", openTimeLocal: "06:00", closeTimeLocal: "22:00", is24hr: false, opsCategory: "FULL", maxMovementsPerHour: 24, maxPaxPerHour: 240, nightOpsPermitted: false, appliesTo: "FULL_VERTIPORT" },
  { scheduleId: "sch-002", scheduleName: "Weekend Reduced", scheduleType: "REDUCED", effectiveFrom: "2026-01-01", effectiveUntil: "2026-12-31", openTimeLocal: "08:00", closeTimeLocal: "20:00", is24hr: false, opsCategory: "REDUCED", maxMovementsPerHour: 12, maxPaxPerHour: 120, nightOpsPermitted: false, appliesTo: "FULL_VERTIPORT" },
  { scheduleId: "sch-003", scheduleName: "Festival Extended", scheduleType: "EXTENDED", effectiveFrom: "2026-10-15", effectiveUntil: "2026-11-15", openTimeLocal: "05:00", closeTimeLocal: "23:59", is24hr: false, opsCategory: "FULL", maxMovementsPerHour: 30, maxPaxPerHour: 300, nightOpsPermitted: true, appliesTo: "FULL_VERTIPORT" },
  { scheduleId: "sch-004", scheduleName: "Emergency 24/7", scheduleType: "EMERGENCY", effectiveFrom: "2026-01-01", effectiveUntil: "2030-12-31", openTimeLocal: "00:00", closeTimeLocal: "23:59", is24hr: true, opsCategory: "EMERGENCY_ONLY", maxMovementsPerHour: 6, maxPaxPerHour: 20, nightOpsPermitted: true, appliesTo: "FATO_ONLY" },
];

export interface NoiseLimitsRow {
  noiseLimitsId: string;
  daytimeDbLimit: number;
  daytimeDbRange: number;
  nighttimeDbLimit: number;
  nighttimeDbRange: number;
  isNoiseMonitoring: boolean;
  daytimeStart: string;
  nighttimeStart: string;
  updatedAt: string;
}

export const mockNoiseLimitsRows: NoiseLimitsRow[] = [
  { noiseLimitsId: "nl-001", daytimeDbLimit: 65, daytimeDbRange: 5, nighttimeDbLimit: 55, nighttimeDbRange: 3, isNoiseMonitoring: true, daytimeStart: "06:00", nighttimeStart: "22:00", updatedAt: "2026-03-20T10:00:00Z" },
  { noiseLimitsId: "nl-002", daytimeDbLimit: 70, daytimeDbRange: 5, nighttimeDbLimit: 60, nighttimeDbRange: 4, isNoiseMonitoring: true, daytimeStart: "07:00", nighttimeStart: "21:00", updatedAt: "2026-02-18T09:15:00Z" },
  { noiseLimitsId: "nl-003", daytimeDbLimit: 60, daytimeDbRange: 4, nighttimeDbLimit: 50, nighttimeDbRange: 2, isNoiseMonitoring: false, daytimeStart: "06:00", nighttimeStart: "22:00", updatedAt: "2026-01-05T12:30:00Z" },
];

export interface ContactRow {
  contactId: string;
  contactGroupType: "head_quarters" | "operations_Command_center" | "regional_command_center" | "emergency";
  contactGroupRole: string;
  contactTypeCode: "Mobile" | "Fixed_Line" | "Fax";
  dialFormattedNumber: string;
  contactEmailAddress: string;
  contactSurname: string;
  contactFirstName: string;
  contactNameTitle: string;
  updatedAt: string;
}

export const mockContactRows: ContactRow[] = [
  { contactId: "c-001", contactGroupType: "head_quarters", contactGroupRole: "ACCOUNTABLE_MANAGER", contactTypeCode: "Mobile", dialFormattedNumber: "+91 98765 43210", contactEmailAddress: "am@velos.aero", contactSurname: "Menon", contactFirstName: "Arjun", contactNameTitle: "Mr.", updatedAt: "2026-03-12T09:00:00Z" },
  { contactId: "c-002", contactGroupType: "operations_Command_center", contactGroupRole: "OPS_DIRECTOR", contactTypeCode: "Mobile", dialFormattedNumber: "+91 98765 43211", contactEmailAddress: "ops@velos.aero", contactSurname: "Rao", contactFirstName: "Divya", contactNameTitle: "Ms.", updatedAt: "2026-03-14T11:00:00Z" },
  { contactId: "c-003", contactGroupType: "emergency", contactGroupRole: "EMERGENCY", contactTypeCode: "Fixed_Line", dialFormattedNumber: "+91 22 1234 5678", contactEmailAddress: "emergency@velos.aero", contactSurname: "Khan", contactFirstName: "Imran", contactNameTitle: "Mr.", updatedAt: "2026-02-28T08:30:00Z" },
  { contactId: "c-004", contactGroupType: "head_quarters", contactGroupRole: "SAFETY_MANAGER", contactTypeCode: "Mobile", dialFormattedNumber: "+91 98765 43212", contactEmailAddress: "safety@velos.aero", contactSurname: "Sharma", contactFirstName: "Priya", contactNameTitle: "Ms.", updatedAt: "2026-03-22T14:15:00Z" },
  { contactId: "c-005", contactGroupType: "regional_command_center", contactGroupRole: "DISPATCH_LEAD", contactTypeCode: "Mobile", dialFormattedNumber: "+91 98765 43213", contactEmailAddress: "dispatch@velos.aero", contactSurname: "Iyer", contactFirstName: "Karthik", contactNameTitle: "Mr.", updatedAt: "2026-04-01T07:45:00Z" },
  { contactId: "c-006", contactGroupType: "head_quarters", contactGroupRole: "REGULATORY", contactTypeCode: "Fixed_Line", dialFormattedNumber: "+91 22 9876 5432", contactEmailAddress: "regulatory@velos.aero", contactSurname: "Singh", contactFirstName: "Rohit", contactNameTitle: "Mr.", updatedAt: "2026-03-30T10:00:00Z" },
];

export interface AuditLogRow {
  auditId: string;
  tableName: string;
  actionTypeCode: string;
  actionPerformed: string;
  changedBy: string;
  changedAt: string;
  ipAddress: string;
  userName: string;
}

export const mockAuditLogRows: AuditLogRow[] = [
  { auditId: "a-001", tableName: "vertiport", actionTypeCode: "UPDATE", actionPerformed: "Updated maxSimultaneousMovements from 4 to 5", changedBy: "admin@velos.aero", changedAt: "2026-04-12T09:30:00Z", ipAddress: "192.168.1.24", userName: "Ligin Abraham" },
  { auditId: "a-002", tableName: "pad", actionTypeCode: "INSERT", actionPerformed: "Created pad C02 (Charging)", changedBy: "ops@velos.aero", changedAt: "2026-04-11T14:20:00Z", ipAddress: "192.168.1.31", userName: "Divya Rao" },
  { auditId: "a-003", tableName: "operating_schedule", actionTypeCode: "UPDATE", actionPerformed: "Extended schedule sch-003 to 2026-11-15", changedBy: "ops@velos.aero", changedAt: "2026-04-10T11:15:00Z", ipAddress: "192.168.1.31", userName: "Divya Rao" },
  { auditId: "a-004", tableName: "vtm", actionTypeCode: "UPDATE", actionPerformed: "Set integrationStatus to SUSPENDED for ts-003", changedBy: "regulatory@velos.aero", changedAt: "2026-04-06T17:45:00Z", ipAddress: "10.10.5.18", userName: "Rohit Singh" },
  { auditId: "a-005", tableName: "contact", actionTypeCode: "DELETE", actionPerformed: "Removed contact c-007 (obsolete)", changedBy: "admin@velos.aero", changedAt: "2026-04-05T08:00:00Z", ipAddress: "192.168.1.24", userName: "Ligin Abraham" },
  { auditId: "a-006", tableName: "noise_limits", actionTypeCode: "UPDATE", actionPerformed: "Changed nighttimeDbLimit from 58 to 55", changedBy: "safety@velos.aero", changedAt: "2026-04-02T16:30:00Z", ipAddress: "192.168.1.45", userName: "Priya Sharma" },
  { auditId: "a-007", tableName: "terminal", actionTypeCode: "UPDATE", actionPerformed: "Set terminal T5 status to MAINTENANCE", changedBy: "ops@velos.aero", changedAt: "2026-04-01T07:00:00Z", ipAddress: "192.168.1.31", userName: "Divya Rao" },
  { auditId: "a-008", tableName: "pad_capability", actionTypeCode: "INSERT", actionPerformed: "Added capability cap-005 for EVT-X1", changedBy: "admin@velos.aero", changedAt: "2026-03-28T12:45:00Z", ipAddress: "192.168.1.24", userName: "Ligin Abraham" },
];

export interface AirsideZoneRow {
  airsideZoneId: string;
  zoneCode: string;
  zoneName: string;
  zoneType: string;
  elevationFtAmsl: number;
  maxHeightAglFt: number;
  loadRatingKpa: number;
  surfaceType: string;
  drainageClass: string;
  lightingAvailable: boolean;
  restrictedAccess: boolean;
  status: "ACTIVE" | "CLOSED" | "RESTRICTED" | "UNDER_MAINTENANCE";
}

export const mockAirsideZoneRows: AirsideZoneRow[] = [
  { airsideZoneId: "z-001", zoneCode: "FATO-A", zoneName: "FATO Area Alpha", zoneType: "FATO_AREA", elevationFtAmsl: 45, maxHeightAglFt: 200, loadRatingKpa: 1500, surfaceType: "CONCRETE", drainageClass: "RAPID", lightingAvailable: true, restrictedAccess: true, status: "ACTIVE" },
  { airsideZoneId: "z-002", zoneCode: "APN-1", zoneName: "Main Apron", zoneType: "APRON", elevationFtAmsl: 44, maxHeightAglFt: 50, loadRatingKpa: 1200, surfaceType: "ASPHALT", drainageClass: "STANDARD", lightingAvailable: true, restrictedAccess: true, status: "ACTIVE" },
  { airsideZoneId: "z-003", zoneCode: "TWY-1", zoneName: "Taxiway 1", zoneType: "TAXIWAY_SYSTEM", elevationFtAmsl: 44, maxHeightAglFt: 30, loadRatingKpa: 1000, surfaceType: "ASPHALT", drainageClass: "STANDARD", lightingAvailable: true, restrictedAccess: true, status: "ACTIVE" },
  { airsideZoneId: "z-004", zoneCode: "PRK-1", zoneName: "Parking Area A", zoneType: "PARKING_AREA", elevationFtAmsl: 44, maxHeightAglFt: 25, loadRatingKpa: 900, surfaceType: "ASPHALT", drainageClass: "STANDARD", lightingAvailable: false, restrictedAccess: true, status: "ACTIVE" },
  { airsideZoneId: "z-005", zoneCode: "CHG-1", zoneName: "Charging Area 1", zoneType: "CHARGING_AREA", elevationFtAmsl: 45, maxHeightAglFt: 30, loadRatingKpa: 1100, surfaceType: "COMPOSITE", drainageClass: "RAPID", lightingAvailable: true, restrictedAccess: true, status: "ACTIVE" },
  { airsideZoneId: "z-006", zoneCode: "OFZ", zoneName: "Obstacle Free Zone", zoneType: "OBSTACLE_FREE_ZONE", elevationFtAmsl: 45, maxHeightAglFt: 500, loadRatingKpa: 0, surfaceType: "GRASS", drainageClass: "STANDARD", lightingAvailable: false, restrictedAccess: true, status: "RESTRICTED" },
  { airsideZoneId: "z-007", zoneCode: "EMR-1", zoneName: "Emergency Access", zoneType: "EMERGENCY_ACCESS", elevationFtAmsl: 44, maxHeightAglFt: 20, loadRatingKpa: 800, surfaceType: "CONCRETE", drainageClass: "STANDARD", lightingAvailable: true, restrictedAccess: false, status: "ACTIVE" },
];

export interface AddressRow {
  addressId: string;
  adrgroupcode: "Primary" | "operations_Command_center" | "regional_command_center" | "Emergency";
  adrTypeCode: "HEAD_QUARTERS" | "COMMAND_CENTER";
  adrFirstLine: string;
  adrSecondLine: string;
  adrStreetName: string;
  adrCityName: string;
  adrState: string;
  adrPostalCode: string;
  adrCountry: string;
}

export const mockAddressRows: AddressRow[] = [
  { addressId: "adr-001", adrgroupcode: "Primary", adrTypeCode: "HEAD_QUARTERS", adrFirstLine: "Velos Tower", adrSecondLine: "12th Floor", adrStreetName: "Marine Drive", adrCityName: "Mumbai", adrState: "Maharashtra", adrPostalCode: "400020", adrCountry: "India" },
  { addressId: "adr-002", adrgroupcode: "operations_Command_center", adrTypeCode: "COMMAND_CENTER", adrFirstLine: "Ops Wing", adrSecondLine: "Block B", adrStreetName: "BKC Road", adrCityName: "Mumbai", adrState: "Maharashtra", adrPostalCode: "400051", adrCountry: "India" },
  { addressId: "adr-003", adrgroupcode: "regional_command_center", adrTypeCode: "COMMAND_CENTER", adrFirstLine: "Regional HQ", adrSecondLine: "2nd Floor", adrStreetName: "MG Road", adrCityName: "Bangalore", adrState: "Karnataka", adrPostalCode: "560001", adrCountry: "India" },
  { addressId: "adr-004", adrgroupcode: "Emergency", adrTypeCode: "COMMAND_CENTER", adrFirstLine: "Emergency Response Centre", adrSecondLine: "Ground Floor", adrStreetName: "Airport Road", adrCityName: "Mumbai", adrState: "Maharashtra", adrPostalCode: "400099", adrCountry: "India" },
];
