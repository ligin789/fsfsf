import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineMap, HiOutlineViewBoards, HiOutlineViewGrid, HiViewList, HiOutlineCube } from 'react-icons/hi';
import type { IconType } from 'react-icons';

interface View {
  id: string;
  label: string;
  icon: IconType;
  path: string;
}

const views: View[] = [
  { id: 'taskcard', label: 'Task Card', icon: HiViewList, path: '/dashboard/live-monitor/taskcard' },
  { id: 'map', label: 'Map', icon: HiOutlineMap, path: '/dashboard/live-monitor/map' },
  { id: 'gantt', label: 'Gantt', icon: HiOutlineViewBoards, path: '/dashboard/live-monitor/gantt' },
  { id: 'grid', label: 'Grid', icon: HiOutlineViewGrid, path: '/dashboard/live-monitor/grid' },
  { id: '3d-map', label: '3D Map', icon: HiOutlineCube, path: '/dashboard/live-monitor/3d-map' },
];

export default function ViewSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();

  // Only render inside Live Monitor; hidden on every other page.
  if (!location.pathname.startsWith('/dashboard/live-monitor')) {
    return null;
  }

  const activeView =
    views.find((v) => location.pathname.startsWith(v.path))?.id ?? 'taskcard';

  return (
    <div className="view-switcher">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = activeView === view.id;
        return (
          <button
            key={view.id}
            className={`view-switcher__tab ${isActive ? 'active' : ''}`}
            onClick={() => navigate(view.path)}
          >
            {isActive && (
              <motion.div
                className="view-switcher__bg"
                layoutId="viewSwitcherBg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={15} className="view-switcher__icon" />
            <span className="view-switcher__label">{view.label}</span>
          </button>
        );
      })}
    </div>
  );
}
