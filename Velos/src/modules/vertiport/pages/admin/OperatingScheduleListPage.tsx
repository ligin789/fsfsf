import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockOperatingScheduleRows, type OperatingScheduleRow } from "../../data/adminMockData";

const columns: AdminColumn<OperatingScheduleRow>[] = [
  { key: "scheduleName", header: "Schedule" },
  { key: "scheduleType", header: "Type", badge: true },
  { key: "effectiveFrom", header: "From" },
  { key: "effectiveUntil", header: "Until" },
  { key: "openTimeLocal", header: "Open" },
  { key: "closeTimeLocal", header: "Close" },
  { key: "is24hr", header: "24hr", render: (r) => (r.is24hr ? "Yes" : "No") },
  { key: "opsCategory", header: "Ops", badge: true },
  { key: "maxMovementsPerHour", header: "Max Mvmts / hr" },
  { key: "maxPaxPerHour", header: "Max Pax / hr" },
  { key: "nightOpsPermitted", header: "Night", render: (r) => (r.nightOpsPermitted ? "Yes" : "No") },
  { key: "appliesTo", header: "Applies To", badge: true },
];

export default function OperatingScheduleListPage() {
  return (
    <div>
      <AdminPageHeader
        title="Operating Schedules"
        subtitle="Standard, seasonal, event, and emergency operating windows for the vertiport."
        createLabel="New Schedule"
      />
      <AdminTable<OperatingScheduleRow>
        columns={columns}
        rows={mockOperatingScheduleRows}
        rowKey={(r) => r.scheduleId}
        searchPlaceholder="Search schedules..."
      />
    </div>
  );
}
