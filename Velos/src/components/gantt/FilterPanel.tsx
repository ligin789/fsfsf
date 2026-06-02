import React from "react";
import { Form } from "react-bootstrap";
import type { FilterState, TripStatus, Evtol } from "./types";

interface Props {
  filters: FilterState;
  vertiports: string[];
  evtols: Evtol[];
  onChange: (f: FilterState) => void;
}

const statuses: { value: TripStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "ON_TIME", label: "On Time" },
  { value: "DELAYED", label: "Delayed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ISSUE", label: "Issue" },
];

const FilterPanel: React.FC<Props> = React.memo(
  ({ filters, vertiports, evtols, onChange }) => {
    const set = (key: keyof FilterState, value: string) =>
      onChange({ ...filters, [key]: value });

    return (
      <div className="gantt-filters d-flex align-items-end gap-2 flex-wrap">
        <div>
          <Form.Label>Vertiport</Form.Label>
          <Form.Select
            value={filters.vertiport}
            onChange={(e) => set("vertiport", e.target.value)}
          >
            <option value="">All Vertiports</option>
            {vertiports.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Form.Select>
        </div>

        <div>
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={filters.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Form.Select>
        </div>

        <div>
          <Form.Label>Aircraft</Form.Label>
          <Form.Select
            value={filters.evtolId}
            onChange={(e) => set("evtolId", e.target.value)}
          >
            <option value="">All Aircraft</option>
            {evtols.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.id}
              </option>
            ))}
          </Form.Select>
        </div>

        <div>
          <Form.Label>From</Form.Label>
          <Form.Control
            type="time"
            value={filters.timeStart}
            onChange={(e) => set("timeStart", e.target.value)}
          />
        </div>

        <div>
          <Form.Label>To</Form.Label>
          <Form.Control
            type="time"
            value={filters.timeEnd}
            onChange={(e) => set("timeEnd", e.target.value)}
          />
        </div>
      </div>
    );
  }
);

FilterPanel.displayName = "FilterPanel";
export default FilterPanel;
