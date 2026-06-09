import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineClipboardList,
  HiOutlineSupport,
  HiOutlineLogout,
  HiChevronRight,
  HiChevronLeft,
  HiOutlineStatusOnline,
  HiOutlineTrendingUp,
  HiOutlineMap,
  HiOutlineExclamationCircle,
  HiOutlineTemplate,
  HiOutlineChip,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiOutlineUserAdd,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import { useSidebar } from "../../../hooks/useSidebar";
import Logo from "../../../assets/images/MainLogo.svg";
import LogoDark from "../../../assets/images/MainLogodark.svg";
import LogoCollapsed from "../../../assets/images/Vlogo.svg"; // TODO: replace with collapsed logo
import { useTheme } from "../../../contexts/ThemeContext";

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

interface NavItem {
  id: string;
  label: string;
  icon?: IconType;
  path?: string;
  badge?: string;
  submenu?: SubMenuItem[];
  isHeading?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

// Navigation configuration — paths prefixed with /dashboard
const navSections: NavSection[] = [
  {
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: HiOutlineViewGrid,
        path: "/dashboard",
      },
      // {
      //   id: 'rule-engine',
      //   label: 'Rule Engine',
      //   icon: HiOutlineAdjustments,
      //   path: '/dashboard/rule-engine',
      // },
      // { id: 'data-sources', label: 'Data Sources', icon: HiOutlineDatabase, path: '/dashboard/data-sources' },
      // { id: 'analytics', label: 'Analytics', icon: HiOutlineChartBar, path: '/dashboard/analytics' },
      // { id: 'audit-logs', label: 'Audit Logs', icon: HiOutlineClock, path: '/dashboard/audit-logs' },
    ],
  },
  {
    title: "Velos Live Monitor",
    items: [
      {
        id: "live-monitor",
        label: "Live Monitor",
        icon: HiOutlineStatusOnline,
        path: "/dashboard/live-monitor",
      },
      {
        id: "products",
        label: "Demand View",
        icon: HiOutlineTrendingUp,
        submenu: [
          {
            id: "product-list",
            label: "Product List",
            path: "/dashboard/products",
          },
          {
            id: "add-product",
            label: "Add Product",
            path: "/dashboard/products/add",
          },
        ],
      },
      {
        id: "orders",
        label: "Fleet HeatMap",
        icon: HiOutlineMap,
        path: "/dashboard/orders",
        badge: "12",
      },
      {
        id: "reports",
        label: "Dealys",
        icon: HiOutlineClock,
        path: "/dashboard/reports",
      },
      {
        id: "settings",
        label: "Disruptions",
        icon: HiOutlineExclamationCircle,
        path: "/dashboard/settings",
      },
      {
        id: "gantt",
        label: "Gantt Planner",
        icon: HiOutlineClipboardList,
        submenu: [
          {
            id: "gantt-aircraft",
            label: "Gantt Aircraft",
            path: "/dashboard/gantt/aircraft",
          },
          {
            id: "gantt-vertiport",
            label: "Gantt Vertiport",
            path: "/dashboard/gantt/vertiport",
          },
        ],
      },
    ],
  },
  {
    title: "Velos Platform Manager",
    items: [
      {
        id: "users",
        label: "Designer",
        icon: HiOutlineTemplate,
        submenu: [
          { id: "user-list", label: "Process Group", path: "/dashboard/process-groups" },
          {
            id: "add-user",
            label: "Process Builder",
            path: "/dashboard/processes",
          },
          {
            id: "add-user",
            label: "Process Library",
            path: "/dashboard/users/add",
          },
          {
            id: "add-user",
            label: "ToolKit Library",
            path: "/dashboard/users/add",
          },
          {
            id: "designer-schema-library",
            label: "Schema Library",
            path: "/dashboard/designer/schema-library",
          },
          {
            id: "add-user",
            label: "Widget Library",
            path: "/dashboard/users/add",
          },
          {
            id: "designer-rule-library",
            label: "Rule Library",
            path: "/dashboard/designer/rule-library",
          },
          {
            id: "add-user",
            label: "Bussiness Polices",
            path: "/dashboard/users/add",
          },
        ],
      },
      {
        id: "products",
        label: "Kernal",
        icon: HiOutlineChip,
        submenu: [
          {
            id: "product-list",
            label: "Monitoring",
            path: "/dashboard/products",
          },
          {
            id: "add-product",
            label: "Faults",
            path: "/dashboard/products/add",
          },
        ],
      },
      {
        id: "products",
        label: "Performance",
        icon: HiOutlineChartBar,
        submenu: [
          { id: "product-list", label: "Metrics", path: "/dashboard/products" },
        ],
      },
      {
        id: "products",
        label: "Configuration",
        icon: HiOutlineCog,
        submenu: [
          {
            id: "product-list",
            label: "Global Settings",
            path: "/dashboard/products",
          },
          {
            id: "product-list",
            label: "Execution Settings",
            path: "/dashboard/products",
          },
          {
            id: "product-list",
            label: "Event Configuration",
            path: "/dashboard/products",
          },
          {
            id: "product-list",
            label: "Security",
            path: "/dashboard/products",
          },
          {
            id: "product-list",
            label: "Notifications",
            path: "/dashboard/products",
          },
        ],
      },
      {
        id: "administration-heading",
        label: "Administration",
        isHeading: true,
      },
      {
        id: "tenants",
        label: "Tenants",
        icon: HiOutlineShieldCheck,
        submenu: [
          {
            id: "tenants-operator",
            label: "Operator",
            path: "/dashboard/operators",
          },
          {
            id: "tenants-vertiport",
            label: "Vertiport",
            path: "/dashboard/vertiports",
          },
        ],
      },
      {
        id: "partners",
        label: "Partners",
        icon: HiOutlineUserAdd,
        submenu: [
          {
            id: "partners-regulators",
            label: "Regulators",
            path: "/dashboard/regulators",
          },
          {
            id: "partners-oem",
            label: "OEM",
            path: "/dashboard/oem",
          },
        ],
      },
      // { id: 'orders', label: 'Fleet HeatMap', icon: HiOutlineClipboardList, path: '/dashboard/orders', badge: '12' },
    ],
  },
  {
    title: "Velos Airspace Manager",
    items: [
      {
        id: "assigned-airspace",
        label: "Assigned Airspace",
        icon: HiOutlineGlobeAlt,
        submenu: [
          {
            id: "geographical-clusters",
            label: "Cluster",
            path: "/dashboard/geographical/clusters",
          },
          {
            id: "geographical-regions",
            label: "Region",
            path: "/dashboard/geographical/regions",
          },
          {
            id: "geographical-zones",
            label: "Zones",
            path: "/dashboard/geographical/zones",
          },
        ],
      },
      {
        id: "routes",
        label: "Routes & Corridors",
        icon: HiOutlineLocationMarker,
        submenu: [
          {
            id: "routes-explorer",
            label: "Route Explorer",
            path: "/dashboard/routes/explorer",
          },
          {
            id: "routes-reservations",
            label: "Reservations",
            path: "/dashboard/routes/reservations",
          },
          {
            id: "routes-constraints",
            label: "Constraints & Performance",
            path: "/dashboard/routes/constraints",
          },
          {
            id: "routes-versions",
            label: "Versions & Approvals",
            path: "/dashboard/routes/versions",
          },
        ],
      },
      // { id: 'orders', label: 'Fleet HeatMap', icon: HiOutlineClipboardList, path: '/dashboard/orders', badge: '12' },
    ],
  },
];

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
    (item.path && item.path !== "/dashboard" && location.pathname.startsWith(item.path + "/")) ||
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

  if (item.isHeading) {
    return <div className="sidebar__section-title">{item.label}</div>;
  }

  return (
    <div>
      <motion.div
        className={`sidebar__item ${isActive ? "active" : ""}`}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
      >
        {Icon && <Icon className="sidebar__item-icon" />}
        <span className="sidebar__menu-label">{item.label}</span>
        {item.badge && !isCollapsed && (
          <span className="sidebar__item-badge">{item.badge}</span>
        )}
        {hasSubmenu && !isCollapsed && (
          <HiChevronRight className={`sidebar__arrow ${open ? "open" : ""}`} />
        )}
      </motion.div>

      {/* Submenu */}
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

// Precompute titled and untitled sections
const titledSections = navSections.filter((s) => s.title);
const untitledSections = navSections.filter((s) => !s.title);

export const sidebarSectionTitles = titledSections.map((s) => s.title as string);

export default function Sidebar() {
  const { collapsed, mobileOpen, closeMobile, toggle, activeSectionIndex } = useSidebar();
  const { theme } = useTheme();
  const isCollapsed = collapsed && !mobileOpen;

  const activeSection = titledSections[activeSectionIndex];

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
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
        layout
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Logo */}
        <div className="sidebar__logo">
          {isCollapsed ? (
            <img
              src={LogoCollapsed}
              alt="TCS Velos"
              className="sidebar__logo-img sidebar__logo-img--collapsed"
            />
          ) : (
            <img src={theme === 'dark' ? LogoDark : Logo} alt="TCS Velos" className="sidebar__logo-img" />
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {/* Always-visible untitled sections (e.g. Dashboard) */}
          {untitledSections.map((section, idx) => (
            <div key={`untitled-${idx}`}>
              {section.items.map((item, itemIdx) => (
                <SidebarItem
                  key={`${item.id}-${idx}-${itemIdx}`}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          ))}

          {/* Active titled section */}
          {activeSection && (
            <div>
              {activeSection.title && (
                <div className="sidebar__section-title">
                  {activeSection.title}
                </div>
              )}
              {activeSection.items.map((item, itemIdx) => (
                <SidebarItem
                  key={`${item.id}-${activeSectionIndex}-${itemIdx}`}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          )}
        </nav>

        {/* Bottom section */}
        <div className="sidebar__bottom">
          <motion.button
            className="sidebar__create-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggle}
          >
            {isCollapsed ? (
              <HiChevronRight size={16} />
            ) : (
              <HiChevronLeft size={16} />
            )}
          </motion.button>

          <div style={{ marginTop: "12px" }}>
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
