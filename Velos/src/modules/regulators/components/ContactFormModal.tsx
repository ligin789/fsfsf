import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import {
  modalOverlay,
  modalBox,
  modalHeader,
  modalTitle,
  modalBody,
  modalFooter,
  btn,
  btnPrimary,
  btnGhost,
} from './uiStyles';
import { Field, TextInput, SelectInput, Checkbox } from './FormControls';
import type { ContactDto, ContactRequest } from '../store/regulatorTypes';
import {
  CONTACT_ROLE_OPTIONS,
  PREFERRED_CHANNEL_OPTIONS,
  CONTACT_STATUS_OPTIONS,
} from '../store/regulatorTypes';

interface Props {
  show: boolean;
  mode: 'create' | 'edit';
  regulatorId: string;
  partnerId: string;
  initial?: ContactDto | null;
  onClose: () => void;
  onSubmit: (payload: ContactRequest) => void;
}

export default function ContactFormModal({
  show,
  mode,
  regulatorId,
  partnerId,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const build = (): ContactRequest => ({
    regulatorId,
    partnerId,
    contactRole: '',
    fullName: '',
    jobTitle: '',
    email: '',
    phonePrimary: '',
    phoneSecondary: '',
    isPrimaryContact: false,
    availableHours: '',
    preferredChannel: 'EMAIL',
    contactStatus: 'ACTIVE',
  });

  const [form, setForm] = useState<ContactRequest>(build());

  useEffect(() => {
    if (show) {
      setForm(
        mode === 'edit' && initial
          ? { ...build(), ...initial, regulatorId, partnerId }
          : build(),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, mode, initial, regulatorId, partnerId]);

  if (!show) return null;

  const set = <K extends keyof ContactRequest>(k: K, v: ContactRequest[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const valid =
    form.contactRole &&
    form.fullName &&
    form.email &&
    form.phonePrimary &&
    form.preferredChannel &&
    form.contactStatus;

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div
        style={{ ...modalBox, maxWidth: 620 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={modalHeader}>
          <h3 style={modalTitle}>
            {mode === 'edit' ? 'Edit Contact' : 'Add Contact'}
          </h3>
          <button style={btnGhost} onClick={onClose}>
            <HiX size={18} />
          </button>
        </div>

        <div style={modalBody}>
          <div className="row">
            <Field title="Full Name" required>
              <TextInput
                value={form.fullName}
                onChange={(v) => set('fullName', v)}
              />
            </Field>
            <Field title="Job Title">
              <TextInput
                value={form.jobTitle ?? ''}
                onChange={(v) => set('jobTitle', v)}
              />
            </Field>
            <Field title="Contact Role" required>
              <SelectInput
                value={form.contactRole}
                onChange={(v) => set('contactRole', v)}
                options={CONTACT_ROLE_OPTIONS.map((r) => ({
                  id: r,
                  labelText: r,
                }))}
              />
            </Field>
            <Field title="Status" required>
              <SelectInput
                value={form.contactStatus}
                onChange={(v) => set('contactStatus', v)}
                options={CONTACT_STATUS_OPTIONS.map((s) => ({
                  id: s,
                  labelText: s,
                }))}
              />
            </Field>
            <Field title="Email" required>
              <TextInput
                type="email"
                value={form.email}
                onChange={(v) => set('email', v)}
              />
            </Field>
            <Field title="Preferred Channel" required>
              <SelectInput
                value={form.preferredChannel}
                onChange={(v) => set('preferredChannel', v)}
                options={PREFERRED_CHANNEL_OPTIONS.map((c) => ({
                  id: c,
                  labelText: c,
                }))}
              />
            </Field>
            <Field title="Phone Primary" required>
              <TextInput
                value={form.phonePrimary}
                onChange={(v) => set('phonePrimary', v)}
              />
            </Field>
            <Field title="Phone Secondary">
              <TextInput
                value={form.phoneSecondary ?? ''}
                onChange={(v) => set('phoneSecondary', v)}
              />
            </Field>
            <Field title="Available Hours" span={8}>
              <TextInput
                value={form.availableHours ?? ''}
                onChange={(v) => set('availableHours', v)}
                placeholder="08:00-17:00 GST"
              />
            </Field>
            <div className="col-12 col-md-4" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Checkbox
                title="Primary Contact"
                checked={form.isPrimaryContact}
                onChange={(v) => set('isPrimaryContact', v)}
              />
            </div>
          </div>
        </div>

        <div style={modalFooter}>
          <button style={btn} onClick={onClose}>
            Cancel
          </button>
          <button
            style={{ ...btnPrimary, opacity: valid ? 1 : 0.5 }}
            disabled={!valid}
            onClick={() => valid && onSubmit(form)}
          >
            {mode === 'edit' ? 'Save' : 'Add Contact'}
          </button>
        </div>
      </div>
    </div>
  );
}
