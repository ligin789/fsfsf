import { motion } from 'framer-motion';
import { HiArrowSmUp, HiArrowSmDown } from 'react-icons/hi';
import  type { IconType } from 'react-icons';

interface StatCardProps {
  label: string;
  value: string;
  suffix?: string;
  change?: string;
  changeType?: 'up' | 'down';
  subtitle?: string;
  subtitleColor?: string;
  icon?: IconType;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
  delay?: number;
}

export default function StatCard({ label, value, suffix, change, changeType, subtitle, subtitleColor, icon: Icon, variant = 'primary', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      className="stat-card"
      style={{ '--card-accent': `var(--color-${variant})` } as React.CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}
    >
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        {Icon && (
          <div className={`stat-card__icon stat-card__icon--${variant}`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="stat-card__value">
        {value}
        {suffix && <sup>{suffix}</sup>}
      </div>

      <div className="stat-card__footer">
        {change && (
          <span className={`stat-card__change stat-card__change--${changeType || 'up'}`}>
            {changeType === 'down' ? <HiArrowSmDown size={14} /> : <HiArrowSmUp size={14} />}
            {change}
          </span>
        )}
        {subtitle && <span className="stat-card__subtitle" style={subtitleColor ? { color: subtitleColor } : undefined}>{subtitle}</span>}
      </div>
    </motion.div>
  );
}
