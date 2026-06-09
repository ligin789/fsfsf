import { motion } from 'framer-motion';
import { HiArrowSmRight, HiOutlinePaperAirplane, HiOutlineLocationMarker, HiOutlineClock, HiOutlineLightningBolt } from 'react-icons/hi';
import type { IconType } from 'react-icons';

interface Activity {
  name: string;
  sub: string;
  icon: IconType;
  iconClass: string;
  status: string;
  operator: string;
  initials: string;
  time: string;
  version: string;
}

const activities: Activity[] = [
  {
    name: 'VEL-204 / ePlane e200x',
    sub: 'KSFO → Downtown Vertiport',
    icon: HiOutlinePaperAirplane,
    iconClass: 'blue',
    status: 'active',
    operator: 'Capt. M. Sterling',
    initials: 'MS',
    time: 'Departed 2 mins ago',
    version: 'Flt VL-204',
  },
  {
    name: 'VEL-118 / ePlane e200x Smart',
    sub: 'Charging at Pad 03',
    icon: HiOutlineLightningBolt,
    iconClass: 'orange',
    status: 'testing',
    operator: 'Capt. S. Chen',
    initials: 'SC',
    time: 'ETA ready 14 mins',
    version: 'SoC 64%',
  },
  {
    name: 'VEL-076 / ePlane e200x Pro',
    sub: 'Manhattan → JFK Heliport',
    icon: HiOutlineLocationMarker,
    iconClass: 'purple',
    status: 'active',
    operator: 'Capt. L. Abraham',
    initials: 'LA',
    time: 'In cruise · 1 hour',
    version: 'Alt 1,200 ft',
  },
  {
    name: 'VEL-321 / ePlane e200x Cargo',
    sub: 'Scheduled Maintenance',
    icon: HiOutlineClock,
    iconClass: 'green',
    status: 'pending',
    operator: 'Tech R. Kapoor',
    initials: 'RK',
    time: 'Hangar B · 3 hours ago',
    version: 'Cycle 412',
  },
];

export default function ActivityTable() {
  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="data-table">
        <div className="data-table__header">
          <div className="data-table__title">
            <h3>Recent Flight Activity</h3>
            <p>Latest aircraft movements and operations log</p>
          </div>
          <a className="data-table__link" href="#!">
            View All Flights <HiArrowSmRight size={18} />
          </a>
        </div>

        <table>
          <thead>
            <tr>
              <th>Aircraft</th>
              <th>Status</th>
              <th>Pilot</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((row, i) => {
              const Icon = row.icon;
              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <td>
                    <div className="data-table__rule-info">
                      <div className={`data-table__rule-icon data-table__rule-icon--${row.iconClass}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="data-table__rule-name">{row.name}</div>
                        <div className="data-table__rule-sub">{row.sub}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge--${row.status}`}>{row.status}</span>
                  </td>
                  <td>
                    <div className="data-table__operator">
                      <div className="data-table__operator-avatar">{row.initials}</div>
                      <span>{row.operator}</span>
                    </div>
                  </td>
                  <td>
                    <div className="data-table__time">
                      {row.time}<br />
                      <span className="data-table__time-version">{row.version}</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
