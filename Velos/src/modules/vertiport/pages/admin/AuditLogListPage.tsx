import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockAuditLogRows, type AuditLogRow } from "../../data/adminMockData";

const columns: AdminColumn<AuditLogRow>[] = [
  { key: "changedAt", header: "When", render: (r) => new Date(r.changedAt).toLocaleString() },
  { key: "actionTypeCode", header: "Action", badge: true },
  { key: "tableName", header: "Table", badge: true },
  { key: "actionPerformed", header: "Description" },
  { key: "userName", header: "User" },
  { key: "changedBy", header: "Account" },
  { key: "ipAddress", header: "IP" },
];

export default function AuditLogListPage() {
  return (
    <div>
      <AdminPageHeader
        title="Audit Logs"
        subtitle="Immutable history of inserts, updates, and deletes across the vertiport's records."
        showFilter
        showExport
      />
      <AdminTable<AuditLogRow>
        columns={columns}
        rows={mockAuditLogRows}
        rowKey={(r) => r.auditId}
        searchPlaceholder="Search audit trail..."
      />
    </div>
  );
}
