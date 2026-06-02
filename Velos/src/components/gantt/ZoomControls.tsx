import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import type { ZoomLevel } from "./types";

interface Props {
  zoom: ZoomLevel;
  onChange: (z: ZoomLevel) => void;
}

const levels: { value: ZoomLevel; label: string }[] = [
  { value: 15, label: "15m" },
  { value: 30, label: "30m" },
  { value: 60, label: "1h" },
  { value: 120, label: "2h" },
];

const ZoomControls: React.FC<Props> = React.memo(({ zoom, onChange }) => (
  <ButtonGroup className="gantt-zoom">
    {levels.map((l) => (
      <Button
        key={l.value}
        size="sm"
        variant="outline-secondary"
        className={zoom === l.value ? "active" : ""}
        onClick={() => onChange(l.value)}
      >
        {l.label}
      </Button>
    ))}
  </ButtonGroup>
));

ZoomControls.displayName = "ZoomControls";
export default ZoomControls;
