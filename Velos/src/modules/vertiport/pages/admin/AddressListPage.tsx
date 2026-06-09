import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockAddressRows, type AddressRow } from "../../data/adminMockData";

const columns: AdminColumn<AddressRow>[] = [
  { key: "adrgroupcode", header: "Group", badge: true },
  { key: "adrTypeCode", header: "Type", badge: true },
  { key: "adrFirstLine", header: "Line 1" },
  { key: "adrSecondLine", header: "Line 2" },
  { key: "adrStreetName", header: "Street" },
  { key: "adrCityName", header: "City" },
  { key: "adrState", header: "State" },
  { key: "adrPostalCode", header: "Postal" },
  { key: "adrCountry", header: "Country" },
];

export default function AddressListPage() {
  return (
    <div>
      <AdminPageHeader
        title="Addresses"
        subtitle="Head-quarters, command centre, and emergency-response physical addresses."
        createLabel="New Address"
      />
      <AdminTable<AddressRow>
        columns={columns}
        rows={mockAddressRows}
        rowKey={(r) => r.addressId}
        searchPlaceholder="Search addresses..."
      />
    </div>
  );
}
