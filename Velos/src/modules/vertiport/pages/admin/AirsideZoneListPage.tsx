import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockAirsideZoneRows, type AirsideZoneRow } from "../../data/adminMockData";

const columns: AdminColumn<AirsideZoneRow>[] = [
  { key: "zoneCode", header: "Code" },
  { key: "zoneName", header: "Name" },
  { key: "zoneType", header: "Type", badge: true },
  { key: "elevationFtAmsl", header: "Elev (ft)" },
  { key: "maxHeightAglFt", header: "Max AGL (ft)" },
  { key: "loadRatingKpa", header: "Load (kPa)" },
  { key: "surfaceType", header: "Surface" },
  { key: "drainageClass", header: "Drainage", badge: true },
  { key: "lightingAvailable", header: "Lighting", render: (r) => (r.lightingAvailable ? "Yes" : "No") },
  { key: "restrictedAccess", header: "Restricted", render: (r) => (r.restrictedAccess ? "Yes" : "No") },
  { key: "status", header: "Status", badge: true },
];

export default function AirsideZoneListPage() {
  return (
    <div>
      <AdminPageHeader
        title="Airside Zones"
        subtitle="FATO area, aprons, taxiways, parking, and restricted zones across the airside."
        createLabel="New Zone"
      />
      <AdminTable<AirsideZoneRow>
        columns={columns}
        rows={mockAirsideZoneRows}
        rowKey={(r) => r.airsideZoneId}
        searchPlaceholder="Search airside zones..."
      />
    </div>
  );
}
