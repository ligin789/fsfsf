import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineCog,
  HiMenuAlt2,
  HiMenu,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineUser,
  HiOutlineKey,
  HiOutlineMoon,
  HiOutlineGlobeAlt,
  HiOutlineQuestionMarkCircle,
  HiOutlineLogout,
} from 'react-icons/hi';
import { useSidebar } from '../../../hooks/useSidebar';
import ViewSwitcher from '../ui/ViewSwitcher';
import { sidebarSectionTitles } from '../navigation/Sidebar';

type NotificationKind = 'alert' | 'success' | 'info';
interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    kind: 'alert',
    title: 'Corridor conflict detected',
    body: 'BLR-VX-104 vs BLR-SK-118 on Hebbal junction — auto deconflict pending review.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 'n-2',
    kind: 'success',
    title: 'Route AAM-BLR-MG-01 approved',
    body: 'DGCA approval received for version 3 — effective 2026-06-01.',
    time: '18 min ago',
    unread: true,
  },
  {
    id: 'n-3',
    kind: 'info',
    title: 'New operator onboarded',
    body: 'BluCopter Aviation completed KYC. Awaiting fleet registration.',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: 'n-4',
    kind: 'alert',
    title: 'Vertiport KIA-VP — capacity 92%',
    body: 'Throughput nearing daily slot limit. Consider load balancing.',
    time: '3 hr ago',
  },
  {
    id: 'n-5',
    kind: 'info',
    title: 'Weather constraint triggered',
    body: 'Crosswind 24kts at HBL-APP — Whitefield → EC corridor closed temporarily.',
    time: 'Yesterday',
  },
];

export default function Topbar() {
  const { collapsed, toggle, activeSectionIndex, setActiveSectionIndex } = useSidebar();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (!notifOpen && !settingsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (
        settingsOpen &&
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [notifOpen, settingsOpen]);

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <header className={`topbar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="topbar__left">
        <button className="topbar__toggle" onClick={toggle}>
          <HiMenuAlt2 size={22} />
        </button>

        <div className="topbar__hamburger-wrapper" ref={popupRef}>
          <button
            className="topbar__hamburger"
            onClick={() => setMenuOpen((prev) => !prev)}
            title="Switch section"
          >
            <HiMenu size={20} />
          </button>

          {menuOpen && (
            <div className="topbar__section-popup">
              {sidebarSectionTitles.map((title, index) => (
                <div
                  key={index}
                  className={`topbar__section-item ${
                    index === activeSectionIndex ? 'active' : ''
                  }`}
                  onClick={() => {
                    setActiveSectionIndex(index);
                    setMenuOpen(false);
                  }}
                >
                  {title}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="topbar__search">
          <HiOutlineSearch className="topbar__search-icon" />
          <input
            type="text"
            className="topbar__search-input"
            placeholder="Search rules, data or activities..."
          />
        </div>
      </div>

      <div className="topbar__center">
        <ViewSwitcher />
      </div>

      <div className="topbar__right">
        {/* Notification */}
        <div className="topbar__popover-wrapper" ref={notifRef}>
          <motion.button
            className="topbar__icon-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setNotifOpen((v) => !v);
              setSettingsOpen(false);
            }}
            title="Notifications"
          >
            <HiOutlineBell size={20} />
            {unreadCount > 0 && (
              <span className="topbar__icon-btn__count">{unreadCount}</span>
            )}
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                className="topbar__panel topbar__panel--notif"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <div className="topbar__panel-header">
                  <div>
                    <div className="topbar__panel-title">Notifications</div>
                    <div className="topbar__panel-subtitle">
                      {unreadCount} unread · {mockNotifications.length} total
                    </div>
                  </div>
                  <button className="topbar__panel-action">Mark all read</button>
                </div>

                <div className="topbar__panel-list">
                  {mockNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`topbar__notif-item ${n.unread ? 'is-unread' : ''}`}
                    >
                      <div className={`topbar__notif-icon topbar__notif-icon--${n.kind}`}>
                        {n.kind === 'alert' && <HiOutlineExclamation size={16} />}
                        {n.kind === 'success' && <HiOutlineCheckCircle size={16} />}
                        {n.kind === 'info' && <HiOutlineInformationCircle size={16} />}
                      </div>
                      <div className="topbar__notif-body">
                        <div className="topbar__notif-title">{n.title}</div>
                        <div className="topbar__notif-text">{n.body}</div>
                        <div className="topbar__notif-time">{n.time}</div>
                      </div>
                      {n.unread && <span className="topbar__notif-dot" />}
                    </div>
                  ))}
                </div>

                <div className="topbar__panel-footer">
                  <button className="topbar__panel-link">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <div className="topbar__popover-wrapper" ref={settingsRef}>
          <motion.button
            className="topbar__icon-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSettingsOpen((v) => !v);
              setNotifOpen(false);
            }}
            title="Settings"
          >
            <HiOutlineCog size={20} />
          </motion.button>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                className="topbar__panel topbar__panel--settings"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <div className="topbar__panel-header">
                  <div>
                    <div className="topbar__panel-title">Settings</div>
                    <div className="topbar__panel-subtitle">Account · Preferences</div>
                  </div>
                </div>

                <div className="topbar__panel-section">
                  <div className="topbar__panel-section-label">Account</div>
                  <button className="topbar__settings-item">
                    <HiOutlineUser size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="topbar__settings-item">
                    <HiOutlineKey size={16} />
                    <span>Security & Access</span>
                  </button>
                </div>

                <div className="topbar__panel-section">
                  <div className="topbar__panel-section-label">Preferences</div>
                  <div className="topbar__settings-item topbar__settings-item--toggle">
                    <HiOutlineMoon size={16} />
                    <span>Dark mode</span>
                    <label className="topbar__switch">
                      <input type="checkbox" />
                      <span className="topbar__switch-track" />
                    </label>
                  </div>
                  <div className="topbar__settings-item topbar__settings-item--row">
                    <HiOutlineGlobeAlt size={16} />
                    <span>Language</span>
                    <span className="topbar__settings-value">English (IN)</span>
                  </div>
                </div>

                <div className="topbar__panel-section">
                  <div className="topbar__panel-section-label">Support</div>
                  <button className="topbar__settings-item">
                    <HiOutlineQuestionMarkCircle size={16} />
                    <span>Help & Documentation</span>
                  </button>
                </div>

                <div className="topbar__panel-footer">
                  <button className="topbar__settings-item topbar__settings-item--danger">
                    <HiOutlineLogout size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="topbar__divider" />

        {/* User profile */}
        <motion.div
          className="topbar__profile"
          whileHover={{ scale: 1.01 }}
        >
          <div className="topbar__profile-info">
            <div className="topbar__profile-name">Ligin Abraham</div>
            <div className="topbar__profile-role">Platform Admin</div>
          </div>
          <div className="topbar__profile-avatar">LA</div>
        </motion.div>
      </div>
    </header>
  );
}
