import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockVertihubRows, type VertihubRow } from "../../data/adminMockData";

const columns: AdminColumn<VertihubRow>[] = [
  { key: "vertihubCode", header: "Code" },
  { key: "vertihubName", header: "Name" },
  { key: "hubType", header: "Type", badge: true },
  { key: "maxParkedAircraft", header: "Max Parked" },
  { key: "hasMaintenance", header: "Maintenance", render: (r) => (r.hasMaintenance ? "Yes" : "No") },
  { key: "hasCharging", header: "Charging", render: (r) => (r.hasCharging ? "Yes" : "No") },
  { key: "chargingPadCount", header: "Charge Pads" },
  { key: "maxChargePowerKw", header: "Max Power (kW)" },
  { key: "hubStatus", header: "Status", badge: true },
];

export default function VertihubListPage() {
  return (
    <div>
      <AdminPageHeader
        title="Vertihubs"
        subtitle="Registered vertihubs including maintenance, charging, and parking hubs."
        createLabel="New Vertihub"
      />
      <AdminTable<VertihubRow>
        columns={columns}
        rows={mockVertihubRows}
        rowKey={(r) => r.vertihubId}
        searchPlaceholder="Search vertihubs..."
      />
    </div>
  );
}
