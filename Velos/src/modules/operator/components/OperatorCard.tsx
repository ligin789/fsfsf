import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";

export interface Operator {
  id: string;
  name: string;
  code: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  createdDate: string;
  status: string;
  logo: string;
}

interface OperatorCardProps {
  operator: Operator;
  delay?: number;
}

export default function OperatorCard({ operator, delay = 0 }: OperatorCardProps) {
  const handleClick = () => {
    if (operator.status !== "APPROVED") {
      alert("Operator approval pending");
      return;
    }
    window.open(`/operator/${operator.id}`, "_blank");
  };

  // Unique gradient ID per card to avoid SVG ID conflicts
  const gradId = `grad-${operator.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      onClick={handleClick}
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E8EDF2",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        overflow: "hidden",
        cursor: operator.status === "APPROVED" ? "pointer" : "not-allowed",
        position: "relative",
      }}
      whileHover={{
        boxShadow: "0 10px 20px -3px rgba(0,0,0,0.1), 0 4px 8px -4px rgba(0,0,0,0.06)",
        y: -3,
      }}
    >
      {/* Top Blue Gradient Section with Wave */}
      <div style={{ position: "relative", width: "100%", height: "120px" }}>
        <svg
          viewBox="0 0 400 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          preserveAspectRatio="none"
        >
          {/* Main blue background */}
          <rect width="400" height="110" fill={`url(#${gradId})`} />

          {/* Wave bottom edge */}
          <path
            d="M0 95 C80 85, 120 120, 200 108 C280 96, 340 125, 400 110 L400 150 L0 150 Z"
            fill="#FFFFFF"
          />

          {/* Decorative inner wave curves (lighter blue) */}
          <path
            d="M200 0 C180 30, 280 20, 300 50 C320 80, 380 60, 400 80 L400 0 Z"
            fill="rgba(255,255,255,0.12)"
          />
          <path
            d="M260 0 C250 20, 320 15, 350 40 C370 55, 390 45, 400 55 L400 0 Z"
            fill="rgba(255,255,255,0.10)"
          />
          <path
            d="M300 0 C290 15, 350 10, 380 30 L400 25 L400 0 Z"
            fill="rgba(255,255,255,0.08)"
          />

          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="400" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Status Badge — top right */}
        <div style={{ position: "absolute", top: "10px", right: "12px", zIndex: 2 }}>
          <StatusBadge status={operator.status} />
        </div>

        {/* Round Logo — overlapping the wave boundary, left side */}
        <div
          style={{
            position: "absolute",
            bottom: "-8px",
            left: "20px",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#FFFFFF",
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "3px",
            zIndex: 2,
            border: "2px solid rgba(255,255,255,0.9)",
          }}
        >
          <img
            src={operator.logo}
            alt={operator.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>

      {/* Card Body — below the gradient */}
      <div style={{ padding: "20px 20px 20px 20px", marginTop: "4px" }}>
        {/* Operator Name */}
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#1E293B",
            margin: 0,
            lineHeight: 1.3,
            letterSpacing: "0.01em",
          }}
        >
          {operator.name.toUpperCase()}
        </h3>

        {/* Code | ID */}
        <p
          style={{
            fontSize: "0.8125rem",
            color: "#94A3B8",
            fontWeight: 500,
            margin: "8px 0 0 0",
            letterSpacing: "0.02em",
          }}
        >
          {operator.code} <span style={{ margin: "0 6px", color: "#CBD5E1" }}>|</span> {operator.id}
        </p>
      </div>
    </motion.div>
  );
}
