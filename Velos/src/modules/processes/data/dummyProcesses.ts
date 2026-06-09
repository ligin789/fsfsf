/**
 * Dummy fixture for the Processes module.
 *
 * The base document is the attached Process JSON, loaded via Vite's `?raw`
 * suffix + JSON.parse (the host has `resolveJsonModule` OFF). Two shallow
 * variants are derived with `process_key`s that match other nodes of the
 * On-Demand process group, so the left tree links groups ↔ processes.
 *
 * TODO: replace with api.getProcesses()
 */
import type { ProcessDoc } from '../store/types';
import rawBase from './adhocFeasibility.process.json?raw';

const base = JSON.parse(rawBase) as ProcessDoc;

/** Deep clone so each fixture edits independently in the store. */
const clone = (doc: ProcessDoc): ProcessDoc => JSON.parse(JSON.stringify(doc)) as ProcessDoc;

/**
 * Variant keyed to the group's 2nd node (PASSENGER_BOOKING_CONFIRMATION_AND_HOLD).
 * Shallow remix: new identity + name/status, same flow shape for the demo.
 */
const confirmation: ProcessDoc = (() => {
  const doc = clone(base);
  doc.process_id = 'p-variant-confirmation-0001';
  doc.process_key = 'PASSENGER_BOOKING_CONFIRMATION_AND_HOLD';
  doc.name = 'Passenger Booking Confirmation and Hold';
  doc.description = 'Confirm the passenger booking against the feasibility offer and place a temporary hold.';
  doc.version = '1.0.0';
  doc.status = 'draft';
  return doc;
})();

/**
 * Variant keyed to the group's 3rd node (ORDER_CONFIRMATION_AND_HARD_RESERVATION).
 */
const orderCreation: ProcessDoc = (() => {
  const doc = clone(base);
  doc.process_id = 'p-variant-order-0002';
  doc.process_key = 'ORDER_CONFIRMATION_AND_HARD_RESERVATION';
  doc.name = 'Order Confirmation and Hard Reservation';
  doc.description = 'Convert the held booking into a confirmed order with a hard aircraft/slot reservation.';
  doc.version = '2.1.0';
  doc.status = 'active';
  return doc;
})();

export const dummyProcesses: ProcessDoc[] = [base, confirmation, orderCreation];
