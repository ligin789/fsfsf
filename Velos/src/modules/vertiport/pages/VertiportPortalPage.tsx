import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineIdentification,
  HiOutlineCode,
  HiOutlineGlobe,
  HiOutlineShieldCheck,
  HiOutlineStatusOnline,
  HiOutlineCube,
} from "react-icons/hi";
import StatusBadge from "../components/StatusBadge";
import VertiportMapBox from "../components/VertiportMapBox";
import vertiportsData from "../data/vertiports.json";
import type { Vertiport } from "../components/VertiportCard";

const allVertiports: Vertiport[] = vertiportsData as Vertiport[];

export default function VertiportPortalPage() {
  const { vertiportId } = useParams<{ vertiportId: string }>();
  const vertiport = allVertiports.find((vp) => vp.vertiportId === vertiportId);

  if (!vertiport) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--app-text-strong)" }}>Vertiport Not Found</h2>
          <p style={{ color: "var(--app-text-subtle)", marginTop: "8px" }}>
            No vertiport exists with ID: {vertiportId}
          </p>
        </div>
      </div>
    );
  }

  const details: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: HiOutlineIdentification, label: "Vertiport ID", value: vertiport.vertiportId },
    { icon: HiOutlineCode, label: "Code", value: vertiport.vertiportCode },
    { icon: HiOutlineCube, label: "Class", value: vertiport.vertiportClass },
    { icon: HiOutlineLocationMarker, label: "Coordinates", value: `${vertiport.latitudeDeg}, ${vertiport.longitudeDeg}` },
    { icon: HiOutlineGlobe, label: "Timezone", value: `${vertiport.timezoneName} (UTC${vertiport.utcOffsetHours >= 0 ? "+" : ""}${vertiport.utcOffsetHours})` },
    { icon: HiOutlineShieldCheck, label: "Certification", value: `${vertiport.certificationStatus} — ${vertiport.certificationAuthority}` },
    { icon: HiOutlineStatusOnline, label: "VTM Status", value: vertiport.vtmConnectivityStatus },
    { icon: HiOutlineCalendar, label: "IATA / ICAO", value: `${vertiport.iataCode} / ${vertiport.icaoDesignator}` },
  ];

  const capacityItems = [
    { label: "FATO", value: vertiport.totalFatoCount },
    { label: "Pads", value: vertiport.totalPadCount },
    { label: "Gates", value: vertiport.totalGateCount },
    { label: "Max Movements", value: vertiport.maxSimultaneousMovements },
    { label: "Max MTOW (kg)", value: vertiport.maxAircraftMtowKg },
    { label: "Elevation (ft)", value: vertiport.elevationFtAmsl },
  ];

  const classColors: Record<string, { from: string; to: string }> = {
    VERTIHUB: { from: "#0F766E", to: "#2DD4BF" },
    VERTIPORT: { from: "#1D4ED8", to: "#3B82F6" },
    VERTIPAD: { from: "#7C3AED", to: "#A78BFA" },
  };
  const colors = classColors[vertiport.vertiportClass] || classColors.VERTIPORT;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1 className="page-header__title">{vertiport.vertiportName} Portal</h1>
          <p className="page-header__subtitle">Vertiport details and management portal.</p>
        </div>
        <div className="page-header__actions" style={{ display: "flex", gap: "8px" }}>
          <StatusBadge status={vertiport.status} />
          <StatusBadge status={vertiport.vtmConnectivityStatus} />
        </div>
      </div>

      <div className="row g-4">
        {/* Vertiport Hero */}
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
            <div
              style={{
                width: "100%",
                height: "260px",
                background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: colors.from,
                }}
              >
                {vertiport.vertiportCode.slice(0, 3)}
              </div>
            </div>
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--app-text)", margin: 0 }}>
                {vertiport.vertiportName}
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--app-text-faint)", marginTop: "4px", marginBottom: 0 }}>
                {vertiport.vertiportCode} &middot; {vertiport.vertiportClass}
              </p>
            </div>
          </motion.div>

          {/* Capacity Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            style={{
              background: "var(--app-surface)",
              borderRadius: "14px",
              border: "1px solid var(--app-border-subtle)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)",
              padding: "24px",
              marginTop: "16px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--app-text)",
                marginBottom: "16px",
                paddingBottom: "12px",
                borderBottom: "1px solid var(--app-border-subtle)",
              }}
            >
              Capacity
            </h3>
            <div className="row g-3">
              {capacityItems.map(({ label, value }) => (
                <div key={label} className="col-4 text-center">
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.from }}>{value}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--app-text-subtle)", fontWeight: 500, marginTop: "2px" }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Vertiport Details */}
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
              Vertiport Details
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

      {/* Vertiport Map */}
      <div className="row g-4" style={{ marginTop: "0" }}>
        <div className="col-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
          >
            <VertiportMapBox />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
