/**
 * Dummy fixture for the Process Groups module.
 *
 * Seeded from the attached ProcessGroup JSON. Two shallow variants are derived
 * from the base document so the left-hand list is demonstrable with multiple
 * groups. This is the single point to swap for a real API later.
 *
 * TODO: replace with api.getProcessGroups()
 */
import type { ProcessGroup } from '../store/types';

/** Base group — a faithful transcription of the attached JSON document. */
const onDemandOperations: ProcessGroup = {
  process_group_id: '5579d0ae-404a-49c7-888e-20c722360e60',
  process_group_key: 'AAM_AdHoc_OnDemand_Operations',
  name: 'On-Demand Flight Request and fulfilment Process',
  execution_model: 'DAG',
  purpose: {
    business_objective: 'AAM Ad-Hoc On-Demand Operations',
    primary_kpis: [
      'BOOKING_TO_DEPARTURE_LEAD_TIME',
      'ON_TIME_DEPARTURE',
      'FLIGHT_COMPLETION_TIME',
      'TURNAROUND_TIME',
    ],
  },
  domain: {
    industry: 'AAM',
    function: 'booking',
    subfunction: 'prebooking',
    applicability: {
      operatingcluster: ['BLR'],
    },
  },
  operator: {
    operatorCode: 'VELOSKY',
    operatorName: 'VeloSky Aviation India Limited',
    operatorType: 'AAM_OPERATOR',
    policyNamespace: 'opa://policies/aam/operators/VELOSKY',
    region: 'BLR',
  },
  nodes: [
    {
      node_id: 'PG-FEASIBILITY',
      process_key: 'ADHOC_BOOKING_FEASIBILITY_ASSESSMENT',
      exports: ['AggregateFeasibilityContext'],
    },
    {
      node_id: 'PG-CONFIRMATION',
      process_key: 'PASSENGER_BOOKING_CONFIRMATION_AND_HOLD',
      imports: ['AggregateFeasibilityContext'],
      exports: ['BookingHold'],
    },
    {
      node_id: 'PG-ORDER-CREATION',
      process_key: 'ORDER_CONFIRMATION_AND_HARD_RESERVATION',
      imports: ['AggregateFeasibilityContext', 'BookingHold'],
      exports: ['AAMOrderViewRS'],
    },
    {
      node_id: 'PG-FLIGHT-PREPARATION',
      process_key: 'DYNAMIC_FLIGHT_PREPARATION',
      imports: ['AAMOrderViewRS'],
      exports: ['AAMFlightReady'],
    },
    {
      node_id: 'PG-BOARDING',
      process_key: 'FLIGHT_BOARDING_MANAGEMENT',
      imports: ['AAMFlightReady'],
      exports: ['BoardingComplete'],
    },
    {
      node_id: 'PG-FLIGHT',
      process_key: 'FLIGHT_EXECUTION_AND_TRACKING',
      imports: ['BoardingComplete'],
      exports: ['FlightArrived'],
    },
    {
      node_id: 'PG-DISEMBARK',
      process_key: 'PASSENGER_DISEMBARKATION',
      imports: ['FlightArrived'],
      exports: ['DisembarkComplete'],
    },
    {
      node_id: 'PG-TURNAROUND',
      process_key: 'AIRCRAFT_TURNAROUND',
      imports: ['DisembarkComplete'],
      exports: ['AircraftReady'],
    },
  ],
  edges: [
    { from: 'PG-FEASIBILITY', to: 'PG-CONFIRMATION' },
    { from: 'PG-CONFIRMATION', to: 'PG-ORDER-CREATION' },
    { from: 'PG-ORDER-CREATION', to: 'PG-FLIGHT-PREPARATION' },
    { from: 'PG-FLIGHT-PREPARATION', to: 'PG-BOARDING' },
    { from: 'PG-BOARDING', to: 'PG-FLIGHT' },
    { from: 'PG-FLIGHT', to: 'PG-DISEMBARK' },
    { from: 'PG-DISEMBARK', to: 'PG-TURNAROUND' },
  ],
  version: '1.1.0',
  metadata: {
    updatedForProcess: 'DYNAMIC_FLIGHT_PREPARATION:1.1.0',
    changeReason:
      'Align PG with fork/join based Dynamic Flight Preparation and failure exit path',
  },
};

/**
 * Variant 1 — a scheduled-shuttle flavour. Shallow remix of the base group with
 * a different name / key / operator and a branch edge that carries a `condition`
 * so edge labels are demonstrable in the canvas.
 */
const scheduledShuttle: ProcessGroup = {
  ...onDemandOperations,
  process_group_id: 'a1b2c3d4-1111-4a2b-9c3d-000000000001',
  process_group_key: 'AAM_Scheduled_Shuttle_Operations',
  name: 'Scheduled Shuttle Boarding and Dispatch Process',
  purpose: {
    business_objective: 'AAM Scheduled Shuttle Operations',
    primary_kpis: ['ON_TIME_DEPARTURE', 'LOAD_FACTOR', 'TURNAROUND_TIME'],
  },
  domain: {
    industry: 'AAM',
    function: 'booking',
    subfunction: 'scheduled',
    applicability: { operatingcluster: ['DEL'] },
  },
  operator: {
    operatorCode: 'SKYHOP',
    operatorName: 'SkyHop Urban Mobility Pvt Ltd',
    operatorType: 'AAM_OPERATOR',
    policyNamespace: 'opa://policies/aam/operators/SKYHOP',
    region: 'DEL',
  },
  nodes: [
    {
      node_id: 'PG-MANIFEST',
      process_key: 'SHUTTLE_MANIFEST_GENERATION',
      exports: ['ShuttleManifest'],
    },
    {
      node_id: 'PG-CHECKIN',
      process_key: 'PASSENGER_CHECKIN_AND_SCREENING',
      imports: ['ShuttleManifest'],
      exports: ['ScreenedManifest'],
    },
    {
      node_id: 'PG-BOARDING',
      process_key: 'FLIGHT_BOARDING_MANAGEMENT',
      imports: ['ScreenedManifest'],
      exports: ['BoardingComplete'],
    },
    {
      node_id: 'PG-DISPATCH',
      process_key: 'FLIGHT_DISPATCH_AND_RELEASE',
      imports: ['BoardingComplete'],
      exports: ['DispatchRelease'],
    },
  ],
  edges: [
    { from: 'PG-MANIFEST', to: 'PG-CHECKIN' },
    { from: 'PG-CHECKIN', to: 'PG-BOARDING', condition: 'screening.status == PASS' },
    { from: 'PG-BOARDING', to: 'PG-DISPATCH' },
  ],
  version: '2.0.0',
  metadata: {
    updatedForProcess: 'SHUTTLE_MANIFEST_GENERATION:2.0.0',
    changeReason: 'Introduce screening gate before boarding for scheduled shuttles',
  },
};

/**
 * Variant 2 — a cargo flavour. Another shallow remix exercising a different
 * operator / cluster and a conditional re-inspection edge.
 */
const cargoLogistics: ProcessGroup = {
  ...onDemandOperations,
  process_group_id: 'a1b2c3d4-2222-4a2b-9c3d-000000000002',
  process_group_key: 'AAM_Cargo_Logistics_Operations',
  name: 'Cargo Pickup, Load and Delivery Process',
  purpose: {
    business_objective: 'AAM Cargo Logistics Operations',
    primary_kpis: ['PICKUP_TO_DELIVERY_LEAD_TIME', 'PAYLOAD_UTILISATION'],
  },
  domain: {
    industry: 'AAM',
    function: 'logistics',
    subfunction: 'cargo',
    applicability: { operatingcluster: ['BOM'] },
  },
  operator: {
    operatorCode: 'AEROFREIGHT',
    operatorName: 'AeroFreight Cargo Systems',
    operatorType: 'AAM_OPERATOR',
    policyNamespace: 'opa://policies/aam/operators/AEROFREIGHT',
    region: 'BOM',
  },
  nodes: [
    {
      node_id: 'PG-PICKUP',
      process_key: 'CARGO_PICKUP_SCHEDULING',
      exports: ['CargoManifest'],
    },
    {
      node_id: 'PG-LOAD',
      process_key: 'CARGO_LOAD_AND_BALANCE',
      imports: ['CargoManifest'],
      exports: ['LoadSheet'],
    },
    {
      node_id: 'PG-INSPECT',
      process_key: 'CARGO_SECURITY_INSPECTION',
      imports: ['LoadSheet'],
      exports: ['InspectionCleared'],
    },
    {
      node_id: 'PG-DELIVER',
      process_key: 'CARGO_FLIGHT_AND_DELIVERY',
      imports: ['InspectionCleared'],
      exports: ['DeliveryConfirmed'],
    },
  ],
  edges: [
    { from: 'PG-PICKUP', to: 'PG-LOAD' },
    { from: 'PG-LOAD', to: 'PG-INSPECT' },
    { from: 'PG-INSPECT', to: 'PG-DELIVER', condition: 'inspection.result == CLEARED' },
  ],
  version: '1.0.0',
  metadata: {
    updatedForProcess: 'CARGO_SECURITY_INSPECTION:1.0.0',
    changeReason: 'Add mandatory security inspection gate prior to cargo delivery',
  },
};

export const dummyProcessGroups: ProcessGroup[] = [
  onDemandOperations,
  scheduledShuttle,
  cargoLogistics,
];
