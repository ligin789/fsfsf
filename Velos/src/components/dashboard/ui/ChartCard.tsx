import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface BarDataItem {
  name: string;
  value: number;
}

const barData: BarDataItem[] = [
  { name: 'Mon', value: 48 },
  { name: 'Tue', value: 56 },
  { name: 'Wed', value: 72 },
  { name: 'Thu', value: 64 },
  { name: 'Fri', value: 98 },
  { name: 'Sat', value: 82 },
  { name: 'Sun', value: 60 },
];

interface TooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(10px)',
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}>
        <p style={{ color: '#94A3B8', fontSize: '11px', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>
          {payload[0].value} flights/day
        </p>
      </div>
    );
  }
  return null;
};

export default function ChartCard() {
  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="chart-card__header">
        <div className="chart-card__header-left">
          <h3>Flight Operations</h3>
          <p>Weekly flights completed across the fleet</p>
        </div>
        <div className="chart-card__badge">
          LIVE OPS
        </div>
      </div>

      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} barSize={36} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(27, 95, 227, 0.04)' }} />
            <Bar
              dataKey="value"
              fill="#E2E8F0"
              radius={[6, 6, 0, 0]}
              activeBar={{ fill: '#1B5FE3' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
