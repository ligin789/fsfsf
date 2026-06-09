import React, { useRef, useState, useCallback } from "react";
import { Overlay, Tooltip } from "react-bootstrap";
import dayjs from "dayjs";
import type { Trip } from "./types";

interface Props {
  trip: Trip;
  left: number;
  width: number;
  onClick: (trip: Trip) => void;
}

const statusClass: Record<string, string> = {
  ON_TIME: "on-time",
  DELAYED: "delayed",
  ISSUE: "issue",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

const fmt = (iso?: string) => (iso ? dayjs(iso).format("HH:mm") : "--:--");

const TripPuck: React.FC<Props> = React.memo(({ trip, left, width, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  const handleClick = useCallback(() => onClick(trip), [trip, onClick]);

  return (
    <>
      <div
        ref={ref}
        className={`gantt-puck gantt-puck--${statusClass[trip.status] ?? "on-time"}`}
        style={{ left, width: Math.max(width, 36) }}
        onClick={handleClick}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <span className="gantt-puck__label">{trip.tripNumber}</span>
        <span className="gantt-puck__route">
          {trip.origin.replace("VPT-", "")} → {trip.destination.replace("VPT-", "")}
        </span>
        {trip.status === "ISSUE" && (
          <span className="gantt-puck__issue-icon">⚠</span>
        )}
      </div>

      <Overlay target={ref.current} show={show} placement="top">
        {(props) => (
          <Tooltip {...props} className="gantt-tooltip">
            <div>
              <strong>{trip.id}</strong> — {trip.tripNumber}
            </div>
            <div>
              Sched: {fmt(trip.scheduledStart)} → {fmt(trip.scheduledEnd)}
            </div>
            <div>
              Actual: {fmt(trip.actualStart)} → {fmt(trip.actualEnd)}
            </div>
            {trip.delayMinutes > 0 && (
              <div style={{ color: "#F59E0B" }}>
                Delay: {trip.delayMinutes} min
              </div>
            )}
            <div>Status: {trip.status.replace("_", " ")}</div>
            <div>Aircraft: {trip.evtolId}</div>
          </Tooltip>
        )}
      </Overlay>
    </>
  );
});

TripPuck.displayName = "TripPuck";
export default TripPuck;
