import { motion } from 'framer-motion';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  icon?: string;
}

export default function PlaceholderPage({ title, subtitle, icon = '📋' }: PlaceholderPageProps) {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">{title}</h1>
        <p className="page-header__subtitle">{subtitle}</p>
      </div>
      <motion.div
        className="chart-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="empty-state">
          <div className="empty-state__icon">{icon}</div>
          <div className="empty-state__title">{title}</div>
          <div className="empty-state__text">This section is under development. Check back soon.</div>
        </div>
      </motion.div>
    </div>
  );
}
