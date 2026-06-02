import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable, { type AdminColumn } from "../../components/AdminTable";
import { mockVertihubEnergyRows, type VertihubEnergyRow } from "../../data/adminMockData";

const columns: AdminColumn<VertihubEnergyRow>[] = [
  { key: "hubEnergyId", header: "Energy ID" },
  { key: "vertihubId", header: "Vertihub" },
  { key: "tariffPeriodType", header: "Tariff Period", badge: true },
  { key: "dayOfWeek", header: "Day" },
  { key: "gridCapacityKw", header: "Grid Capacity (kW)" },
  { key: "simultaneousChargeLimit", header: "Sim. Charge Limit" },
  { key: "reservedCapacityKw", header: "Reserved (kW)" },
  { key: "availableCapacityKw", header: "Available (kW)" },
  { key: "tariffRatePerKwh", header: "Rate / kWh", render: (r) => `${r.currencyCode} ${r.tariffRatePerKwh.toFixed(2)}` },
  { key: "demandChargePerKw", header: "Demand / kW", render: (r) => `${r.currencyCode} ${r.demandChargePerKw}` },
  { key: "gridOperator", header: "Grid Operator" },
  { key: "recordStatus", header: "Status", badge: true },
];

export default function VertihubEnergyListPage() {
  return (
    <div>
      <AdminPageHeader
        title="Vertihub Energy"
        subtitle="Energy tariffs, grid capacities, and charging windows per vertihub."
        createLabel="New Tariff"
      />
      <AdminTable<VertihubEnergyRow>
        columns={columns}
        rows={mockVertihubEnergyRows}
        rowKey={(r) => r.hubEnergyId}
        searchPlaceholder="Search tariffs..."
      />
    </div>
  );
}
