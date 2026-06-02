import GanttDashboard from "../../components/gantt/GanttDashboard";
import type { GanttMode } from "../../components/gantt/types";
import "../../styles/dashboard/gantt.scss";

interface Props {
  mode?: GanttMode;
}

const GanttPage = ({ mode = "aircraft" }: Props) => (
  <GanttDashboard
    mode={mode}
    title={mode === "aircraft" ? "Aircraft View" : "Vertiport View"}
  />
);

export default GanttPage;
