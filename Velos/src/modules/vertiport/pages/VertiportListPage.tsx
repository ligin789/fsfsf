import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlinePlus } from "react-icons/hi";
import VertiportCard from "../components/VertiportCard";
import CreateVertiportModal from "../components/CreateVertiportModal";
import type { Vertiport } from "../components/VertiportCard";
import initialData from "../data/vertiports.json";

export default function VertiportListPage() {
  const [vertiports, setVertiports] = useState<Vertiport[]>(initialData as Vertiport[]);
  const [showModal, setShowModal] = useState(false);

  const nextId = `VP-${String(vertiports.length + 1).padStart(3, "0")}`;

  const handleCreate = (newVertiport: Vertiport) => {
    setVertiports((prev) => [newVertiport, ...prev]);
    setShowModal(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1 className="page-header__title">Vertiport Onboarding</h1>
          <p className="page-header__subtitle">
            Manage and onboard vertiports into the Velos platform.
          </p>
        </div>
        <div className="page-header__actions">
          <motion.button
            className="btn-innovista btn-innovista--primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
          >
            <HiOutlinePlus size={16} />
            New Vertiport
          </motion.button>
        </div>
      </div>

      {/* Vertiport Grid */}
      <div className="row g-4">
        {vertiports.map((vertiport, index) => (
          <div key={vertiport.vertiportId} className="col-sm-6 col-lg-4 col-xl-3">
            <VertiportCard vertiport={vertiport} delay={index * 0.05} />
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <CreateVertiportModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
        nextId={nextId}
      />
    </div>
  );
}
