import React from "react";
import type { Evtol } from "./types";

interface Props {
  evtols: Evtol[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusColor: Record<string, string> = {
  Active: "success",
  Standby: "info",
  Maintenance: "warning",
  Charging: "primary",
};

const batteryColor = (level: number) => {
  if (level >= 60) return "#10B981";
  if (level >= 30) return "#F59E0B";
  return "#EF4444";
};

const EvtolSidebar: React.FC<Props> = React.memo(
  ({ evtols, selectedId, onSelect }) => (
    <div className="gantt-sidebar">
      <div className="gantt-sidebar__header">Aircraft Fleet</div>
      <div className="gantt-sidebar__list">
        {evtols.map((ev) => (
          <div
            key={ev.id}
            className={`gantt-sidebar__item${
              selectedId === ev.id ? " gantt-sidebar__item--active" : ""
            }`}
            onClick={() => onSelect(ev.id)}
          >
            <div className="d-flex flex-column flex-grow-1 overflow-hidden">
              <div className="d-flex align-items-center gap-2">
                <span className="gantt-sidebar__evtol-id">{ev.id}</span>
                <span
                  className={`badge bg-${
                    statusColor[ev.status] ?? "secondary"
                  } gantt-status-badge`}
                >
                  {ev.status}
                </span>
              </div>
              <span className="gantt-sidebar__evtol-model">{ev.model}</span>
              <div className="d-flex align-items-center gap-1 mt-1">
                <div
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    background: "#E2E8F0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${ev.batteryLevel}%`,
                      height: "100%",
                      background: batteryColor(ev.batteryLevel),
                      borderRadius: 2,
                    }}
                  />
                </div>
                <span
                  className="gantt-sidebar__battery"
                  style={{ color: batteryColor(ev.batteryLevel) }}
                >
                  {ev.batteryLevel}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
);

EvtolSidebar.displayName = "EvtolSidebar";
export default EvtolSidebar;
