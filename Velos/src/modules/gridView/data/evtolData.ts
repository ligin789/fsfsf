export interface EvtolFlight {
  flightId: string;
  tailNumber: string;
  model: string;
  operator: string;
  origin: string;
  destination: string;
  status: 'Scheduled' | 'In-Flight' | 'Landed' | 'Delayed' | 'Cancelled';
  departure: string;
  arrival: string;
  altitudeFt: number;
  speedKts: number;
  batteryPct: number;
  payloadKg: number;
  pilot: string;
}

export const evtolFlights: EvtolFlight[] = [
  { flightId: 'VEL-1001', tailNumber: 'N101VL', model: 'Joby S4',         operator: 'Joby Aviation',  origin: 'BLR Vertiport A', destination: 'BLR Vertiport C', status: 'In-Flight', departure: '2026-05-03T08:15', arrival: '2026-05-03T08:32', altitudeFt: 1500, speedKts: 142, batteryPct: 78, payloadKg: 320, pilot: 'A. Rao' },
  { flightId: 'VEL-1002', tailNumber: 'N204AR', model: 'Archer Midnight', operator: 'Archer',         origin: 'BLR Vertiport B', destination: 'KIA Terminal',    status: 'Scheduled', departure: '2026-05-03T08:45', arrival: '2026-05-03T09:10', altitudeFt: 0,    speedKts: 0,   batteryPct: 95, payloadKg: 410, pilot: 'M. Singh' },
  { flightId: 'VEL-1003', tailNumber: 'N305LL', model: 'Lilium Jet',      operator: 'Lilium',         origin: 'KIA Terminal',    destination: 'BLR Vertiport A', status: 'Landed',    departure: '2026-05-03T07:30', arrival: '2026-05-03T07:55', altitudeFt: 0,    speedKts: 0,   batteryPct: 22, payloadKg: 280, pilot: 'R. Iyer' },
  { flightId: 'VEL-1004', tailNumber: 'N418EH', model: 'EHang 216',       operator: 'EHang',          origin: 'BLR Vertiport C', destination: 'BLR Vertiport D', status: 'Delayed',   departure: '2026-05-03T09:00', arrival: '2026-05-03T09:18', altitudeFt: 0,    speedKts: 0,   batteryPct: 88, payloadKg: 220, pilot: 'S. Kapoor' },
  { flightId: 'VEL-1005', tailNumber: 'N522VW', model: 'Volocopter VC2',  operator: 'Volocopter',     origin: 'BLR Vertiport D', destination: 'BLR Vertiport B', status: 'In-Flight', departure: '2026-05-03T08:05', arrival: '2026-05-03T08:25', altitudeFt: 1200, speedKts: 96,  batteryPct: 64, payloadKg: 180, pilot: 'P. Nair' },
  { flightId: 'VEL-1006', tailNumber: 'N634JB', model: 'Joby S4',         operator: 'Joby Aviation',  origin: 'KIA Terminal',    destination: 'BLR Vertiport C', status: 'Scheduled', departure: '2026-05-03T09:30', arrival: '2026-05-03T09:55', altitudeFt: 0,    speedKts: 0,   batteryPct: 100, payloadKg: 350, pilot: 'D. Gupta' },
  { flightId: 'VEL-1007', tailNumber: 'N745AR', model: 'Archer Midnight', operator: 'Archer',         origin: 'BLR Vertiport A', destination: 'KIA Terminal',    status: 'In-Flight', departure: '2026-05-03T08:20', arrival: '2026-05-03T08:48', altitudeFt: 1800, speedKts: 138, batteryPct: 55, payloadKg: 390, pilot: 'V. Menon' },
  { flightId: 'VEL-1008', tailNumber: 'N856LL', model: 'Lilium Jet',      operator: 'Lilium',         origin: 'BLR Vertiport B', destination: 'BLR Vertiport D', status: 'Cancelled', departure: '2026-05-03T08:40', arrival: '2026-05-03T09:05', altitudeFt: 0,    speedKts: 0,   batteryPct: 100, payloadKg: 0,   pilot: '—' },
  { flightId: 'VEL-1009', tailNumber: 'N967EH', model: 'EHang 216',       operator: 'EHang',          origin: 'BLR Vertiport D', destination: 'BLR Vertiport A', status: 'Landed',    departure: '2026-05-03T07:10', arrival: '2026-05-03T07:30', altitudeFt: 0,    speedKts: 0,   batteryPct: 18, payloadKg: 240, pilot: 'K. Bose' },
  { flightId: 'VEL-1010', tailNumber: 'N108VW', model: 'Volocopter VC2',  operator: 'Volocopter',     origin: 'BLR Vertiport C', destination: 'KIA Terminal',    status: 'Scheduled', departure: '2026-05-03T10:00', arrival: '2026-05-03T10:24', altitudeFt: 0,    speedKts: 0,   batteryPct: 92, payloadKg: 200, pilot: 'L. Pillai' },
  { flightId: 'VEL-1011', tailNumber: 'N219JB', model: 'Joby S4',         operator: 'Joby Aviation',  origin: 'BLR Vertiport B', destination: 'BLR Vertiport C', status: 'In-Flight', departure: '2026-05-03T08:35', arrival: '2026-05-03T08:52', altitudeFt: 1450, speedKts: 130, batteryPct: 70, payloadKg: 310, pilot: 'A. Sharma' },
  { flightId: 'VEL-1012', tailNumber: 'N330AR', model: 'Archer Midnight', operator: 'Archer',         origin: 'KIA Terminal',    destination: 'BLR Vertiport D', status: 'Delayed',   departure: '2026-05-03T09:15', arrival: '2026-05-03T09:42', altitudeFt: 0,    speedKts: 0,   batteryPct: 81, payloadKg: 360, pilot: 'T. Reddy' },
];
