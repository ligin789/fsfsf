import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiX,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';
import useOem from '../hooks/useOem';
import OemCard from '../components/OemCard';
import OemOnboardModal from '../components/OemOnboardModal';
import ContactsTab from '../components/ContactsTab';
import AircraftTypeTab from '../components/AircraftTypeTab';
import BatteryProfileTab from '../components/BatteryProfileTab';
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
import type { MasterDto, MasterRequest } from '../store/oemTypes';

type Tab = 'contacts' | 'types' | 'batteries';

export default function OemListPage() {
  const {
    masters,
    contacts,
    aircraftTypes,
    batteryProfiles,
    loadMasters,
    addMaster,
    editMaster,
    removeMaster,
    loadContacts,
    loadTypes,
    loadBatteries,
    resetMasterFeedback,
  } = useOem();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('contacts');

  const [modalShow, setModalShow] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget] = useState<MasterDto | null>(null);

  useEffect(() => {
    loadMasters();
  }, [loadMasters]);

  const selected = useMemo(
    () => masters.items.find((m) => m.oemId === selectedId) || null,
    [masters.items, selectedId],
  );
  const others = useMemo(
    () => masters.items.filter((m) => m.oemId !== selectedId),
    [masters.items, selectedId],
  );

  const handleSelect = (m: MasterDto) => {
    setSelectedId(m.oemId);
    setActiveTab('contacts');
    loadContacts(m.oemId);
    loadTypes(m.oemId);
    loadBatteries(m.oemId);
  };

  const openCreate = () => {
    resetMasterFeedback();
    setModalMode('create');
    setEditTarget(null);
    setModalShow(true);
  };
  const openEdit = (m: MasterDto) => {
    resetMasterFeedback();
    setModalMode('edit');
    setEditTarget(m);
    setModalShow(true);
  };

  const handleSubmit = (payload: MasterRequest) => {
    if (modalMode === 'edit' && editTarget) {
      editMaster(editTarget.oemId, payload);
    } else {
      addMaster(payload);
    }
    setModalShow(false);
  };

  const handleDelete = (m: MasterDto) => {
    if (!window.confirm(`Remove OEM "${m.oemName}"?`)) return;
    removeMaster(m.oemId);
    if (selectedId === m.oemId) setSelectedId(null);
  };

  const anyFeedback =
    contacts.success || aircraftTypes.success || batteryProfiles.success;

  return (
    <div>
      <div style={pageHeader}>
        <div>
          <h1 style={pageTitle}>OEM Onboarding</h1>
          <p style={pageSubtitle}>
            Onboard OEMs (core credentials) and manage their contacts, aircraft
            types &amp; battery profiles.
          </p>
        </div>
        <button style={btnPrimary} onClick={openCreate} title="Onboard OEM">
          <HiOutlinePlus size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Onboard
        </button>
      </div>

      {masters.success && <div style={banner('success')}>{masters.success}</div>}
      {masters.error && <div style={banner('error')}>{masters.error}</div>}
      {anyFeedback && <div style={banner('success')}>{anyFeedback}</div>}

      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.oemId}
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
                  <HiOutlineOfficeBuilding size={28} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: 'var(--app-text)',
                    }}
                  >
                    {selected.oemName}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--app-text-subtle)' }}>
                    {selected.oemCode} · {selected.registrationCountry} ·{' '}
                    {selected.legalEntityType}{' '}
                    <span
                      style={{
                        ...statusBadge(selected.oemStatus),
                        marginLeft: 6,
                      }}
                    >
                      {selected.oemStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={btn} onClick={() => openEdit(selected)}>
                  <HiOutlinePencil size={14} style={{ marginRight: 4 }} />
                  Edit
                </button>
                <button style={btnDanger} onClick={() => handleDelete(selected)}>
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
                style={tabItem(activeTab === 'types')}
                onClick={() => setActiveTab('types')}
              >
                Aircraft Types
              </div>
              <div
                style={tabItem(activeTab === 'batteries')}
                onClick={() => setActiveTab('batteries')}
              >
                Battery Profiles
              </div>
            </div>

            {activeTab === 'contacts' && <ContactsTab oem={selected} />}
            {activeTab === 'types' && <AircraftTypeTab oem={selected} />}
            {activeTab === 'batteries' && <BatteryProfileTab oem={selected} />}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="row g-3">
        {others.map((m, i) => (
          <div className="col-12 col-sm-6 col-lg-4" key={m.oemId}>
            <OemCard oem={m} delay={i * 0.04} onClick={() => handleSelect(m)} />
          </div>
        ))}
        {masters.items.length === 0 && (
          <div className="col-12">
            <div style={{ ...card, textAlign: 'center', color: 'var(--app-text-subtle)' }}>
              No OEMs yet. Click <strong>Onboard</strong> to add one.
            </div>
          </div>
        )}
      </div>

      <OemOnboardModal
        show={modalShow}
        mode={modalMode}
        initial={editTarget}
        onClose={() => setModalShow(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
