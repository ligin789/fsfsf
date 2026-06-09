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
  sectionTitle,
} from './uiStyles';
import { Field, TextInput, SelectInput } from './FormControls';
import type { MasterDto, MasterRequest } from '../store/oemTypes';
import {
  SAMPLE_PARTNERS,
  OEM_STATUS_OPTIONS,
  LEGAL_ENTITY_TYPES,
} from '../store/oemTypes';

interface Props {
  show: boolean;
  mode: 'create' | 'edit';
  initial?: MasterDto | null;
  onClose: () => void;
  onSubmit: (payload: MasterRequest) => void;
}

const empty: MasterRequest = {
  oemCode: '',
  partnerId: '',
  oemName: '',
  legalEntityType: '',
  registrationNumber: '',
  registrationCountry: '',
  registration_date: '',
  websiteUrl: '',
  oemStatus: 'PENDING',
  createdBy: '00000000-0000-4000-8000-000000000000',
  notes: '',
};

export default function OemOnboardModal({
  show,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<MasterRequest>(empty);

  useEffect(() => {
    if (show) {
      setForm(
        mode === 'edit' && initial ? { ...empty, ...initial } : empty,
      );
    }
  }, [show, mode, initial]);

  if (!show) return null;

  const set = <K extends keyof MasterRequest>(k: K, v: MasterRequest[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const valid =
    form.oemCode &&
    form.oemName &&
    form.partnerId &&
    form.legalEntityType &&
    form.registrationNumber &&
    form.registrationCountry &&
    form.registration_date &&
    form.oemStatus &&
    form.notes;

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <h3 style={modalTitle}>
            {mode === 'edit' ? 'Edit OEM' : 'Onboard OEM'}
          </h3>
          <button style={btnGhost} onClick={onClose}>
            <HiX size={18} />
          </button>
        </div>

        <div style={modalBody}>
          <h4 style={sectionTitle}>OEM Master — Core Credentials</h4>
          <div className="row">
            <Field title="OEM Code" required>
              <TextInput
                value={form.oemCode}
                onChange={(v) => set('oemCode', v)}
                placeholder="e.g. JOBY"
              />
            </Field>
            <Field title="OEM Name" required>
              <TextInput
                value={form.oemName}
                onChange={(v) => set('oemName', v)}
              />
            </Field>
            <Field title="Partner" required>
              <SelectInput
                value={form.partnerId}
                onChange={(v) => set('partnerId', v)}
                options={SAMPLE_PARTNERS.map((p) => ({
                  id: p.id,
                  labelText: p.label,
                }))}
              />
            </Field>
            <Field title="Legal Entity Type" required>
              <SelectInput
                value={form.legalEntityType}
                onChange={(v) => set('legalEntityType', v)}
                options={LEGAL_ENTITY_TYPES.map((t) => ({
                  id: t,
                  labelText: t,
                }))}
              />
            </Field>
            <Field title="Registration Number" required>
              <TextInput
                value={form.registrationNumber}
                onChange={(v) => set('registrationNumber', v)}
              />
            </Field>
            <Field title="Registration Country" required>
              <TextInput
                value={form.registrationCountry}
                onChange={(v) => set('registrationCountry', v)}
              />
            </Field>
            <Field title="Registration Date" required span={4}>
              <TextInput
                type="date"
                value={form.registration_date}
                onChange={(v) => set('registration_date', v)}
              />
            </Field>
            <Field title="OEM Status" required span={4}>
              <SelectInput
                value={form.oemStatus}
                onChange={(v) => set('oemStatus', v)}
                options={OEM_STATUS_OPTIONS.map((s) => ({
                  id: s,
                  labelText: s,
                }))}
              />
            </Field>
            <Field title="Website URL" span={4}>
              <TextInput
                value={form.websiteUrl ?? ''}
                onChange={(v) => set('websiteUrl', v)}
                placeholder="https://"
              />
            </Field>
            <Field title="Notes" required span={12}>
              <TextInput
                value={form.notes}
                onChange={(v) => set('notes', v)}
              />
            </Field>
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
            {mode === 'edit' ? 'Save Changes' : 'Onboard OEM'}
          </button>
        </div>
      </div>
    </div>
  );
}
