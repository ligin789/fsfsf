import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlinePlus } from "react-icons/hi";
import OperatorCard from "../components/OperatorCard";
import CreateOperatorModal from "../components/CreateOperatorModal";
import type { Operator } from "../components/OperatorCard";
import initialData from "../data/operators.json";

export default function OperatorListPage() {
  const [operators, setOperators] = useState<Operator[]>(initialData);
  const [showModal, setShowModal] = useState(false);

  const nextId = `OP-${String(operators.length + 1).padStart(3, "0")}`;

  const handleCreate = (newOperator: Operator) => {
    setOperators((prev) => [newOperator, ...prev]);
    setShowModal(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1 className="page-header__title">Operator Onboarding</h1>
          <p className="page-header__subtitle">
            Manage and onboard eVTOL operators into the Velos platform.
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
            New Operator
          </motion.button>
        </div>
      </div>

      {/* Operator Grid */}
      <div className="row g-4">
        {operators.map((operator, index) => (
          <div key={operator.id} className="col-sm-6 col-lg-4 col-xl-3">
            <OperatorCard operator={operator} delay={index * 0.05} />
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <CreateOperatorModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
        nextId={nextId}
      />
    </div>
  );
}
