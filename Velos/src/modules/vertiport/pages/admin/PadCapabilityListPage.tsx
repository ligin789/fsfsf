import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockPadCapabilityRows, type PadCapabilityRow } from "../../data/adminMockData";

const columns: AdminColumn<PadCapabilityRow>[] = [
  { key: "capabilityId", header: "Capability ID" },
  { key: "padId", header: "Pad" },
  { key: "aircraftTypeCode", header: "Aircraft Type" },
  { key: "isCompatible", header: "Compatible", render: (r) => (r.isCompatible ? "Yes" : "No") },
  { key: "maxMtowKg", header: "Max MTOW (kg)" },
  { key: "opsCategory", header: "Ops", badge: true },
  { key: "nightOpsCapable", header: "Night", render: (r) => (r.nightOpsCapable ? "Yes" : "No") },
  { key: "autonomousOpsCapable", header: "Autonomous", render: (r) => (r.autonomousOpsCapable ? "Yes" : "No") },
  { key: "canCharge", header: "Charges", render: (r) => (r.canCharge ? "Yes" : "No") },
  { key: "chargingStandard", header: "Charge Std" },
  { key: "maxChargeRateKw", header: "Charge Rate (kW)" },
  { key: "minTurnaroundMin", header: "Min Turn (min)" },
  { key: "status", header: "Status", badge: true },
];

export default function PadCapabilityListPage() {
  return (
    <div>
      <AdminPageHeader
        title="Pad Capabilities"
        subtitle="Which aircraft types are approved on each pad, under what operating conditions."
        createLabel="New Capability"
      />
      <AdminTable<PadCapabilityRow>
        columns={columns}
        rows={mockPadCapabilityRows}
        rowKey={(r) => r.capabilityId}
        searchPlaceholder="Search capabilities..."
      />
    </div>
  );
}
