import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineUserGroup,
  HiOutlineMap,
  HiOutlineClipboardList,
  HiOutlineShieldCheck,
  HiOutlineDocumentReport,
  HiOutlineCog,
  HiOutlineSupport,
  HiOutlineLogout,
  HiOutlineTruck,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineBell,
  HiChevronRight,
  HiChevronLeft,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import { useSidebar } from "../../../hooks/useSidebar";
import Logo from "../../../assets/images/landingPage/logoDark.svg";
import operatorsData from "../data/operators.json";
import type { Operator } from "../components/OperatorCard";

const allOperators: Operator[] = operatorsData;

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: IconType;
  path?: string;
  badge?: string;
  submenu?: SubMenuItem[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

function getOperatorNav(operatorId: string): NavSection[] {
  const base = `/operator/${operatorId}`;
  return [
    {
      items: [
        {
          id: "portal-home",
          label: "Portal Home",
          icon: HiOutlineViewGrid,
          path: base,
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          id: "fleet",
          label: "Fleet Management",
          icon: HiOutlineTruck,
          submenu: [
            { id: "fleet-list", label: "Aircraft List", path: `${base}/fleet` },
            { id: "fleet-status", label: "Fleet Status", path: `${base}/fleet/status` },
            { id: "maintenance", label: "Maintenance", path: `${base}/fleet/maintenance` },
          ],
        },
        {
          id: "routes",
          label: "Route Planning",
          icon: HiOutlineMap,
          submenu: [
            { id: "active-routes", label: "Active Routes", path: `${base}/routes` },
            { id: "route-builder", label: "Route Builder", path: `${base}/routes/builder` },
          ],
        },
        {
          id: "scheduling",
          label: "Scheduling",
          icon: HiOutlineCalendar,
          submenu: [
            { id: "daily-schedule", label: "Daily Schedule", path: `${base}/scheduling` },
            { id: "crew-roster", label: "Crew Roster", path: `${base}/scheduling/crew` },
          ],
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          id: "crew",
          label: "Crew Management",
          icon: HiOutlineUserGroup,
          submenu: [
            { id: "pilots", label: "Pilots", path: `${base}/crew/pilots` },
            { id: "ground-staff", label: "Ground Staff", path: `${base}/crew/ground` },
            { id: "certifications", label: "Certifications", path: `${base}/crew/certifications` },
          ],
        },
        {
          id: "compliance",
          label: "Compliance",
          icon: HiOutlineShieldCheck,
          submenu: [
            { id: "audits", label: "Audits", path: `${base}/compliance/audits` },
            { id: "licenses", label: "Licenses", path: `${base}/compliance/licenses` },
            { id: "safety", label: "Safety Records", path: `${base}/compliance/safety` },
          ],
        },
        {
          id: "reports",
          label: "Reports",
          icon: HiOutlineDocumentReport,
          submenu: [
            { id: "ops-reports", label: "Operations", path: `${base}/reports/operations` },
            { id: "financial", label: "Financial", path: `${base}/reports/financial` },
          ],
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: HiOutlineChartBar,
          path: `${base}/analytics`,
        },
        {
          id: "notifications",
          label: "Notifications",
          icon: HiOutlineBell,
          path: `${base}/notifications`,
          badge: "3",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          id: "config",
          label: "Configuration",
          icon: HiOutlineCog,
          submenu: [
            { id: "general", label: "General", path: `${base}/settings/general` },
            { id: "integrations", label: "Integrations", path: `${base}/settings/integrations` },
            { id: "permissions", label: "Permissions", path: `${base}/settings/permissions` },
          ],
        },
        {
          id: "tasks",
          label: "Task Board",
          icon: HiOutlineClipboardList,
          path: `${base}/tasks`,
        },
      ],
    },
  ];
}

interface SidebarItemProps {
  item: NavItem;
  isCollapsed: boolean;
}

function SidebarItem({ item, isCollapsed }: SidebarItemProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { closeMobile } = useSidebar();

  const isActive =
    item.path === location.pathname ||
    item.submenu?.some((sub) => sub.path === location.pathname);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  const handleClick = () => {
    if (hasSubmenu) {
      setOpen((prev) => !prev);
    } else if (item.path) {
      navigate(item.path);
      closeMobile();
    }
  };

  const Icon = item.icon;

  return (
    <div>
      <motion.div
        className={`sidebar__item ${isActive ? "active" : ""}`}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className="sidebar__item-icon" />
        <span className="sidebar__menu-label">{item.label}</span>
        {item.badge && !isCollapsed && (
          <span className="sidebar__item-badge">{item.badge}</span>
        )}
        {hasSubmenu && !isCollapsed && (
          <HiChevronRight className={`sidebar__arrow ${open ? "open" : ""}`} />
        )}
      </motion.div>

      <AnimatePresence>
        {hasSubmenu && open && !isCollapsed && (
          <motion.div
            className="sidebar__submenu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {item.submenu!.map((sub, index) => (
              <div
                key={`${sub.id}-${index}`}
                className={`sidebar__submenu-item ${
                  location.pathname === sub.path ? "active" : ""
                }`}
                onClick={() => {
                  navigate(sub.path);
                  closeMobile();
                }}
              >
                {sub.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OperatorSidebar() {
  const { collapsed, mobileOpen, closeMobile, toggle } = useSidebar();
  const isCollapsed = collapsed && !mobileOpen;
  const { operatorId } = useParams<{ operatorId: string }>();

  const operator = allOperators.find((op) => op.id === operatorId);
  const navSections = getOperatorNav(operatorId || "");

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sidebar__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
        layout
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Logo */}
        <div className="sidebar__logo">
          <img
            src={Logo}
            alt="TCS Velos"
            className={`sidebar__logo-img ${isCollapsed ? "sidebar__logo-img--collapsed" : ""}`}
          />
        </div>

        {/* Operator badge */}
        {!isCollapsed && operator && (
          <div
            style={{
              padding: "0 16px 12px",
              borderBottom: "1px solid #F1F5F9",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, rgba(27,95,227,0.08), rgba(108,99,255,0.08))",
                borderRadius: "10px",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #1B5FE3, #6C63FF)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  flexShrink: 0,
                }}
              >
                {operator.code.slice(0, 2)}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "#1E293B",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {operator.name}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "#94A3B8", fontWeight: 500 }}>
                  {operator.code} &middot; {operator.location}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapse Toggle */}
        <div className="sidebar__collapse-toggle-wrapper">
          <motion.button
            className="sidebar__collapse-toggle"
            onClick={toggle}
            whileTap={{ scale: 0.9 }}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <HiChevronRight size={16} /> : <HiChevronLeft size={16} />}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {navSections.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <div className="sidebar__section-title">{section.title}</div>
              )}
              {section.items.map((item, itemIdx) => (
                <SidebarItem
                  key={`${item.id}-${idx}-${itemIdx}`}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="sidebar__bottom">
          <div>
            <div className="sidebar__item" style={{ color: "#64748B" }}>
              <HiOutlineSupport className="sidebar__item-icon" />
              <span className="sidebar__menu-label">Support</span>
            </div>
            <div className="sidebar__item" style={{ color: "#64748B" }}>
              <HiOutlineLogout className="sidebar__item-icon" />
              <span className="sidebar__menu-label">Sign Out</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
