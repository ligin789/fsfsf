import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import OperatorSidebar from "./OperatorSidebar";
import OperatorTopbar from "./OperatorTopbar";
import { SidebarProvider, useSidebar } from "../../../hooks/useSidebar";

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
      <OperatorSidebar />
      <div className={`main-wrapper ${collapsed ? "sidebar-collapsed" : ""}`}>
        <OperatorTopbar />
        <main className="main-content">
          <Suspense fallback={<Loader />}>
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function OperatorLayout() {
  return (
    <SidebarProvider>
      <LayoutInner />
    </SidebarProvider>
  );
}
