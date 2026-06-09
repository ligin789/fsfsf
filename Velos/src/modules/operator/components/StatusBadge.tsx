interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  APPROVED: { label: "Approved", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
  PENDING_L1: { label: "Pending L1", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
  PENDING_L2: { label: "Pending L2", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" },
  REJECTED: { label: "Rejected", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    color: "var(--app-text-subtle)",
    bg: "rgba(100, 116, 139, 0.1)",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 12px",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        background: config.bg,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  );
}
