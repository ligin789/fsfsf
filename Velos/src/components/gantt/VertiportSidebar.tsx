import React from "react";
import type { Vertiport } from "./types";

interface Props {
  vertiports: Vertiport[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  countsById?: Record<string, { dep: number; arr: number; late: number }>;
}

const VertiportSidebar: React.FC<Props> = React.memo(
  ({ vertiports, selectedId, onSelect, countsById }) => (
    <div className="gantt-sidebar">
      <div className="gantt-sidebar__header">Vertiports</div>
      <div className="gantt-sidebar__list">
        {vertiports.map((vp) => {
          const c = countsById?.[vp.id];
          return (
            <div
              key={vp.id}
              className={`gantt-sidebar__item${
                selectedId === vp.id ? " gantt-sidebar__item--active" : ""
              }`}
              onClick={() => onSelect(vp.id)}
            >
              <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                <div className="d-flex align-items-center gap-2">
                  <span className="gantt-sidebar__evtol-id">
                    {vp.id.replace("VPT-", "")}
                  </span>
                  {vp.pads && (
                    <span className="badge bg-secondary gantt-status-badge">
                      {vp.pads} pads
                    </span>
                  )}
                </div>
                <span className="gantt-sidebar__evtol-model">
                  {vp.name ?? vp.id}
                </span>
                {c && (
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span
                      className="gantt-sidebar__battery"
                      style={{ color: "#10B981" }}
                    >
                      ↑ {c.dep}
                    </span>
                    <span
                      className="gantt-sidebar__battery"
                      style={{ color: "#3B82F6" }}
                    >
                      ↓ {c.arr}
                    </span>
                    {c.late > 0 && (
                      <span
                        className="gantt-sidebar__battery"
                        style={{ color: "#F59E0B" }}
                      >
                        late {c.late}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
);

VertiportSidebar.displayName = "VertiportSidebar";
export default VertiportSidebar;
