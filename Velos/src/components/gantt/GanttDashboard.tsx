import React, { useState, useCallback, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { Badge } from "react-bootstrap";
import TimelineHeader from "./TimelineHeader";
import EvtolSidebar from "./EvtolSidebar";
import VertiportSidebar from "./VertiportSidebar";
import GanttGrid from "./GanttGrid";
import IssuePanel from "./IssuePanel";
import ReassignModal from "./ReassignModal";
import ZoomControls from "./ZoomControls";
import FilterPanel from "./FilterPanel";
import {
  evtols as defaultEvtols,
  trips as defaultTrips,
  allVertiports as defaultVertiportIds,
} from "./mockData";
import type {
  Trip,
  Evtol,
  Vertiport,
  ZoomLevel,
  FilterState,
  GanttMode,
  PadEvent,
} from "./types";

const PIXELS_PER_MINUTE: Record<ZoomLevel, number> = {
  15: 6,
  30: 4,
  60: 2.5,
  120: 1.5,
};

interface Props {
  mode?: GanttMode;
  evtols?: Evtol[];
  trips?: Trip[];
  vertiports?: Vertiport[];
  /** Optional title shown left of the toolbar stats */
  title?: string;
}

const GanttDashboard: React.FC<Props> = ({
  mode = "aircraft",
  evtols,
  trips,
  vertiports,
  title,
}) => {
  // Resolve data sources (fall back to mocks so the component is usable standalone)
  const sourceEvtols = evtols ?? defaultEvtols;
  const sourceTrips = trips ?? defaultTrips;
  const sourceVertiports = useMemo<Vertiport[]>(
    () =>
      vertiports ??
      defaultVertiportIds.map((id) => ({ id, name: id.replace("VPT-", "") })),
    [vertiports]
  );

  // State
  const [zoom, setZoom] = useState<ZoomLevel>(30);
  const [now, setNow] = useState(dayjs());
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [tripsData, setTripsData] = useState<Trip[]>(sourceTrips);
  const [evtolsData] = useState<Evtol[]>(sourceEvtols);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Panel / modal state
  const [panelTrip, setPanelTrip] = useState<Trip | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [reassignTrip, setReassignTrip] = useState<Trip | null>(null);
  const [showReassign, setShowReassign] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    vertiport: "",
    status: "",
    evtolId: "",
    timeStart: "",
    timeEnd: "",
  });

  // Sync incoming trips prop changes
  useEffect(() => {
    setTripsData(sourceTrips);
  }, [sourceTrips]);

  // Real-time clock
  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 15_000);
    return () => clearInterval(id);
  }, []);

  // Lock the viewport while the gantt is mounted so nothing scrolls except
  // the timeline grid itself.
  useEffect(() => {
    document.body.classList.add("gantt-active");
    return () => {
      document.body.classList.remove("gantt-active");
    };
  }, []);

  // Real-time simulation: random status updates (only when trips not provided externally)
  useEffect(() => {
    if (trips) return; // external data — don't mutate
    const id = setInterval(() => {
      setTripsData((prev) =>
        prev.map((t) => {
          if (t.status !== "IN_PROGRESS" && t.status !== "ON_TIME") return t;
          const roll = Math.random();
          if (roll < 0.03) {
            return {
              ...t,
              status: "DELAYED" as const,
              delayMinutes: Math.floor(Math.random() * 20) + 5,
            };
          }
          if (roll < 0.015) {
            return {
              ...t,
              status: "ISSUE" as const,
              delayMinutes: Math.floor(Math.random() * 30) + 10,
              issues: ["Unexpected rotor vibration detected"],
            };
          }
          return t;
        })
      );
    }, 8_000);
    return () => clearInterval(id);
  }, [trips]);

  // Timeline bounds (06:00 to 22:00)
  const timeStart = useMemo(
    () => dayjs().startOf("day").add(6, "hour"),
    []
  );
  const timeEnd = useMemo(
    () => dayjs().startOf("day").add(22, "hour"),
    []
  );

  const ppm = PIXELS_PER_MINUTE[zoom];

  // Apply filters
  const filteredTrips = useMemo(() => {
    let result = tripsData;
    if (filters.vertiport) {
      result = result.filter(
        (t) =>
          t.origin === filters.vertiport ||
          t.destination === filters.vertiport
      );
    }
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.evtolId) {
      result = result.filter((t) => t.evtolId === filters.evtolId);
    }
    if (filters.timeStart) {
      const ts = dayjs(`${dayjs().format("YYYY-MM-DD")}T${filters.timeStart}`);
      result = result.filter(
        (t) =>
          dayjs(t.scheduledStart).isAfter(ts) ||
          dayjs(t.scheduledStart).isSame(ts)
      );
    }
    if (filters.timeEnd) {
      const te = dayjs(`${dayjs().format("YYYY-MM-DD")}T${filters.timeEnd}`);
      result = result.filter(
        (t) =>
          dayjs(t.scheduledEnd).isBefore(te) ||
          dayjs(t.scheduledEnd).isSame(te)
      );
    }
    return result;
  }, [tripsData, filters]);

  // Aircraft mode rows
  const filteredEvtols = useMemo(() => {
    if (filters.evtolId) {
      return evtolsData.filter((ev) => ev.id === filters.evtolId);
    }
    const evtolIds = new Set(filteredTrips.map((t) => t.evtolId));
    if (
      !filters.vertiport &&
      !filters.status &&
      !filters.timeStart &&
      !filters.timeEnd
    ) {
      return evtolsData;
    }
    return evtolsData.filter((ev) => evtolIds.has(ev.id));
  }, [evtolsData, filteredTrips, filters]);

  // Vertiport mode rows
  const filteredVertiports = useMemo(() => {
    if (filters.vertiport) {
      return sourceVertiports.filter((vp) => vp.id === filters.vertiport);
    }
    return sourceVertiports;
  }, [sourceVertiports, filters.vertiport]);

  // Build pad events for vertiport mode
  const padEvents = useMemo<PadEvent[]>(() => {
    if (mode !== "vertiport") return [];
    const events: PadEvent[] = [];
    for (const trip of filteredTrips) {
      const isLate =
        trip.status === "DELAYED" ||
        trip.status === "ISSUE" ||
        trip.delayMinutes > 0;

      events.push({
        id: `${trip.id}-DEP`,
        trip,
        vertiportId: trip.origin,
        kind: "DEP",
        scheduledAt: trip.scheduledStart,
        actualAt: trip.actualStart,
        onTime: !isLate,
        delayMinutes: trip.delayMinutes,
      });
      events.push({
        id: `${trip.id}-ARR`,
        trip,
        vertiportId: trip.destination,
        kind: "ARR",
        scheduledAt: trip.scheduledEnd,
        actualAt: trip.actualEnd,
        onTime: !isLate,
        delayMinutes: trip.delayMinutes,
      });
    }
    return events;
  }, [filteredTrips, mode]);

  // Per-vertiport counts for sidebar
  const vertiportCounts = useMemo(() => {
    const map: Record<string, { dep: number; arr: number; late: number }> = {};
    for (const ev of padEvents) {
      const c = map[ev.vertiportId] ?? { dep: 0, arr: 0, late: 0 };
      if (ev.kind === "DEP") c.dep += 1;
      else c.arr += 1;
      if (!ev.onTime) c.late += 1;
      map[ev.vertiportId] = c;
    }
    return map;
  }, [padEvents]);

  // Handlers
  const handlePuckClick = useCallback((trip: Trip) => {
    setPanelTrip(trip);
    setShowPanel(true);
  }, []);

  const handleResolve = useCallback((tripId: string) => {
    setTripsData((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? { ...t, status: "ON_TIME" as const, delayMinutes: 0, issues: [] }
          : t
      )
    );
    setShowPanel(false);
  }, []);

  const handleOpenReassign = useCallback((trip: Trip) => {
    setReassignTrip(trip);
    setShowReassign(true);
  }, []);

  const handleConfirmReassign = useCallback(
    (tripId: string, newEvtolId: string) => {
      setTripsData((prev) =>
        prev.map((t) => (t.id === tripId ? { ...t, evtolId: newEvtolId } : t))
      );
      setPanelTrip((prev) =>
        prev && prev.id === tripId ? { ...prev, evtolId: newEvtolId } : prev
      );
    },
    []
  );

  // Stats
  const stats = useMemo(() => {
    const total = tripsData.length;
    const issues = tripsData.filter((t) => t.status === "ISSUE").length;
    const delayed = tripsData.filter((t) => t.status === "DELAYED").length;
    const inProgress = tripsData.filter((t) => t.status === "IN_PROGRESS")
      .length;
    return { total, issues, delayed, inProgress };
  }, [tripsData]);

  // Rows passed to the grid (id is enough for layout)
  const gridRows = useMemo(
    () =>
      mode === "aircraft"
        ? filteredEvtols.map((ev) => ({ id: ev.id }))
        : filteredVertiports.map((vp) => ({ id: vp.id })),
    [mode, filteredEvtols, filteredVertiports]
  );

  return (
    <div className="gantt-dashboard">
      {/* Toolbar */}
      <div className="gantt-toolbar">
        <div className="gantt-toolbar__stats">
          {title && (
            <span className="gantt-toolbar__title">{title}</span>
          )}
          <Badge
            bg="light"
            text="dark"
            className="gantt-status-badge"
            style={{ fontSize: "0.68rem" }}
          >
            {stats.total} Flights
          </Badge>
          <Badge bg="primary" className="gantt-status-badge">
            {stats.inProgress} Active
          </Badge>
          <Badge bg="warning" text="dark" className="gantt-status-badge">
            {stats.delayed} Delayed
          </Badge>
          <Badge bg="danger" className="gantt-status-badge">
            {stats.issues} Issues
          </Badge>
        </div>

        <div className="gantt-toolbar__controls">
          <FilterPanel
            filters={filters}
            vertiports={sourceVertiports.map((vp) => vp.id)}
            evtols={evtolsData}
            onChange={setFilters}
          />
          <ZoomControls zoom={zoom} onChange={setZoom} />
          <div className="gantt-toolbar__clock">{now.format("HH:mm:ss")}</div>
        </div>
      </div>

      {/* Body */}
      <div className="gantt-body">
        {mode === "aircraft" ? (
          <EvtolSidebar
            evtols={filteredEvtols}
            selectedId={selectedRow}
            onSelect={setSelectedRow}
          />
        ) : (
          <VertiportSidebar
            vertiports={filteredVertiports}
            selectedId={selectedRow}
            onSelect={setSelectedRow}
            countsById={vertiportCounts}
          />
        )}

        <div className="gantt-timeline">
          <TimelineHeader
            timeStart={timeStart}
            timeEnd={timeEnd}
            zoom={zoom}
            pixelsPerMinute={ppm}
            scrollLeft={scrollLeft}
          />
          <GanttGrid
            mode={mode}
            rows={gridRows}
            trips={filteredTrips}
            padEvents={padEvents}
            timeStart={timeStart}
            timeEnd={timeEnd}
            zoom={zoom}
            pixelsPerMinute={ppm}
            now={now}
            onPuckClick={handlePuckClick}
            onScroll={setScrollLeft}
          />
        </div>
      </div>

      {/* Issue panel */}
      <IssuePanel
        trip={panelTrip}
        show={showPanel}
        onClose={() => setShowPanel(false)}
        onResolve={handleResolve}
        onReassign={handleOpenReassign}
      />

      {/* Reassign modal */}
      <ReassignModal
        show={showReassign}
        trip={reassignTrip}
        evtols={evtolsData}
        onClose={() => setShowReassign(false)}
        onConfirm={handleConfirmReassign}
      />
    </div>
  );
};

export default GanttDashboard;
