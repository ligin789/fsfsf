export type TripStatus =
  | "ON_TIME"
  | "DELAYED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ISSUE";

export type Trip = {
  id: string;
  tripNumber: string;
  origin: string;
  destination: string;
  evtolId: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  delayMinutes: number;
  status: TripStatus;
  issues?: string[];
};

export type Evtol = {
  id: string;
  model: string;
  batteryLevel: number;
  location: string;
  status: string;
  availability: boolean;
};

export type Vertiport = {
  id: string;
  name?: string;
  pads?: number;
};

export type GanttMode = "aircraft" | "vertiport";

// A pad event is a single departure or arrival of an aircraft at a vertiport.
export type PadEventKind = "DEP" | "ARR";

export type PadEvent = {
  id: string;
  trip: Trip;
  vertiportId: string;
  kind: PadEventKind;
  scheduledAt: string;
  actualAt?: string;
  // Whether the event happened on time. For events still in the future this
  // reflects the *expected* outcome based on current trip status.
  onTime: boolean;
  delayMinutes: number;
};

export type ZoomLevel = 15 | 30 | 60 | 120;

export type FilterState = {
  vertiport: string;
  status: TripStatus | "";
  evtolId: string;
  timeStart: string;
  timeEnd: string;
};
