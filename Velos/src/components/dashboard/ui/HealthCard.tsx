import { motion } from 'framer-motion';
import { HiShieldCheck } from 'react-icons/hi';

interface HealthItem {
  label: string;
  status: string;
  statusClass: string;
  fill: number;
  fillClass: string;
}

const healthItems: HealthItem[] = [
  { label: 'Fleet Airworthiness', status: 'Stable', statusClass: 'stable', fill: 92, fillClass: 'primary' },
  { label: 'Vertiport Charging', status: 'Optimal', statusClass: 'optimal', fill: 97, fillClass: 'success' },
];

interface HealthCardProps {
  delay?: number;
}

export default function HealthCard({ delay = 0 }: HealthCardProps) {
  return (
    <motion.div
      className="health-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="health-card__header">
        <div className="health-card__header-icon">
          <HiShieldCheck size={20} />
        </div>
        <div className="health-card__header-text">
          <h3>Fleet Health</h3>
          <p>All aircraft systems nominal</p>
        </div>
      </div>

      {healthItems.map((item, i) => (
        <div key={i}>
          <div className="health-card__item">
            <span className="health-card__item-label">{item.label}</span>
            <span className={`health-card__item-status health-card__item-status--${item.statusClass}`}>
              {item.status}
            </span>
          </div>
          <div className="health-card__bar">
            <motion.div
              className={`health-card__bar-fill health-card__bar-fill--${item.fillClass}`}
              initial={{ width: 0 }}
              animate={{ width: `${item.fill}%` }}
              transition={{ duration: 1.2, delay: delay + 0.3 + i * 0.15, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </motion.div>
  );
}
