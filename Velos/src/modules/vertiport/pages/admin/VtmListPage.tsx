import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockVtmRows, type VtmRow } from "../../data/adminMockData";

const columns: AdminColumn<VtmRow>[] = [
  { key: "techSystemId", header: "Tech System ID" },
  { key: "vtmSystemRegistryId", header: "Registry ID" },
  { key: "integrationStatus", header: "Status", badge: true },
  { key: "trafficScope", header: "Traffic Scope", badge: true },
  { key: "integrationPriority", header: "Priority" },
  { key: "isFallback", header: "Fallback", render: (r) => (r.isFallback ? "Yes" : "No") },
  { key: "regulatoryAuthority", header: "Authority", badge: true },
  { key: "complianceStatus", header: "Compliance", badge: true },
  { key: "observedErrorRatePct", header: "Error %", render: (r) => `${r.observedErrorRatePct.toFixed(2)}%` },
  { key: "slaBreached", header: "SLA", render: (r) => (r.slaBreached ? "Breached" : "OK") },
  { key: "updatedAt", header: "Updated", render: (r) => new Date(r.updatedAt).toLocaleDateString() },
];

export default function VtmListPage() {
  return (
    <div>
      <AdminPageHeader
        title="VTM Integrations"
        subtitle="Vertiport Traffic Management system integrations, scope, and compliance."
        createLabel="New VTM"
      />
      <AdminTable<VtmRow>
        columns={columns}
        rows={mockVtmRows}
        rowKey={(r) => r.techSystemId}
        searchPlaceholder="Search VTM systems..."
      />
    </div>
  );
}
