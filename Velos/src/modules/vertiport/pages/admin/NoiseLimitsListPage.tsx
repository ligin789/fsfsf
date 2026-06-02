import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockNoiseLimitsRows, type NoiseLimitsRow } from "../../data/adminMockData";

const columns: AdminColumn<NoiseLimitsRow>[] = [
  { key: "noiseLimitsId", header: "ID" },
  { key: "daytimeDbLimit", header: "Day dB Limit" },
  { key: "daytimeDbRange", header: "Day ± dB" },
  { key: "nighttimeDbLimit", header: "Night dB Limit" },
  { key: "nighttimeDbRange", header: "Night ± dB" },
  { key: "daytimeStart", header: "Day Starts" },
  { key: "nighttimeStart", header: "Night Starts" },
  { key: "isNoiseMonitoring", header: "Monitoring", render: (r) => (r.isNoiseMonitoring ? "Yes" : "No") },
  { key: "updatedAt", header: "Updated", render: (r) => new Date(r.updatedAt).toLocaleDateString() },
];

export default function NoiseLimitsListPage() {
  return (
    <div>
      <AdminPageHeader
        title="Noise Limits"
        subtitle="Day and night noise limits, sensitive windows, and monitoring coverage."
        createLabel="New Noise Rule"
      />
      <AdminTable<NoiseLimitsRow>
        columns={columns}
        rows={mockNoiseLimitsRows}
        rowKey={(r) => r.noiseLimitsId}
        searchPlaceholder="Search noise rules..."
      />
    </div>
  );
}
