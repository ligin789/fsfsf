import React from "react";
import { Offcanvas, Badge, Button } from "react-bootstrap";
import dayjs from "dayjs";
import type { Trip } from "./types";

interface Props {
  trip: Trip | null;
  show: boolean;
  onClose: () => void;
  onResolve: (tripId: string) => void;
  onReassign: (trip: Trip) => void;
}

const fmt = (iso?: string) =>
  iso ? dayjs(iso).format("HH:mm:ss") : "--:--:--";

const statusBadge: Record<string, string> = {
  ON_TIME: "success",
  DELAYED: "warning",
  ISSUE: "danger",
  IN_PROGRESS: "primary",
  COMPLETED: "secondary",
};

const IssuePanel: React.FC<Props> = ({
  trip,
  show,
  onClose,
  onResolve,
  onReassign,
}) => {
  if (!trip) return null;

  return (
    <Offcanvas
      show={show}
      onHide={onClose}
      placement="end"
      className="gantt-offcanvas"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Trip Details</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="gantt-detail">
          <div className="gantt-detail__row">
            <span className="gantt-detail__label">Trip ID</span>
            <span className="gantt-detail__value">{trip.id}</span>
          </div>
          <div className="gantt-detail__row">
            <span className="gantt-detail__label">Flight</span>
            <span className="gantt-detail__value">{trip.tripNumber}</span>
          </div>
          <div className="gantt-detail__row">
            <span className="gantt-detail__label">Aircraft</span>
            <span className="gantt-detail__value">{trip.evtolId}</span>
          </div>
          <div className="gantt-detail__row">
            <span className="gantt-detail__label">Origin</span>
            <span className="gantt-detail__value">{trip.origin}</span>
          </div>
          <div className="gantt-detail__row">
            <span className="gantt-detail__label">Destination</span>
            <span className="gantt-detail__value">{trip.destination}</span>
          </div>
          <div className="gantt-detail__row">
            <span className="gantt-detail__label">Scheduled Start</span>
            <span className="gantt-detail__value">
              {fmt(trip.scheduledStart)}
            </span>
          </div>
          <div className="gantt-detail__row">
            <span className="gantt-detail__label">Scheduled End</span>
            <span className="gantt-detail__value">
              {fmt(trip.scheduledEnd)}
            </span>
          </div>
          <div className="gantt-detail__row">
            <span className="gantt-detail__label">Actual Start</span>
            <span className="gantt-detail__value">
              {fmt(trip.actualStart)}
            </span>
          </div>
          <div className="gantt-detail__row">
            <span className="gantt-detail__label">Actual End</span>
            <span className="gantt-detail__value">{fmt(trip.actualEnd)}</span>
          </div>
          <div className="gantt-detail__row">
            <span className="gantt-detail__label">Delay</span>
            <span className="gantt-detail__value">
              {trip.delayMinutes > 0 ? `${trip.delayMinutes} min` : "None"}
            </span>
          </div>
          <div className="gantt-detail__row">
            <span className="gantt-detail__label">Status</span>
            <span className="gantt-detail__value">
              <Badge bg={statusBadge[trip.status] ?? "secondary"}>
                {trip.status.replace("_", " ")}
              </Badge>
            </span>
          </div>
        </div>

        {/* Issue logs */}
        {trip.issues && trip.issues.length > 0 && (
          <div className="mt-3">
            <h6 style={{ color: "#EF4444", fontWeight: 700, fontSize: "0.8rem" }}>
              Issue Logs
            </h6>
            {trip.issues.map((issue, i) => (
              <div
                key={i}
                className="d-flex align-items-center gap-2 mb-2 p-2 rounded"
                style={{ background: "rgba(239,68,68,0.08)", fontSize: "0.78rem" }}
              >
                <span style={{ color: "#EF4444" }}>&#9888;</span>
                <span>{issue}</span>
              </div>
            ))}
          </div>
        )}

        <div className="d-grid gap-2 mt-4">
          {trip.status === "ISSUE" && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onResolve(trip.id)}
            >
              Resolve Issue
            </Button>
          )}
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => onReassign(trip)}
          >
            Change eVTOL
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default IssuePanel;
