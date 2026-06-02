import { motion } from "framer-motion";
import { HiOutlineSearch, HiOutlineDotsVertical } from "react-icons/hi";

export interface AdminColumn<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
  accessor?: (row: T) => string | number | boolean | null | undefined;
  badge?: boolean;
  badgeColor?: (value: string) => { color: string; bg: string };
}

interface AdminTableProps<T> {
  columns: AdminColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

const defaultBadgeColor = (value: string): { color: string; bg: string } => {
  const upper = String(value || "").toUpperCase();
  if (["ACTIVE", "ENABLED", "CONNECTED", "APPROVED", "OPEN", "AVAILABLE", "CERTIFIED"].includes(upper)) {
    return { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" };
  }
  if (["PENDING", "ONBOARDING", "UNDER_REVIEW", "CONDITIONAL", "MAINTENANCE", "LIMITED_OPS", "RESERVED", "WEATHER_HOLD"].includes(upper)) {
    return { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" };
  }
  if (["DISABLED", "SUSPENDED", "INACTIVE", "REVOKED", "CLOSED", "DECOMMISSIONED", "DISCONNECTED", "RESTRICTED"].includes(upper)) {
    return { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" };
  }
  if (["OCCUPIED", "IFR", "VFR"].includes(upper)) {
    return { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" };
  }
  return { color: "#64748B", bg: "rgba(100, 116, 139, 0.1)" };
};

export default function AdminTable<T>({
  columns,
  rows,
  rowKey,
  searchPlaceholder = "Search...",
  emptyMessage = "No records found.",
}: AdminTableProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        background: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #F1F5F9",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#F8FAFC",
            borderRadius: "10px",
            border: "1px solid #E2E8F0",
            padding: "8px 14px",
            width: "320px",
            maxWidth: "100%",
          }}
        >
          <HiOutlineSearch size={16} style={{ color: "#94A3B8", flexShrink: 0 }} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              width: "100%",
              fontSize: "0.875rem",
              color: "#1E293B",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 500 }}>
          Showing {rows.length} {rows.length === 1 ? "record" : "records"}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.8125rem",
          }}
        >
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    color: "#64748B",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    width: col.width,
                  }}
                >
                  {col.header}
                </th>
              ))}
              <th
                style={{
                  textAlign: "right",
                  padding: "12px 16px",
                  width: "48px",
                }}
              />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  style={{
                    padding: "40px 16px",
                    textAlign: "center",
                    color: "#94A3B8",
                    fontSize: "0.875rem",
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  style={{
                    borderBottom: "1px solid #F8FAFC",
                    transition: "background 120ms ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget.style.background = "#FAFBFC"))}
                  onMouseLeave={(e) => ((e.currentTarget.style.background = "transparent"))}
                >
                  {columns.map((col) => {
                    const value = col.accessor ? col.accessor(row) : (row as Record<string, unknown>)[col.key];
                    const display = col.render ? col.render(row) : value === null || value === undefined ? "—" : String(value);

                    if (col.badge && typeof display === "string") {
                      const config = col.badgeColor ? col.badgeColor(display) : defaultBadgeColor(display);
                      return (
                        <td key={col.key} style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "3px 10px",
                              borderRadius: "9999px",
                              fontSize: "0.6875rem",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              background: config.bg,
                              color: config.color,
                            }}
                          >
                            {display}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={col.key}
                        style={{
                          padding: "14px 16px",
                          color: "#1E293B",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {display}
                      </td>
                    );
                  })}
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#94A3B8",
                        cursor: "pointer",
                        padding: "4px",
                        borderRadius: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Row actions"
                    >
                      <HiOutlineDotsVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
