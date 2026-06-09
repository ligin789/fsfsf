/**
 * TypeScript types derived from the Route / Corridor OpenAPI contract.
 * All UUIDs and dates kept as strings.
 */

export type UUID = string;
export type ISODate = string;
export type ISODateTime = string;

/* ---------- Route ---------- */
export interface RouteResponse {
  routeId: UUID;
  routeDesignator?: string;
  routeName?: string;
  routeType?: string;
  routeClass?: string;
  flightRules?: string;
  routeCategory?: string;
  originVertiportId?: UUID;
  originFatoId?: UUID;
  destinationVertiportId?: UUID;
  destinationFatoId?: UUID;
  isBidirectional?: boolean;
  reverseRouteId?: UUID;
  clusterId?: UUID;
  regionId?: UUID;
  routeGeometryWkt?: string;
  routeGeometry3dWkt?: string;
  totalDistanceNm?: number;
  totalDistanceKm?: number;
  waypointCount?: number;
  segmentCount?: number;
  cruiseAltitudeFt?: number;
  minAltitudeFt?: number;
  maxAltitudeFt?: number;
  altitudeReference?: string;
  nominalSpeedKts?: number;
  minSpeedKts?: number;
  maxSpeedKts?: number;
  nominalBlockTimeSec?: number;
  minBlockTimeSec?: number;
  maxBlockTimeSec?: number;
  timeBasedSeparationSec?: number;
  rnavSpec?: string;
  rcpSpec?: string;
  rspSpec?: string;
  climbGradientPct?: number;
  descentGradientPct?: number;
  climbDistanceNm?: number;
  descentDistanceNm?: number;
  airspaceClasses?: string[];
  firCodes?: string[];
  uirCodes?: string[];
  utmClass?: string;
  atcCoordinationRequired?: boolean;
  atcmRouteId?: string;
  regulatoryApprovalStatus?: string;
  regulatoryApprovalRef?: string;
  approvedByAuthority?: string;
  approvalDate?: ISODate;
  approvalExpiryDate?: ISODate;
  environmentalApprovalRef?: string;
  noiseSensitiveSegments?: boolean;
  maxNoiseLevelDb?: number;
  co2KgPerNm?: number;
  maxWindKts?: number;
  maxCrosswindKts?: number;
  minVisibilitySm?: number;
  minCeilingFt?: number;
  nightOpsPermitted?: boolean;
  imcOpsPermitted?: boolean;
  maxAircraftMtowKg?: number;
  maxPassengerCount?: number;
  cargoOnly?: boolean;
  slotControlled?: boolean;
  maxHourlyMovements?: number;
  maxDailyMovements?: number;
  fixmRouteDesignator?: string;
  icaoDoc4444RouteType?: string;
  sigmetSusceptible?: boolean;
  status?: string;
  effectiveFrom?: ISODate;
  effectiveUntil?: ISODate;
  currentVersion?: number;
  createdAt?: ISODateTime;
  createdBy?: UUID;
  updatedAt?: ISODateTime;
  updatedBy?: UUID;
}

export type RouteCreateDto = Omit<RouteResponse, 'routeId' | 'createdAt' | 'updatedAt'> & {
  createdBy: UUID;
  destinationVertiportId: UUID;
  effectiveFrom: ISODate;
  isBidirectional: boolean;
  originVertiportId: UUID;
  routeDesignator: string;
  routeGeometryWkt: string;
  routeName: string;
  routeType: string;
  status: string;
};

export type RouteUpdateDto = Partial<RouteResponse> & {
  routeId: UUID;
  updatedBy: UUID;
};

/* ---------- Waypoint ---------- */
export interface RouteWayPointResponse {
  waypointId: UUID;
  routeId?: UUID;
  sequenceNumber: number;
  waypointName?: string;
  waypointType?: string;
  isCompulsoryReport?: boolean;
  latitudeDeg?: number;
  longitudeDeg?: number;
  pointGeometry?: string;
  altitudeConstraintType?: string;
  altitudeFloorFt?: number;
  altitudeCeilingFt?: number;
  altitudeTargetFt?: number;
  verticalRateFpm?: number;
  timeConstraintType?: string;
  timeOffsetFromAtdSec?: number;
  earliestOffsetSec?: number;
  latestOffsetSec?: number;
  rtaToleranceSec?: number;
  speedConstraintType?: string;
  speedMinKts?: number;
  speedMaxKts?: number;
  speedTargetKts?: number;
  pathTerminator?: string;
  turnDirection?: string;
  bankAngleDeg?: number;
  arcCentreGeometry?: string;
  arcRadiusNm?: number;
  ocaFt?: number;
  oclFt?: number;
  holdInboundCourseDeg?: number;
  holdTurnDirection?: string;
  holdLegTimeSec?: number;
  holdLegDistanceNm?: number;
  holdMaxSpeedKts?: number;
  navaidRef?: string;
  magneticVariationDeg?: number;
  notes?: string;
}
export type RouteWayPointCreate = Omit<RouteWayPointResponse, 'waypointId'> & {
  latitudeDeg: number;
  longitudeDeg: number;
  pointGeometry: string;
  routeId: UUID;
  sequenceNumber: number;
  waypointName: string;
  waypointType: string;
};
export type RouteWayPointUpdate = Partial<RouteWayPointResponse> & { waypointId: UUID };

/* ---------- Segment ---------- */
export interface RouteSegmentResponse {
  segmentId: UUID;
  routeId?: UUID;
  sequenceNumber: number;
  fromWaypointId?: UUID;
  toWaypointId?: UUID;
  segmentGeometry?: string;
  segmentGeometry3d?: string;
  segmentType?: string;
  legType?: string;
  greatCircleDistanceNm?: number;
  alongTrackDistanceNm?: number;
  trueCourseDeg?: number;
  magneticCourseDeg?: number;
  outboundCourseDeg?: number;
  verticalPhase?: string;
  altStartFt?: number;
  altEndFt?: number;
  altMinFt?: number;
  altMaxFt?: number;
  gradientPct?: number;
  verticalRateFpm?: number;
  speedStartKts?: number;
  speedEndKts?: number;
  speedMinKts?: number;
  speedMaxKts?: number;
  machNumber?: number;
  nominalTransitTimeSec?: number;
  minTransitTimeSec?: number;
  maxTransitTimeSec?: number;
  cumulativeTimeSec?: number;
  timeFlexibilitySec?: number;
  energyKwh?: number;
  batterySocStartPct?: number;
  batterySocEndPct?: number;
  requiredSeparationNm?: number;
  requiredVerticalSepFt?: number;
  noiseSensitive?: boolean;
  urbanOverfly?: boolean;
  overflyRiskClass?: string;
  notes?: string;
}
export type RouteSegmentCreate = Omit<RouteSegmentResponse, 'segmentId'>;
export type RouteSegmentUpdate = Partial<RouteSegmentResponse> & { segmentId: UUID };

/* ---------- Corridor ---------- */
export interface RouteCorridorResponse {
  corridorId: UUID;
  routeId?: UUID;
  corridorName?: string;
  corridorVersion?: number;
  corridorType?: string;
  corridorClass?: string;
  centerlineGeometry?: string;
  corridorPolygon?: string;
  corridorMultipolygon?: string;
  halfWidthM?: number;
  bufferZoneM?: number;
  floorAltitudeFt?: number;
  ceilingAltitudeFt?: number;
  altitudeReference?: string;
  verticalBufferFt?: number;
  variableAltitude?: boolean;
  volumeJson?: Record<string, unknown>;
  totalVolumeKm3?: number;
  timeValidityType?: string;
  preActivationSec?: number;
  postDeactivationSec?: number;
  horizontalSeparationM?: number;
  verticalSeparationFt?: number;
  simultaneousOpsLimit?: number;
  directionalFlow?: string;
  inboundAltitudeFt?: number;
  outboundAltitudeFt?: number;
  contingencyVolumeM?: number;
  contingencyVolumeFt?: number;
  emergencyDivertRoutes?: UUID[];
  ugzId?: string;
  utmCorridorType?: string;
  utmPriorityLevel?: number;
  approvalStatus?: string;
  approvedByAuthority?: string;
  approvalRef?: string;
  approvalDate?: ISODate;
  status?: string;
  effectiveFrom?: ISODate;
  effectiveUntil?: ISODate;
  createdAt?: ISODateTime;
  createdBy?: UUID;
  updatedAt?: ISODateTime;
}
export type RouteCorridorCreate = Omit<RouteCorridorResponse, 'corridorId' | 'createdAt' | 'updatedAt'>;
export type RouteCorridorUpdate = Partial<RouteCorridorResponse> & { corridorId: UUID; updatedBy: UUID };

/* ---------- Reservation ---------- */
export interface CorridorReservationResponse {
  reservationId: UUID;
  corridorId?: UUID;
  routeId?: UUID;
  bookingId?: UUID;
  flightId?: UUID;
  aircraftId?: UUID;
  operatorId?: UUID;
  reservationStatus?: string;
  lockType?: string;
  priorityClass?: string;
  utmPriorityLevel?: number;
  plannedEntryTime?: ISODateTime;
  plannedExitTime?: ISODateTime;
  windowBufferSec?: number;
  effectiveEntryTime?: ISODateTime;
  effectiveExitTime?: ISODateTime;
  softLockCreatedAt?: ISODateTime;
  softLockExpiresAt?: ISODateTime;
  softLockDurationSec?: number;
  softLockExtendedCount?: number;
  maxSoftLockExtensions?: number;
  hardLockCreatedAt?: ISODateTime;
  hardLockConfirmedBy?: UUID;
  hardLockConfirmationRef?: string;
  corridorSubGeometry?: string;
  altitudeFloorFt?: number;
  altitudeCeilingFt?: number;
  conflictsDetected?: boolean;
  conflictZoneIds?: UUID[];
  deconflictionMethod?: string;
  deconflictionAppliedAt?: ISODateTime;
  utmSubmissionRef?: string;
  utmAuthorisationStatus?: string;
  utmAuthorisationTime?: ISODateTime;
  notamReference?: string;
  sagaInstanceId?: UUID;
  processInstanceId?: UUID;
  originatingWorkflow?: string;
  releasedAt?: ISODateTime;
  releasedBy?: UUID;
  releaseReason?: string;
  cancellationNotes?: string;
  createdAt?: ISODateTime;
  createdBy?: UUID;
  updatedAt?: ISODateTime;
  updatedBy?: UUID;
}
export type CorridorReservationCreate = Omit<CorridorReservationResponse, 'reservationId' | 'createdAt' | 'updatedAt'>;
export type CorridorReservationUpdate = Partial<CorridorReservationResponse> & { reservationId: UUID; updatedBy: UUID };

/* ---------- Conflict Zone ---------- */
export interface RouteConflictZoneResponse {
  conflictZoneId: UUID;
  routeId?: UUID;
  conflictingRouteId?: UUID;
  corridorId?: UUID;
  conflictingCorridorId?: UUID;
  conflictType?: string;
  conflictGeometry?: string;
  conflictPoint?: string;
  intersectionAngleDeg?: number;
  horizontalSeparationM?: number;
  verticalSeparationFt?: number;
  alongTrackDistanceNm?: number;
  timeConflictWindowSec?: number;
  minSeparationAchievableSec?: number;
  requiredTimeSepSec?: number;
  resolutionMethod?: string;
  priorityRouteId?: UUID;
  notes?: string;
  computedAt?: ISODateTime;
}
export type RouteConflictZoneCreate = Omit<RouteConflictZoneResponse, 'conflictZoneId'>;
export type RouteConflictZoneUpdate = Partial<RouteConflictZoneResponse> & { conflictZoneId: UUID };

/* ---------- Cross Section ---------- */
export interface CorridorCrossSectionResponse {
  crossSectionId: UUID;
  corridorId?: UUID;
  routeId?: UUID;
  sequenceNumber: number;
  atWaypointId?: UUID;
  fromWaypointId?: UUID;
  toWaypointId?: UUID;
  leftHalfWidthM?: number;
  rightHalfWidthM?: number;
  leftBufferM?: number;
  rightBufferM?: number;
  totalWidthM?: number;
  floorAltitudeFt?: number;
  ceilingAltitudeFt?: number;
  verticalDepthFt?: number;
  crossSectionPolygon?: string;
  sectionCentroid?: string;
  alongTrackDistanceNm?: number;
  widthReason?: string;
  notes?: string;
}
export type CorridorCrossSectionCreate = Omit<CorridorCrossSectionResponse, 'crossSectionId'>;
export type CorridorCrossSectionUpdate = Partial<CorridorCrossSectionResponse> & { crossSectionId: UUID };

/* ---------- Altitude Band ---------- */
export interface CorridorAltitudeBandResponse {
  bandId?: UUID;
  altitudeBandId?: UUID;
  corridorId?: UUID;
  routeId?: UUID;
  sequenceNumber?: number;
  fromWaypointId?: UUID;
  toWaypointId?: UUID;
  atWaypointId?: UUID;
  fromDistanceNm?: number;
  toDistanceNm?: number;
  floorAltitudeFt?: number;
  ceilingAltitudeFt?: number;
  altitudeReference?: string;
  terrainClearanceFt?: number;
  obstacleClearanceFt?: number;
  airspaceClass?: string;
  bandReason?: string;
  notes?: string;
}
export type CorridorAltitudeBandCreate = Omit<CorridorAltitudeBandResponse, 'bandId' | 'altitudeBandId'>;
export type CorridorAltitudeBandUpdate = Partial<CorridorAltitudeBandResponse> & { altitudeBandId: UUID };

/* ---------- Weather Constraint ---------- */
export interface RouteWeatherConstraintResponse {
  constraint_id?: UUID;
  constraintId?: UUID;
  routeId?: UUID;
  segmentId?: UUID;
  constraintName?: string;
  appliesTo?: string;
  maxHeadwindKts?: number;
  maxTailwindKts?: number;
  maxCrosswindKts?: number;
  maxWindAtCruiseKts?: number;
  maxGustKts?: number;
  minVisibilitySm?: number;
  minRvrFt?: number;
  minCeilingFt?: number;
  precipitationAllowed?: string;
  freezingPrecipAllowed?: boolean;
  icingConditionsAllowed?: boolean;
  maxTurbulenceIntensity?: string;
  minTempC?: number;
  maxTempC?: number;
  maxDensityAltitudeFt?: number;
  breachAction?: string;
  autoCloseOnSigmet?: boolean;
  autoCloseOnPirep?: boolean;
  notes?: string;
}
export type RouteWeatherConstraintCreate = Omit<RouteWeatherConstraintResponse, 'constraintId' | 'constraint_id'>;
export type RouteWeatherConstraintUpdate = Partial<RouteWeatherConstraintResponse> & { constraintId: UUID };

/* ---------- Operating Window ---------- */
export interface RouteOperatingWindowResponse {
  windowId: UUID;
  routeId?: UUID;
  windowName?: string;
  windowType?: string;
  daysOfWeek?: number[];
  timeStartLocal?: string;
  timeEndLocal?: string;
  crossesMidnight?: boolean;
  timezoneRef?: string;
  validFrom?: ISODate;
  validUntil?: ISODate;
  exceptionDates?: ISODate[];
  holidaySchedule?: string;
  maxMovementsPerHour?: number;
  maxMovementsPerDay?: number;
  slotDurationSec?: number;
  cargoOnly?: boolean;
  nightOps?: boolean;
  reducedNoiseRequired?: boolean;
  regulatoryRef?: string;
  notes?: string;
}
export type RouteOperatingWindowCreate = Omit<RouteOperatingWindowResponse, 'windowId'>;
export type RouteOperatingWindowUpdate = Partial<RouteOperatingWindowResponse> & { windowId: UUID };

/* ---------- Performance ---------- */
export interface RoutePerformanceResponse {
  profileId?: UUID;
  performanceId?: UUID;
  routeId?: UUID;
  aircraftTypeId?: UUID;
  aircraftTypeCode?: string;
  nominalBlockTimeSec?: number;
  minBlockTimeSec?: number;
  maxBlockTimeSec?: number;
  totalEnergyKwh?: number;
  climbEnergyKwh?: number;
  cruiseEnergyKwh?: number;
  descentEnergyKwh?: number;
  hoverEnergyKwh?: number;
  contingencyEnergyKwh?: number;
  finalReserveEnergyKwh?: number;
  minSocAtDeparturePct?: number;
  expectedSocAtArrivalPct?: number;
  minSocAtArrivalPct?: number;
  socContingencyPct?: number;
  maxPayloadKg?: number;
  maxPassengerCount?: number;
  typicalPassengerKg?: number;
  maxCargoKg?: number;
  climbRateFpm?: number;
  descentRateFpm?: number;
  oeiCapable?: boolean;
  oeiMaxRangeNm?: number;
  windPerformanceFactor?: number;
  certificationBasis?: string;
  noiseClass?: string;
  effectiveFrom?: ISODate;
  effectiveUntil?: ISODate;
  createdAt?: ISODateTime;
  createdBy?: UUID;
}
export type RoutePerformanceCreate = Omit<RoutePerformanceResponse, 'profileId' | 'performanceId'>;
export type RoutePerformanceUpdate = Partial<RoutePerformanceResponse> & { performanceId: UUID };

/* ---------- Version ---------- */
export interface RouteVersionResponse {
  versionId: UUID;
  routeId?: UUID;
  versionNumber?: number;
  airacCycle?: string;
  changeType?: string;
  changeSummary?: string;
  changeReason?: string;
  routeSnapshot?: string;
  waypointsSnapshot?: string;
  corridorSnapshot?: string;
  requiresRegulatoryApproval?: boolean;
  approvalStatus?: string;
  approvedBy?: UUID;
  approvedAt?: ISODateTime;
  effectiveFrom?: ISODate;
  effectiveUntil?: ISODate;
  isCurrent?: boolean;
  createdAt?: ISODateTime;
  createdBy?: UUID;
}
export type RouteVersionCreate = Omit<RouteVersionResponse, 'versionId' | 'createdAt'>;
export type RouteVersionUpdate = Partial<RouteVersionResponse> & { versionId: UUID };
