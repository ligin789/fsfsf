import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiX,
  HiOutlineGlobeAlt,
} from 'react-icons/hi';
import useRegulators from '../hooks/useRegulators';
import RegulatorCard from '../components/RegulatorCard';
import RegulatorOnboardModal from '../components/RegulatorOnboardModal';
import ContactsTab from '../components/ContactsTab';
import UtmTab from '../components/UtmTab';
import {
  pageHeader,
  pageTitle,
  pageSubtitle,
  btn,
  btnPrimary,
  btnDanger,
  banner,
  card,
  tabBar,
  tabItem,
  statusBadge,
} from '../components/uiStyles';
import type { RegulatorDto, RegulatorRequest } from '../store/regulatorTypes';

export default function RegulatorListPage() {
  const {
    regulators,
    contacts,
    utms,
    loadRegulators,
    addRegulator,
    editRegulator,
    removeRegulator,
    loadContacts,
    loadUtms,
    resetRegulatorFeedback,
  } = useRegulators();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'contacts' | 'utm'>('contacts');

  const [modalShow, setModalShow] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget] = useState<RegulatorDto | null>(null);

  useEffect(() => {
    loadRegulators();
  }, [loadRegulators]);

  const selected = useMemo(
    () => regulators.items.find((r) => r.regulatorId === selectedId) || null,
    [regulators.items, selectedId],
  );

  const others = useMemo(
    () => regulators.items.filter((r) => r.regulatorId !== selectedId),
    [regulators.items, selectedId],
  );

  const handleSelect = (r: RegulatorDto) => {
    setSelectedId(r.regulatorId);
    setActiveTab('contacts');
    loadContacts(r.regulatorId);
    loadUtms(r.regulatorId);
  };

  const openCreate = () => {
    resetRegulatorFeedback();
    setModalMode('create');
    setEditTarget(null);
    setModalShow(true);
  };

  const openEdit = (r: RegulatorDto) => {
    resetRegulatorFeedback();
    setModalMode('edit');
    setEditTarget(r);
    setModalShow(true);
  };

  const handleSubmit = (payload: RegulatorRequest) => {
    if (modalMode === 'edit' && editTarget) {
      editRegulator(editTarget.regulatorId, payload);
    } else {
      addRegulator(payload);
    }
    setModalShow(false);
  };

  const handleDelete = (r: RegulatorDto) => {
    if (!window.confirm(`Remove regulator "${r.regulatorName}"?`)) return;
    removeRegulator(r.regulatorId);
    if (selectedId === r.regulatorId) setSelectedId(null);
  };

  return (
    <div>
      <div style={pageHeader}>
        <div>
          <h1 style={pageTitle}>Regulators</h1>
          <p style={pageSubtitle}>
            Onboard regulators and manage their contacts &amp; UTM endpoint
            integrations.
          </p>
        </div>
        <button style={btnPrimary} onClick={openCreate} title="Onboard regulator">
          <HiOutlinePlus size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Onboard
        </button>
      </div>

      {regulators.success && (
        <div style={banner('success')}>{regulators.success}</div>
      )}
      {regulators.error && (
        <div style={banner('error')}>{regulators.error}</div>
      )}
      {(contacts.success || utms.success) && (
        <div style={banner('success')}>
          {contacts.success || utms.success}
        </div>
      )}

      {/* Selected regulator — moved to top with tabs */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.regulatorId}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ ...card, marginBottom: 24 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: '#DBEAFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--app-primary)',
                  }}
                >
                  <HiOutlineGlobeAlt size={28} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: 'var(--app-text)',
                    }}
                  >
                    {selected.regulatorName}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--app-text-subtle)' }}>
                    {selected.regulatorCode} · {selected.countryIso2} ·{' '}
                    {selected.regulatorType}{' '}
                    <span
                      style={{
                        ...statusBadge(selected.onboardingStatus),
                        marginLeft: 6,
                      }}
                    >
                      {selected.onboardingStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={btn} onClick={() => openEdit(selected)}>
                  <HiOutlinePencil size={14} style={{ marginRight: 4 }} />
                  Edit
                </button>
                <button
                  style={btnDanger}
                  onClick={() => handleDelete(selected)}
                >
                  <HiOutlineTrash size={14} style={{ marginRight: 4 }} />
                  Remove
                </button>
                <button
                  style={btn}
                  onClick={() => setSelectedId(null)}
                  title="Close"
                >
                  <HiX size={16} />
                </button>
              </div>
            </div>

            <div style={{ ...tabBar, marginTop: 18 }}>
              <div
                style={tabItem(activeTab === 'contacts')}
                onClick={() => setActiveTab('contacts')}
              >
                Contacts
              </div>
              <div
                style={tabItem(activeTab === 'utm')}
                onClick={() => setActiveTab('utm')}
              >
                UTM Endpoints
              </div>
            </div>

            {activeTab === 'contacts' ? (
              <ContactsTab regulator={selected} />
            ) : (
              <UtmTab regulator={selected} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regulator grid */}
      <div className="row g-3">
        {others.map((r, i) => (
          <div className="col-12 col-sm-6 col-lg-4" key={r.regulatorId}>
            <RegulatorCard
              regulator={r}
              delay={i * 0.04}
              onClick={() => handleSelect(r)}
            />
          </div>
        ))}
        {regulators.items.length === 0 && (
          <div className="col-12">
            <div style={{ ...card, textAlign: 'center', color: 'var(--app-text-subtle)' }}>
              No regulators yet. Click <strong>Onboard</strong> to add one.
            </div>
          </div>
        )}
      </div>

      <RegulatorOnboardModal
        show={modalShow}
        mode={modalMode}
        initial={editTarget}
        onClose={() => setModalShow(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
