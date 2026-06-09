import { useState } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { btn, btnPrimary, btnDanger, statusBadge, badge, spinnerWrap } from './uiStyles';
import ContactFormModal from './ContactFormModal';
import useRegulators from '../hooks/useRegulators';
import type { ContactDto, ContactRequest, RegulatorDto } from '../store/regulatorTypes';

export default function ContactsTab({ regulator }: { regulator: RegulatorDto }) {
  const { contacts, addContact, editContact, removeContact } = useRegulators();
  const list = contacts.byRegulator[regulator.regulatorId] ?? [];

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [target, setTarget] = useState<ContactDto | null>(null);

  const openCreate = () => {
    setMode('create');
    setTarget(null);
    setShow(true);
  };
  const openEdit = (c: ContactDto) => {
    setMode('edit');
    setTarget(c);
    setShow(true);
  };

  const handleSubmit = (payload: ContactRequest) => {
    if (mode === 'edit' && target) {
      editContact(target.regContactId, payload);
    } else {
      addContact(payload);
    }
    setShow(false);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--app-text-subtle)' }}>
          {list.length} contact{list.length === 1 ? '' : 's'}
        </span>
        <button style={btnPrimary} onClick={openCreate}>
          <HiOutlinePlus size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Add Contact
        </button>
      </div>

      {list.length === 0 ? (
        <div style={spinnerWrap}>No contacts yet. Add the first one.</div>
      ) : (
        <div className="row g-3">
          {list.map((c) => (
            <div className="col-12 col-md-6" key={c.regContactId}>
              <div
                style={{
                  border: '1px solid var(--app-border)',
                  borderRadius: 12,
                  padding: 16,
                  background: 'var(--app-surface)',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 8,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--app-text)' }}>
                      {c.fullName}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--app-text-subtle)' }}>
                      {c.jobTitle || '—'}
                    </div>
                  </div>
                  {c.isPrimaryContact && (
                    <span style={badge('#1E40AF', '#DBEAFE')}>Primary</span>
                  )}
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: 'var(--app-text-strong)' }}>
                  <div>✉️ {c.email}</div>
                  <div>📞 {c.phonePrimary}</div>
                  {c.availableHours && <div>🕓 {c.availableHours}</div>}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={badge('var(--app-text-muted)', 'var(--app-border)')}>{c.contactRole}</span>
                  <span style={badge('var(--app-text-muted)', 'var(--app-border)')}>
                    {c.preferredChannel}
                  </span>
                  <span style={statusBadge(c.contactStatus)}>
                    {c.contactStatus}
                  </span>
                </div>
                <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                  <button style={btn} onClick={() => openEdit(c)}>
                    <HiOutlinePencil size={14} style={{ marginRight: 4 }} />
                    Edit
                  </button>
                  <button
                    style={btnDanger}
                    onClick={() => {
                      if (window.confirm(`Remove contact "${c.fullName}"?`)) {
                        removeContact(c.regContactId, regulator.regulatorId);
                      }
                    }}
                  >
                    <HiOutlineTrash size={14} style={{ marginRight: 4 }} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ContactFormModal
        show={show}
        mode={mode}
        regulatorId={regulator.regulatorId}
        partnerId={regulator.partnerId ?? ''}
        initial={target}
        onClose={() => setShow(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
