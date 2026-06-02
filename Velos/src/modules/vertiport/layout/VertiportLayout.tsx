import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import VertiportSidebar from "./VertiportSidebar";
import VertiportTopbar from "./VertiportTopbar";
import { SidebarProvider, useSidebar } from "../../../hooks/useSidebar";

// Portal home
const VertiportPortalPage = lazy(() => import("../pages/VertiportPortalPage"));

// Admin pages
const VtmListPage = lazy(() => import("../pages/admin/VtmListPage"));
const VertihubListPage = lazy(() => import("../pages/admin/VertihubListPage"));
const VertihubEnergyListPage = lazy(() => import("../pages/admin/VertihubEnergyListPage"));
const TerminalListPage = lazy(() => import("../pages/admin/TerminalListPage"));
const PadListPage = lazy(() => import("../pages/admin/PadListPage"));
const PadCapabilityListPage = lazy(() => import("../pages/admin/PadCapabilityListPage"));
const OperatingScheduleListPage = lazy(() => import("../pages/admin/OperatingScheduleListPage"));
const NoiseLimitsListPage = lazy(() => import("../pages/admin/NoiseLimitsListPage"));
const ContactListPage = lazy(() => import("../pages/admin/ContactListPage"));
const AuditLogListPage = lazy(() => import("../pages/admin/AuditLogListPage"));
const AirsideZoneListPage = lazy(() => import("../pages/admin/AirsideZoneListPage"));
const AddressListPage = lazy(() => import("../pages/admin/AddressListPage"));

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

function Loader() {
  return (
    <div className="loader">
      <div className="loader__spinner" />
    </div>
  );
}

function LayoutInner() {
  const { collapsed } = useSidebar();

  return (
    <div className="app-layout">
      <VertiportSidebar />
      <div className={`main-wrapper ${collapsed ? "sidebar-collapsed" : ""}`}>
        <VertiportTopbar />
        <main className="main-content">
          <Suspense fallback={<Loader />}>
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Routes>
                <Route index element={<VertiportPortalPage />} />
                <Route path="vtm" element={<VtmListPage />} />
                <Route path="vertihubs" element={<VertihubListPage />} />
                <Route path="vertihub-energy" element={<VertihubEnergyListPage />} />
                <Route path="terminals" element={<TerminalListPage />} />
                <Route path="pads" element={<PadListPage />} />
                <Route path="pad-capabilities" element={<PadCapabilityListPage />} />
                <Route path="operating-schedules" element={<OperatingScheduleListPage />} />
                <Route path="noise-limits" element={<NoiseLimitsListPage />} />
                <Route path="contacts" element={<ContactListPage />} />
                <Route path="audit-logs" element={<AuditLogListPage />} />
                <Route path="airside-zones" element={<AirsideZoneListPage />} />
                <Route path="addresses" element={<AddressListPage />} />
                <Route path="*" element={<VertiportPortalPage />} />
              </Routes>
            </motion.div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function VertiportLayout() {
  return (
    <SidebarProvider>
      <LayoutInner />
    </SidebarProvider>
  );
}
