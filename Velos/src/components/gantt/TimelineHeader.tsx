import React from "react";
import dayjs from "dayjs";
import type { ZoomLevel } from "./types";

interface Props {
  timeStart: dayjs.Dayjs;
  timeEnd: dayjs.Dayjs;
  zoom: ZoomLevel;
  pixelsPerMinute: number;
  scrollLeft: number;
}

const TimelineHeader: React.FC<Props> = React.memo(
  ({ timeStart, timeEnd, zoom, pixelsPerMinute }) => {
    const slots: { label: string; left: number; width: number }[] = [];
    let cursor = timeStart.startOf("hour");

    if (cursor.isAfter(timeStart)) {
      cursor = cursor.subtract(1, "hour");
    }

    while (cursor.isBefore(timeEnd)) {
      const next = cursor.add(zoom, "minute");
      const left = cursor.diff(timeStart, "minute") * pixelsPerMinute;
      const width = zoom * pixelsPerMinute;
      slots.push({
        label: cursor.format("HH:mm"),
        left,
        width,
      });
      cursor = next;
    }

    const totalWidth =
      timeEnd.diff(timeStart, "minute") * pixelsPerMinute;

    return (
      <div className="gantt-timeline-header">
        <div
          className="gantt-timeline-header__inner"
          style={{ width: totalWidth }}
        >
          {slots.map((s) => (
            <div
              key={s.label + s.left}
              className="gantt-timeline-header__cell"
              style={{ width: s.width, minWidth: s.width }}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

TimelineHeader.displayName = "TimelineHeader";
export default TimelineHeader;
