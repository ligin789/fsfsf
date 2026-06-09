import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineIdentification,
  HiOutlineCode,
} from "react-icons/hi";
import StatusBadge from "../components/StatusBadge";
import operatorsData from "../data/operators.json";
import type { Operator } from "../components/OperatorCard";

const allOperators: Operator[] = operatorsData;

export default function OperatorPortalPage() {
  const { operatorId } = useParams<{ operatorId: string }>();
  const operator = allOperators.find((op) => op.id === operatorId);

  if (!operator) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--app-text-strong)" }}>Operator Not Found</h2>
          <p style={{ color: "var(--app-text-subtle)", marginTop: "8px" }}>
            No operator exists with ID: {operatorId}
          </p>
        </div>
      </div>
    );
  }

  const details: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: HiOutlineIdentification, label: "Operator ID", value: operator.id },
    { icon: HiOutlineCode, label: "Code", value: operator.code },
    { icon: HiOutlineLocationMarker, label: "Location", value: operator.location },
    { icon: HiOutlineMail, label: "Email", value: operator.contactEmail },
    { icon: HiOutlinePhone, label: "Phone", value: operator.contactPhone },
    {
      icon: HiOutlineCalendar,
      label: "Created",
      value: new Date(operator.createdDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1 className="page-header__title">{operator.name} Portal</h1>
          <p className="page-header__subtitle">Operator details and management portal.</p>
        </div>
        <div className="page-header__actions">
          <StatusBadge status={operator.status} />
        </div>
      </div>

      <div className="row g-4">
        {/* Operator Image */}
        <div className="col-lg-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              background: "var(--app-surface)",
              borderRadius: "14px",
              border: "1px solid var(--app-border-subtle)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}
          >
            <div style={{ width: "100%", height: "260px", background: "linear-gradient(135deg, #1D4ED8 0%, var(--app-primary) 40%, #3B82F6 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "4px" }}>
                <img
                  src={operator.logo}
                  alt={operator.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }}
                />
              </div>
            </div>
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--app-text)", margin: 0 }}>
                {operator.name}
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--app-text-faint)", marginTop: "4px", marginBottom: 0 }}>
                {operator.code} &middot; {operator.location}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Operator Details */}
        <div className="col-lg-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            style={{
              background: "var(--app-surface)",
              borderRadius: "14px",
              border: "1px solid var(--app-border-subtle)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--app-text)",
                marginBottom: "20px",
                paddingBottom: "12px",
                borderBottom: "1px solid var(--app-border-subtle)",
              }}
            >
              Operator Details
            </h3>
            {details.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  borderBottom: "1px solid var(--app-surface-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Icon size={18} style={{ color: "var(--app-text-faint)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.875rem", color: "var(--app-text-subtle)", fontWeight: 500 }}>{label}</span>
                </div>
                <span style={{ fontSize: "0.875rem", color: "var(--app-text-strong)", fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
