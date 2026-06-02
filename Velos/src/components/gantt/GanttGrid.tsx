import React, { useRef, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import TripPuck from "./TripPuck";
import PadPuck from "./PadPuck";
import type { Trip, ZoomLevel, GanttMode, PadEvent } from "./types";

interface Row {
  id: string;
}

interface Props {
  mode: GanttMode;
  rows: Row[];
  trips: Trip[];
  padEvents: PadEvent[];
  timeStart: dayjs.Dayjs;
  timeEnd: dayjs.Dayjs;
  zoom: ZoomLevel;
  pixelsPerMinute: number;
  now: dayjs.Dayjs;
  onPuckClick: (trip: Trip) => void;
  onScroll: (scrollLeft: number) => void;
}

// Default visual width (minutes) for a pad event when there's no actual time
// — gives the puck a meaningful footprint on the timeline.
const PAD_EVENT_VISUAL_MINUTES = 10;

const GanttGrid: React.FC<Props> = React.memo(
  ({
    mode,
    rows,
    trips,
    padEvents,
    timeStart,
    timeEnd,
    zoom,
    pixelsPerMinute,
    now,
    onPuckClick,
    onScroll,
  }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const didCenterRef = useRef(false);

    const totalWidth = timeEnd.diff(timeStart, "minute") * pixelsPerMinute;

    // Vertical grid lines
    const vLines: number[] = [];
    let cursor = timeStart.startOf("hour");
    if (cursor.isAfter(timeStart)) cursor = cursor.subtract(1, "hour");
    while (cursor.isBefore(timeEnd)) {
      const left = cursor.diff(timeStart, "minute") * pixelsPerMinute;
      if (left > 0) vLines.push(left);
      cursor = cursor.add(zoom, "minute");
    }

    // Now line
    const nowLeft = now.diff(timeStart, "minute") * pixelsPerMinute;
    const showNow = nowLeft >= 0 && nowLeft <= totalWidth;

    // Group trips/events by row id
    const tripsByRow = new Map<string, Trip[]>();
    if (mode === "aircraft") {
      for (const t of trips) {
        const arr = tripsByRow.get(t.evtolId) ?? [];
        arr.push(t);
        tripsByRow.set(t.evtolId, arr);
      }
    }

    const eventsByRow = new Map<string, PadEvent[]>();
    if (mode === "vertiport") {
      for (const e of padEvents) {
        const arr = eventsByRow.get(e.vertiportId) ?? [];
        arr.push(e);
        eventsByRow.set(e.vertiportId, arr);
      }
    }

    const handleScroll = useCallback(() => {
      if (scrollRef.current) onScroll(scrollRef.current.scrollLeft);
    }, [onScroll]);

    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.addEventListener("scroll", handleScroll, { passive: true });
      return () => el.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // Sync header scroll
    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      const header = el
        .closest(".gantt-timeline")
        ?.querySelector(".gantt-timeline-header") as HTMLElement | null;
      if (header) {
        const sync = () => {
          header.scrollLeft = el.scrollLeft;
        };
        el.addEventListener("scroll", sync, { passive: true });
        return () => el.removeEventListener("scroll", sync);
      }
    }, []);

    // Center the now-line on first render, and re-center when zoom changes
    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      if (!showNow) return;
      const target = Math.max(0, nowLeft - el.clientWidth / 2);
      el.scrollLeft = target;
      didCenterRef.current = true;
      // Re-run when zoom changes (pixelsPerMinute) so the now-line stays centered
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixelsPerMinute]);

    return (
      <div className="gantt-grid" ref={scrollRef}>
        <div className="gantt-grid__inner" style={{ width: totalWidth }}>
          {/* Vertical grid lines */}
          {vLines.map((l) => (
            <div key={l} className="gantt-grid__vline" style={{ left: l }} />
          ))}

          {/* Now line */}
          {showNow && (
            <div className="gantt-now-line" style={{ left: nowLeft }} />
          )}

          {/* Rows */}
          {rows.map((row) => (
            <div key={row.id} className="gantt-grid__row">
              {mode === "aircraft"
                ? (tripsByRow.get(row.id) ?? []).map((trip) => {
                    const start = dayjs(trip.scheduledStart);
                    const end = dayjs(trip.scheduledEnd);
                    const effectiveEnd =
                      trip.delayMinutes > 0
                        ? end.add(trip.delayMinutes, "minute")
                        : end;

                    const left =
                      start.diff(timeStart, "minute") * pixelsPerMinute;
                    const width =
                      effectiveEnd.diff(start, "minute") * pixelsPerMinute;

                    return (
                      <TripPuck
                        key={trip.id}
                        trip={trip}
                        left={left}
                        width={width}
                        onClick={onPuckClick}
                      />
                    );
                  })
                : (eventsByRow.get(row.id) ?? []).map((ev) => {
                    const sched = dayjs(ev.scheduledAt);
                    const actual = ev.actualAt ? dayjs(ev.actualAt) : null;

                    // Span from scheduled to actual (or default visual width)
                    const startTs =
                      actual && actual.isBefore(sched) ? actual : sched;
                    const endTs =
                      actual && actual.isAfter(sched)
                        ? actual
                        : sched.add(PAD_EVENT_VISUAL_MINUTES, "minute");

                    const left =
                      startTs.diff(timeStart, "minute") * pixelsPerMinute;
                    const width =
                      endTs.diff(startTs, "minute") * pixelsPerMinute;

                    return (
                      <PadPuck
                        key={ev.id}
                        event={ev}
                        left={left}
                        width={width}
                        onClick={onPuckClick}
                      />
                    );
                  })}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

GanttGrid.displayName = "GanttGrid";
export default GanttGrid;
