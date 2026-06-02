import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineCog,
  HiMenuAlt2,
} from "react-icons/hi";
import { useSidebar } from "../../../hooks/useSidebar";
import vertiportsData from "../data/vertiports.json";
import type { Vertiport } from "../components/VertiportCard";

const allVertiports: Vertiport[] = vertiportsData as Vertiport[];

export default function VertiportTopbar() {
  const { collapsed, toggle } = useSidebar();
  const { vertiportId } = useParams<{ vertiportId: string }>();
  const vertiport = allVertiports.find((vp) => vp.vertiportId === vertiportId);

  return (
    <header className={`topbar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="topbar__left">
        <button className="topbar__toggle" onClick={toggle}>
          <HiMenuAlt2 size={22} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {vertiport && (
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "#0F172A",
                  letterSpacing: "-0.01em",
                }}
              >
                {vertiport.vertiportName}
              </span>
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "#94A3B8",
                }}
              >
                Portal
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="topbar__center">
        <div className="topbar__search">
          <HiOutlineSearch className="topbar__search-icon" />
          <input
            type="text"
            className="topbar__search-input"
            placeholder="Search FATO, pads, scheduling..."
          />
        </div>
      </div>

      <div className="topbar__right">
        <motion.button
          className="topbar__icon-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HiOutlineBell size={20} />
          <span className="topbar__icon-btn__badge" />
        </motion.button>

        <motion.button
          className="topbar__icon-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HiOutlineCog size={20} />
        </motion.button>

        <div className="topbar__divider" />

        <motion.div className="topbar__profile" whileHover={{ scale: 1.01 }}>
          <div className="topbar__profile-info">
            <div className="topbar__profile-name">Ligin Abraham</div>
            <div className="topbar__profile-role">Vertiport Admin</div>
          </div>
          <div className="topbar__profile-avatar">LA</div>
        </motion.div>
      </div>
    </header>
  );
}
