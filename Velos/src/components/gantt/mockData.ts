import dayjs from "dayjs";
import type { Trip, Evtol } from "./types";

const today = dayjs().format("YYYY-MM-DD");

const models = [
  "Volocopter VoloCity",
  "Joby S4",
  "Lilium Jet",
  "Archer Midnight",
  "EHang 216",
  "Wisk Aero Gen6",
  "Beta ALIA",
  "Vertical VX4",
];

const vertiports = [
  "VPT-DOWNTOWN",
  "VPT-AIRPORT",
  "VPT-MARINA",
  "VPT-HILLSIDE",
  "VPT-CENTRAL",
  "VPT-NORTHGATE",
  "VPT-SOUTHBAY",
  "VPT-EASTPORT",
  "VPT-WESTFIELD",
  "VPT-SKYBRIDGE",
];

const statuses: Array<"Active" | "Standby" | "Maintenance" | "Charging"> = [
  "Active",
  "Standby",
  "Maintenance",
  "Charging",
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const evtols: Evtol[] = Array.from({ length: 16 }, (_, i) => {
  const id = `EVTOL-${String(i + 1).padStart(2, "0")}`;
  const status = pickRandom(statuses);
  return {
    id,
    model: models[i % models.length],
    batteryLevel: rand(25, 100),
    location: pickRandom(vertiports),
    status,
    availability: status === "Active" || status === "Standby",
  };
});

let tripCounter = 0;

const issueMessages = [
  "Battery thermal warning",
  "Navigation sensor fault",
  "Weather hold — high winds",
  "Vertiport congestion",
  "Rotor vibration alert",
  "ATC hold — restricted airspace",
  "Passenger medical emergency",
  "Communication link degraded",
];

function generateTrips(evtolId: string, count: number): Trip[] {
  const now = dayjs();
  const trips: Trip[] = [];
  let hour = 6;
  let minute = 0;

  for (let j = 0; j < count; j++) {
    tripCounter++;
    const tripId = `TRP-${String(tripCounter).padStart(4, "0")}`;
    const origin = pickRandom(vertiports);
    let dest = pickRandom(vertiports);
    while (dest === origin) dest = pickRandom(vertiports);

    const durationMin = rand(15, 50);
    const scheduledStart = dayjs(`${today}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
    const scheduledEnd = scheduledStart.add(durationMin, "minute");

    let status: Trip["status"];
    let delayMinutes = 0;
    let issues: string[] | undefined;
    let actualStart: string | undefined;
    let actualEnd: string | undefined;

    // Determine status based on current time
    const isPast = scheduledEnd.isBefore(now);             // flight window fully in the past
    const isActive = scheduledStart.isBefore(now) && scheduledEnd.isAfter(now); // happening now
    // const isFuture = scheduledStart.isAfter(now);       // hasn't started yet

    if (isPast) {
      // Past flights can be COMPLETED or DELAYED (arrived late)
      const roll = Math.random();
      if (roll < 0.2) {
        status = "DELAYED";
        delayMinutes = rand(5, 25);
        actualStart = scheduledStart.add(delayMinutes, "minute").toISOString();
        actualEnd = scheduledEnd.add(delayMinutes, "minute").toISOString();
      } else {
        status = "COMPLETED";
        actualStart = scheduledStart.toISOString();
        actualEnd = scheduledEnd.add(rand(-2, 5), "minute").toISOString();
      }
    } else if (isActive) {
      // Currently active flights can be IN_PROGRESS, DELAYED, or have an ISSUE
      const roll = Math.random();
      if (roll < 0.15) {
        status = "ISSUE";
        delayMinutes = rand(15, 60);
        issues = [pickRandom(issueMessages)];
        actualStart = scheduledStart.add(rand(0, 10), "minute").toISOString();
      } else if (roll < 0.3) {
        status = "DELAYED";
        delayMinutes = rand(5, 15);
        actualStart = scheduledStart.add(delayMinutes, "minute").toISOString();
      } else {
        status = "IN_PROGRESS";
        actualStart = scheduledStart.toISOString();
      }
    } else {
      // Future flights are ON_TIME (scheduled) or could have a pre-departure ISSUE
      const roll = Math.random();
      if (roll < 0.08) {
        status = "ISSUE";
        delayMinutes = rand(10, 40);
        issues = [pickRandom(issueMessages)];
      } else {
        status = "ON_TIME";
      }
    }

    trips.push({
      id: tripId,
      tripNumber: `FL-${rand(100, 999)}`,
      origin,
      destination: dest,
      evtolId,
      scheduledStart: scheduledStart.toISOString(),
      scheduledEnd: scheduledEnd.toISOString(),
      actualStart,
      actualEnd,
      delayMinutes,
      status,
      issues,
    });

    // gap between trips
    const gap = rand(10, 40);
    const nextStart = scheduledEnd.add(gap + delayMinutes, "minute");
    hour = nextStart.hour();
    minute = nextStart.minute();

    if (hour >= 22) break;
  }

  return trips;
}

export const trips: Trip[] = evtols.flatMap((ev) =>
  generateTrips(ev.id, rand(3, 6))
);

export const allVertiports = vertiports;
