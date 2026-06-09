import { motion } from 'framer-motion';
import { HiOutlinePlay } from 'react-icons/hi';

interface DiagnosticsCardProps {
  delay?: number;
}

export default function DiagnosticsCard({ delay = 0 }: DiagnosticsCardProps) {
  return (
    <motion.div
      className="diagnostics-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <h3>Pre-Flight Diagnostics</h3>
      <p>Run automated airworthiness checks across the active fleet.</p>

      <motion.button
        className="diagnostics-card__btn"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <HiOutlinePlay size={16} />
        Start Pre-Flight Check
      </motion.button>
    </motion.div>
  );
}
