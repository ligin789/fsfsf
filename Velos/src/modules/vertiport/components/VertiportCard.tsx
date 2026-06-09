import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";

export interface Vertiport {
  vertiportId: string;
  vertiportCode: string;
  vertiportName: string;
  vertiportClass: string;
  partnerId: string;
  operatorId: string;
  ownerId: string;
  regulatorId: string;
  operatingZoneId: string;
  operatingRegionId: string;
  operatingClusterId: string;
  vtmSystemId: string;
  latitudeDeg: number;
  longitudeDeg: number;
  elevationFtAmsl: number;
  arpGeometry: Record<string, string>;
  boundaryGeometry: Record<string, string>;
  magneticVariationDeg: number;
  utcOffsetHours: number;
  timezoneName: string;
  totalFatoCount: number;
  totalPadCount: number;
  totalGateCount: number;
  maxSimultaneousMovements: number;
  maxAircraftMtowKg: number;
  noiseAbatementProcedure: string;
  iataCode: string;
  icaoDesignator: string;
  swimEndpoint: string;
  atmUnit: string;
  certificationStatus: string;
  certificationAuthority: string;
  certificationExpiry: string;
  isVtmConnected: boolean;
  vtmConnectivityStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface VertiportCardProps {
  vertiport: Vertiport;
  delay?: number;
}

export default function VertiportCard({ vertiport, delay = 0 }: VertiportCardProps) {
  const handleClick = () => {
    if (vertiport.status !== "ACTIVE") {
      alert("Vertiport is not active");
      return;
    }
    window.open(`/vertiport/${vertiport.vertiportId}`, "_blank");
  };

  const gradId = `grad-${vertiport.vertiportId}`;

  const classColors: Record<string, { from: string; mid: string; to: string }> = {
    VERTIHUB: { from: "#0F766E", mid: "#14B8A6", to: "#2DD4BF" },
    VERTIPORT: { from: "#1D4ED8", mid: "var(--app-primary)", to: "#3B82F6" },
    VERTIPAD: { from: "#7C3AED", mid: "#8B5CF6", to: "#A78BFA" },
  };

  const colors = classColors[vertiport.vertiportClass] || classColors.VERTIPORT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      onClick={handleClick}
      style={{
        background: "var(--app-surface)",
        borderRadius: "16px",
        border: "1px solid var(--app-border)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        overflow: "hidden",
        cursor: vertiport.status === "ACTIVE" ? "pointer" : "not-allowed",
        position: "relative",
      }}
      whileHover={{
        boxShadow: "0 10px 20px -3px rgba(0,0,0,0.1), 0 4px 8px -4px rgba(0,0,0,0.06)",
        y: -3,
      }}
    >
      {/* Top Gradient Section with Wave */}
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
          <rect width="400" height="110" fill={`url(#${gradId})`} />
          <path
            d="M0 95 C80 85, 120 120, 200 108 C280 96, 340 125, 400 110 L400 150 L0 150 Z"
            fill="#FFFFFF"
          />
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
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="50%" stopColor={colors.mid} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          </defs>
        </svg>

        {/* Status Badge */}
        <div style={{ position: "absolute", top: "10px", right: "12px", zIndex: 2 }}>
          <StatusBadge status={vertiport.status} />
        </div>

        {/* Class Badge */}
        <div style={{ position: "absolute", top: "10px", left: "12px", zIndex: 2 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "0.6875rem",
              fontWeight: 600,
              background: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              backdropFilter: "blur(4px)",
            }}
          >
            {vertiport.vertiportClass}
          </span>
        </div>

        {/* Icon */}
        <div
          style={{
            position: "absolute",
            bottom: "-8px",
            left: "20px",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "var(--app-surface)",
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
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.02em",
            }}
          >
            {vertiport.vertiportCode.slice(0, 3)}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "20px 20px 16px 20px", marginTop: "4px" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--app-text-strong)",
            margin: 0,
            lineHeight: 1.3,
            letterSpacing: "0.01em",
          }}
        >
          {vertiport.vertiportName.toUpperCase()}
        </h3>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--app-text-faint)",
            fontWeight: 500,
            margin: "8px 0 0 0",
            letterSpacing: "0.02em",
          }}
        >
          {vertiport.vertiportCode} <span style={{ margin: "0 6px", color: "var(--app-border)" }}>|</span> {vertiport.iataCode || "—"}
        </p>

        {/* Capacity info */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid var(--app-border-subtle)",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--app-text-subtle)" }}>
            <span style={{ fontWeight: 600, color: "var(--app-text-strong)" }}>{vertiport.totalFatoCount}</span> FATO
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--app-text-subtle)" }}>
            <span style={{ fontWeight: 600, color: "var(--app-text-strong)" }}>{vertiport.totalPadCount}</span> Pads
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--app-text-subtle)" }}>
            <span style={{ fontWeight: 600, color: "var(--app-text-strong)" }}>{vertiport.totalGateCount}</span> Gates
          </div>
        </div>
      </div>
    </motion.div>
  );
}
