import { motion } from 'framer-motion';
import {
  HiOutlinePaperAirplane,
  HiOutlineCheckCircle,
  HiOutlineLightningBolt,
  HiOutlineDownload,
} from 'react-icons/hi';
import StatCard from '../../components/dashboard/ui/StatCard';
import ChartCard from '../../components/dashboard/ui/ChartCard';
import HealthCard from '../../components/dashboard/ui/HealthCard';
import DiagnosticsCard from '../../components/dashboard/ui/DiagnosticsCard';
import ActivityTable from '../../components/dashboard/ui/ActivityTable';

export default function Dashboard() {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1 className="page-header__title">Platform Admin Portal</h1>
          <p className="page-header__subtitle">
            Monitor fleet status, flight activity, and vertiport operations in real-time.
          </p>
        </div>
        <div className="page-header__actions">
          <motion.button
            className="btn-innovista btn-innovista--outline"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <HiOutlineDownload size={16} />
            Export Report
          </motion.button>
          <motion.button
            className="btn-innovista btn-innovista--primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Dispatch Flight
          </motion.button>
        </div>
      </div>

      {/* Main Grid: Chart + Side Panels */}
      <div className="row g-4 mb-4">
        {/* Engine Performance Chart */}
        <div className="col-lg-7">
          <ChartCard />

          {/* Stats Row */}
          <div className="row g-4 mt-0">
            <div className="col-sm-4">
              <StatCard
                label="Active Aircraft"
                value="42"
                change="+6 since last shift"
                changeType="up"
                icon={HiOutlinePaperAirplane}
                variant="primary"
                delay={0.15}
              />
            </div>
            <div className="col-sm-4">
              <StatCard
                label="On-Time Departures"
                value="98.6"
                suffix="%"
                subtitle="Target: 97.5%"
                icon={HiOutlineCheckCircle}
                variant="success"
                delay={0.25}
              />
            </div>
            <div className="col-sm-4">
              <StatCard
                label="Avg Battery SoC"
                value="82"
                suffix="%"
                subtitle="Healthy"
                subtitleColor="#10B981"
                icon={HiOutlineLightningBolt}
                variant="info"
                delay={0.35}
              />
            </div>
          </div>
        </div>

        {/* Right Side Panels */}
        <div className="col-lg-5 d-flex flex-column gap-4">
          <HealthCard delay={0.15} />
          <DiagnosticsCard delay={0.25} />
        </div>
      </div>

      {/* Activity Table */}
      <ActivityTable />
    </div>
  );
}
