import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockContactRows, type ContactRow } from "../../data/adminMockData";

const columns: AdminColumn<ContactRow>[] = [
  { key: "name", header: "Name", render: (r) => `${r.contactNameTitle} ${r.contactFirstName} ${r.contactSurname}` },
  { key: "contactGroupType", header: "Group", badge: true },
  { key: "contactGroupRole", header: "Role", badge: true },
  { key: "contactTypeCode", header: "Phone Type", badge: true },
  { key: "dialFormattedNumber", header: "Phone" },
  { key: "contactEmailAddress", header: "Email" },
  { key: "updatedAt", header: "Updated", render: (r) => new Date(r.updatedAt).toLocaleDateString() },
];

export default function ContactListPage() {
  return (
    <div>
      <AdminPageHeader
        title="Contacts"
        subtitle="Accountable managers, operations, safety, regulatory, and emergency contacts."
        createLabel="New Contact"
      />
      <AdminTable<ContactRow>
        columns={columns}
        rows={mockContactRows}
        rowKey={(r) => r.contactId}
        searchPlaceholder="Search contacts..."
      />
    </div>
  );
}
