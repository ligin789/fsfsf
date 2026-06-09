import React, { useRef, useState, useCallback } from "react";
import { Overlay, Tooltip } from "react-bootstrap";
import dayjs from "dayjs";
import type { PadEvent, Trip } from "./types";

interface Props {
  event: PadEvent;
  left: number;
  width: number;
  onClick: (trip: Trip) => void;
}

const fmt = (iso?: string) => (iso ? dayjs(iso).format("HH:mm") : "--:--");

const PadPuck: React.FC<Props> = React.memo(({ event, left, width, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  const handleClick = useCallback(() => onClick(event.trip), [event.trip, onClick]);

  const statusMod = event.onTime ? "on-time" : "delayed";
  const kindMod = event.kind === "DEP" ? "dep" : "arr";

  const arrow = event.kind === "DEP" ? "↑" : "↓";
  const otherEnd =
    event.kind === "DEP" ? event.trip.destination : event.trip.origin;

  return (
    <>
      <div
        ref={ref}
        className={`gantt-puck gantt-puck--${statusMod} gantt-puck--${kindMod}`}
        style={{ left, width: Math.max(width, 44) }}
        onClick={handleClick}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <span className="gantt-puck__label">
          {arrow} {event.trip.evtolId.replace("EVTOL-", "")}
        </span>
        <span className="gantt-puck__route">
          {otherEnd.replace("VPT-", "")}
        </span>
        {!event.onTime && <span className="gantt-puck__issue-icon">⚠</span>}
      </div>

      <Overlay target={ref.current} show={show} placement="top">
        {(props) => (
          <Tooltip {...props} className="gantt-tooltip">
            <div>
              <strong>
                {event.kind === "DEP" ? "Departure" : "Arrival"}
              </strong>{" "}
              — {event.trip.evtolId}
            </div>
            <div>Trip: {event.trip.tripNumber}</div>
            <div>
              Sched: {fmt(event.scheduledAt)} | Actual: {fmt(event.actualAt)}
            </div>
            {event.delayMinutes > 0 && (
              <div style={{ color: "#F59E0B" }}>
                Delay: {event.delayMinutes} min
              </div>
            )}
            <div>{event.onTime ? "On time" : "Late"}</div>
            <div>
              {event.trip.origin.replace("VPT-", "")} →{" "}
              {event.trip.destination.replace("VPT-", "")}
            </div>
          </Tooltip>
        )}
      </Overlay>
    </>
  );
});

PadPuck.displayName = "PadPuck";
export default PadPuck;
