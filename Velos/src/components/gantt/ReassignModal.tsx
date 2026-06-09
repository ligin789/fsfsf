import React, { useState } from "react";
import { Modal, Button, ListGroup, Badge } from "react-bootstrap";
import type { Evtol, Trip } from "./types";

interface Props {
  show: boolean;
  trip: Trip | null;
  evtols: Evtol[];
  onClose: () => void;
  onConfirm: (tripId: string, newEvtolId: string) => void;
}

const batteryColor = (level: number) => {
  if (level >= 60) return "success";
  if (level >= 30) return "warning";
  return "danger";
};

const ReassignModal: React.FC<Props> = ({
  show,
  trip,
  evtols,
  onClose,
  onConfirm,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const available = evtols.filter(
    (ev) => ev.availability && ev.id !== trip?.evtolId
  );

  const handleConfirm = () => {
    if (selected && trip) {
      onConfirm(trip.id, selected);
      setSelected(null);
      onClose();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="gantt-modal"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Reassign Aircraft{" "}
          {trip && (
            <span style={{ fontSize: "0.8rem", color: "var(--app-text-faint)" }}>
              — {trip.id}
            </span>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {available.length === 0 ? (
          <p className="text-center" style={{ color: "var(--app-text-faint)" }}>
            No available aircraft for reassignment.
          </p>
        ) : (
          <ListGroup>
            {available.map((ev) => (
              <ListGroup.Item
                key={ev.id}
                active={selected === ev.id}
                onClick={() => setSelected(ev.id)}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{ev.id}</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                    {ev.model} — {ev.location}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg={batteryColor(ev.batteryLevel)}>
                    {ev.batteryLevel}%
                  </Badge>
                  <Badge bg={ev.status === "Active" ? "success" : "info"}>
                    {ev.status}
                  </Badge>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!selected}
          onClick={handleConfirm}
        >
          Confirm Reassignment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReassignModal;
