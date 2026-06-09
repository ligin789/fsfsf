import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineCog,
  HiMenuAlt2,
} from "react-icons/hi";
import { useSidebar } from "../../../hooks/useSidebar";
import operatorsData from "../data/operators.json";
import type { Operator } from "../components/OperatorCard";

const allOperators: Operator[] = operatorsData;

export default function OperatorTopbar() {
  const { collapsed, toggle } = useSidebar();
  const { operatorId } = useParams<{ operatorId: string }>();
  const operator = allOperators.find((op) => op.id === operatorId);

  return (
    <header className={`topbar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="topbar__left">
        <button className="topbar__toggle" onClick={toggle}>
          <HiMenuAlt2 size={22} />
        </button>

        {/* Operator name as header title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {operator && (
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  color: "var(--app-text)",
                  letterSpacing: "-0.01em",
                }}
              >
                {operator.name}
              </span>
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--app-text-faint)",
                }}
              >
                Portal
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="topbar__center">
        {/* Operator portal search */}
        <div className="topbar__search">
          <HiOutlineSearch className="topbar__search-icon" />
          <input
            type="text"
            className="topbar__search-input"
            placeholder="Search fleet, routes, crew..."
          />
        </div>
      </div>

      <div className="topbar__right">
        {/* Notification */}
        <motion.button
          className="topbar__icon-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HiOutlineBell size={20} />
          <span className="topbar__icon-btn__badge" />
        </motion.button>

        {/* Settings */}
        <motion.button
          className="topbar__icon-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HiOutlineCog size={20} />
        </motion.button>

        <div className="topbar__divider" />

        {/* User profile */}
        <motion.div className="topbar__profile" whileHover={{ scale: 1.01 }}>
          <div className="topbar__profile-info">
            <div className="topbar__profile-name">Ligin Abraham</div>
            <div className="topbar__profile-role">Operator Admin</div>
          </div>
          <div className="topbar__profile-avatar">LA</div>
        </motion.div>
      </div>
    </header>
  );
}
