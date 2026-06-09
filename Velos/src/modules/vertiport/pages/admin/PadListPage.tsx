import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockPadRows, type PadRow } from "../../data/adminMockData";

const columns: AdminColumn<PadRow>[] = [
  { key: "padCode", header: "Code" },
  { key: "padName", header: "Name" },
  { key: "padType", header: "Type", badge: true },
  { key: "padFunction", header: "Function", badge: true },
  { key: "centroidLat", header: "Lat" },
  { key: "centroidLon", header: "Lon" },
  { key: "elevationFtAmsl", header: "Elev (ft)" },
  { key: "loadRatingMtowKg", header: "Load (kg)" },
  { key: "surfaceType", header: "Surface" },
  { key: "hasLighting", header: "Lighting", render: (r) => (r.hasLighting ? "Yes" : "No") },
  { key: "vtmLiveStatus", header: "VTM Live", badge: true },
  { key: "isEmergencyPad", header: "Emergency", render: (r) => (r.isEmergencyPad ? "Yes" : "No") },
  { key: "status", header: "Status", badge: true },
];

export default function PadListPage() {
  return (
    <div>
      <AdminPageHeader
        title="Pads"
        subtitle="FATO, parking, charging, maintenance, and emergency pads at this vertiport."
        createLabel="New Pad"
      />
      <AdminTable<PadRow>
        columns={columns}
        rows={mockPadRows}
        rowKey={(r) => r.padId}
        searchPlaceholder="Search pads..."
      />
    </div>
  );
}
