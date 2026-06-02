import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineShieldCheck,
  HiOutlineSupport,
  HiOutlineLogout,
  HiOutlineCube,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineSun,
  HiOutlineCalendar,
  HiOutlineVolumeUp,
  HiOutlineUsers,
  HiOutlineLightningBolt,
  HiOutlineCog,
  HiOutlineDatabase,
  HiOutlineGlobeAlt,
  HiChevronRight,
  HiChevronLeft,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import { useSidebar } from "../../../hooks/useSidebar";
import Logo from "../../../assets/images/landingPage/logoDark.svg";
import vertiportsData from "../data/vertiports.json";
import type { Vertiport } from "../components/VertiportCard";

const allVertiports: Vertiport[] = vertiportsData as Vertiport[];

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

function getVertiportNav(vertiportId: string): NavSection[] {
  const base = `/vertiport/${vertiportId}`;
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
      title: "Infrastructure",
      items: [
        {
          id: "terminals",
          label: "Terminals",
          icon: HiOutlineOfficeBuilding,
          path: `${base}/terminals`,
        },
        {
          id: "pads",
          label: "Pads",
          icon: HiOutlineCube,
          submenu: [
            { id: "pad-list", label: "Pad List", path: `${base}/pads` },
            { id: "pad-capabilities", label: "Pad Capabilities", path: `${base}/pad-capabilities` },
          ],
        },
        {
          id: "airside-zones",
          label: "Airside Zones",
          icon: HiOutlineGlobeAlt,
          path: `${base}/airside-zones`,
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          id: "operating-schedules",
          label: "Operating Schedules",
          icon: HiOutlineCalendar,
          path: `${base}/operating-schedules`,
        },
        {
          id: "noise-limits",
          label: "Noise Limits",
          icon: HiOutlineVolumeUp,
          path: `${base}/noise-limits`,
        },
      ],
    },
    {
      title: "Vertihub",
      items: [
        {
          id: "vertihubs",
          label: "Vertihubs",
          icon: HiOutlineDatabase,
          path: `${base}/vertihubs`,
        },
        {
          id: "vertihub-energy",
          label: "Vertihub Energy",
          icon: HiOutlineSun,
          path: `${base}/vertihub-energy`,
        },
      ],
    },
    {
      title: "Integrations",
      items: [
        {
          id: "vtm",
          label: "VTM Systems",
          icon: HiOutlineLightningBolt,
          path: `${base}/vtm`,
        },
      ],
    },
    {
      title: "Directory",
      items: [
        {
          id: "contacts",
          label: "Contacts",
          icon: HiOutlineUsers,
          path: `${base}/contacts`,
        },
        {
          id: "addresses",
          label: "Addresses",
          icon: HiOutlineLocationMarker,
          path: `${base}/addresses`,
        },
      ],
    },
    {
      title: "Compliance",
      items: [
        {
          id: "audit-logs",
          label: "Audit Logs",
          icon: HiOutlineShieldCheck,
          path: `${base}/audit-logs`,
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
  const location = useLocation();
  const navigate = useNavigate();
  const { closeMobile } = useSidebar();

  const hasSubmenu = item.submenu && item.submenu.length > 0;

  // Start submenu expanded if one of its children is currently active.
  const initiallyOpen =
    !!item.submenu?.some((sub) => sub.path === location.pathname);
  const [open, setOpen] = useState(initiallyOpen);

  const isActive =
    item.path === location.pathname ||
    item.submenu?.some((sub) => sub.path === location.pathname);

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

export default function VertiportSidebar() {
  const { collapsed, mobileOpen, closeMobile, toggle } = useSidebar();
  const isCollapsed = collapsed && !mobileOpen;
  const { vertiportId } = useParams<{ vertiportId: string }>();

  const vertiport = allVertiports.find((vp) => vp.vertiportId === vertiportId);
  const navSections = getVertiportNav(vertiportId || "");

  const classColors: Record<string, string> = {
    VERTIHUB: "linear-gradient(135deg, #0F766E, #2DD4BF)",
    VERTIPORT: "linear-gradient(135deg, #1B5FE3, #6C63FF)",
    VERTIPAD: "linear-gradient(135deg, #7C3AED, #A78BFA)",
  };

  return (
    <>
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

        {/* Vertiport badge */}
        {!isCollapsed && vertiport && (
          <div
            style={{
              padding: "0 16px 12px",
              borderBottom: "1px solid #F1F5F9",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, rgba(15,118,110,0.08), rgba(45,212,191,0.08))",
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
                  background: classColors[vertiport.vertiportClass] || classColors.VERTIPORT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  flexShrink: 0,
                }}
              >
                {vertiport.vertiportCode.slice(0, 3)}
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
                  {vertiport.vertiportName}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "#94A3B8", fontWeight: 500 }}>
                  {vertiport.vertiportCode} &middot; {vertiport.vertiportClass}
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
