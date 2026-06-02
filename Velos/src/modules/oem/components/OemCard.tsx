import { motion } from 'framer-motion';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { statusBadge, badge } from './uiStyles';
import type { MasterDto } from '../store/oemTypes';

interface Props {
  oem: MasterDto;
  onClick: () => void;
  delay?: number;
}

export default function OemCard({ oem, onClick, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 10px 22px rgba(0,0,0,0.10)' }}
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        border: '1px solid #E8EDF2',
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
            color: '#2563EB',
          }}
        >
          <HiOutlineOfficeBuilding size={24} />
        </div>
        <span style={statusBadge(oem.oemStatus)}>{oem.oemStatus}</span>
      </div>

      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: '#1E293B',
          margin: '14px 0 4px',
          lineHeight: 1.3,
        }}
      >
        {oem.oemName}
      </h3>
      <p
        style={{
          fontSize: '0.8125rem',
          color: '#94A3B8',
          fontWeight: 500,
          margin: 0,
        }}
      >
        {oem.oemCode}
        <span style={{ margin: '0 6px', color: '#CBD5E1' }}>|</span>
        {oem.registrationCountry}
      </p>

      <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {oem.legalEntityType && (
          <span style={badge('#475569', '#E2E8F0')}>
            {oem.legalEntityType}
          </span>
        )}
        {oem.registrationNumber && (
          <span style={badge('#1E40AF', '#DBEAFE')}>
            {oem.registrationNumber}
          </span>
        )}
      </div>
    </motion.div>
  );
}
