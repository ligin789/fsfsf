import { motion } from 'framer-motion';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { statusBadge, badge } from './uiStyles';
import type { RegulatorDto } from '../store/regulatorTypes';

interface Props {
  regulator: RegulatorDto;
  onClick: () => void;
  delay?: number;
}

export default function RegulatorCard({ regulator, onClick, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 10px 22px rgba(0,0,0,0.10)' }}
      onClick={onClick}
      style={{
        background: 'var(--app-surface)',
        borderRadius: 16,
        border: '1px solid var(--app-border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: 20,
        cursor: 'pointer',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: '#DBEAFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--app-primary)',
          }}
        >
          <HiOutlineGlobeAlt size={24} />
        </div>
        <span style={statusBadge(regulator.onboardingStatus)}>
          {regulator.onboardingStatus}
        </span>
      </div>

      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--app-text-strong)',
          margin: '14px 0 4px',
          lineHeight: 1.3,
        }}
      >
        {regulator.regulatorName}
      </h3>
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--app-text-faint)',
          fontWeight: 500,
          margin: 0,
        }}
      >
        {regulator.regulatorCode}
        <span style={{ margin: '0 6px', color: 'var(--app-border)' }}>|</span>
        {regulator.countryIso2}
      </p>

      <div
        style={{
          marginTop: 14,
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
        }}
      >
        <span style={badge('var(--app-text-muted)', 'var(--app-border)')}>
          {regulator.regulatorType}
        </span>
        {regulator.isUtmOwner && (
          <span style={badge('#065F46', '#D1FAE5')}>UTM Owner</span>
        )}
        {regulator.utmFramework && (
          <span style={badge('#1E40AF', '#DBEAFE')}>
            {regulator.utmFramework}
          </span>
        )}
      </div>
    </motion.div>
  );
}
