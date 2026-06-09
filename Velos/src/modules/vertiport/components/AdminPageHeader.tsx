import { motion } from "framer-motion";
import { HiOutlinePlus, HiOutlineDownload, HiOutlineFilter } from "react-icons/hi";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  createLabel?: string;
  onCreate?: () => void;
  showFilter?: boolean;
  showExport?: boolean;
}

export default function AdminPageHeader({
  title,
  subtitle,
  createLabel,
  onCreate,
  showFilter = true,
  showExport = true,
}: AdminPageHeaderProps) {
  return (
    <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
      <div>
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      <div className="page-header__actions" style={{ display: "flex", gap: "8px" }}>
        {showFilter && (
          <motion.button
            className="btn-innovista"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "var(--app-surface)",
              border: "1px solid var(--app-border)",
              color: "var(--app-text-muted)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <HiOutlineFilter size={16} /> Filter
          </motion.button>
        )}
        {showExport && (
          <motion.button
            className="btn-innovista"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "var(--app-surface)",
              border: "1px solid var(--app-border)",
              color: "var(--app-text-muted)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <HiOutlineDownload size={16} /> Export
          </motion.button>
        )}
        {createLabel && (
          <motion.button
            className="btn-innovista btn-innovista--primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreate}
          >
            <HiOutlinePlus size={16} />
            {createLabel}
          </motion.button>
        )}
      </div>
    </div>
  );
}
