import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockTerminalRows, type TerminalRow } from "../../data/adminMockData";

const columns: AdminColumn<TerminalRow>[] = [
  { key: "terminalCode", header: "Code" },
  { key: "terminalName", header: "Name" },
  { key: "terminalType", header: "Type", badge: true },
  { key: "floorCount", header: "Floors" },
  { key: "totalAreaSqm", header: "Area (sqm)" },
  { key: "paxCapacityPeak", header: "Pax Peak" },
  { key: "paxThroughputPerHour", header: "Pax / hr" },
  { key: "gateCount", header: "Gates" },
  { key: "accessibilityCompliant", header: "Accessible", render: (r) => (r.accessibilityCompliant ? "Yes" : "No") },
  { key: "hasBaggageHandling", header: "Baggage", render: (r) => (r.hasBaggageHandling ? "Yes" : "No") },
  { key: "hasLounge", header: "Lounge", render: (r) => (r.hasLounge ? "Yes" : "No") },
  { key: "status", header: "Status", badge: true },
];

export default function TerminalListPage() {
  return (
    <div>
      <AdminPageHeader
        title="Terminals"
        subtitle="Passenger terminals, cargo facilities, and dedicated wings at this vertiport."
        createLabel="New Terminal"
      />
      <AdminTable<TerminalRow>
        columns={columns}
        rows={mockTerminalRows}
        rowKey={(r) => r.terminalId}
        searchPlaceholder="Search terminals..."
      />
    </div>
  );
}
