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
import { Field, TextInput, SelectInput, Checkbox } from './FormControls';
import type { RegulatorDto, RegulatorRequest } from '../store/regulatorTypes';
import {
  SAMPLE_PARTNERS,
  SAMPLE_CLUSTERS,
  REGULATOR_TYPE_OPTIONS,
  ONBOARDING_STATUS_OPTIONS,
} from '../store/regulatorTypes';

interface Props {
  show: boolean;
  mode: 'create' | 'edit';
  initial?: RegulatorDto | null;
  onClose: () => void;
  onSubmit: (payload: RegulatorRequest) => void;
}

const emptyForm: RegulatorRequest = {
  regulatorCode: '',
  partnerId: '',
  regulatorName: '',
  regulatorType: '',
  clusterIds: [],
  primaryClusterId: '',
  countryIso2: '',
  legalBasis: '',
  websiteUrl: '',
  isUtmOwner: false,
  utmFramework: '',
  utmAuthorityLevel: '',
  usspDesignationRequired: false,
  flightIntentRequired: false,
  intentSubmissionLeadHours: 24,
  autonomousOpsPermitted: false,
  maxUtmAltitudeFtAgl: undefined,
  opsEmail: '',
  opsPhone: '',
  emergencyContact: '',
  onboardingStatus: 'PENDING',
  notes: '',
};

export default function RegulatorOnboardModal({
  show,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<RegulatorRequest>(emptyForm);

  useEffect(() => {
    if (show) {
      setForm(
        mode === 'edit' && initial
          ? { ...emptyForm, ...initial }
          : emptyForm,
      );
    }
  }, [show, mode, initial]);

  if (!show) return null;

  const set = <K extends keyof RegulatorRequest>(
    k: K,
    v: RegulatorRequest[K],
  ) => setForm((f) => ({ ...f, [k]: v }));

  const toggleCluster = (id: string) => {
    setForm((f) => {
      const has = f.clusterIds.includes(id);
      return {
        ...f,
        clusterIds: has
          ? f.clusterIds.filter((c) => c !== id)
          : [...f.clusterIds, id],
      };
    });
  };

  const valid =
    form.regulatorCode &&
    form.regulatorName &&
    form.regulatorType &&
    form.partnerId &&
    form.primaryClusterId &&
    form.clusterIds.length > 0 &&
    form.countryIso2 &&
    form.onboardingStatus;

  const submit = () => {
    if (!valid) return;
    onSubmit({
      ...form,
      intentSubmissionLeadHours: Number(form.intentSubmissionLeadHours) || 0,
      maxUtmAltitudeFtAgl: form.maxUtmAltitudeFtAgl
        ? Number(form.maxUtmAltitudeFtAgl)
        : undefined,
    });
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <h3 style={modalTitle}>
            {mode === 'edit' ? 'Edit Regulator' : 'Onboard Regulator'}
          </h3>
          <button style={btnGhost} onClick={onClose}>
            <HiX size={18} />
          </button>
        </div>

        <div style={modalBody}>
          <h4 style={sectionTitle}>Identity</h4>
          <div className="row">
            <Field title="Regulator Code" required>
              <TextInput
                value={form.regulatorCode}
                onChange={(v) => set('regulatorCode', v)}
                placeholder="e.g. UAE-GCAA"
              />
            </Field>
            <Field title="Regulator Name" required>
              <TextInput
                value={form.regulatorName}
                onChange={(v) => set('regulatorName', v)}
              />
            </Field>
            <Field title="Regulator Type" required>
              <SelectInput
                value={form.regulatorType}
                onChange={(v) => set('regulatorType', v)}
                options={REGULATOR_TYPE_OPTIONS.map((t) => ({
                  id: t,
                  labelText: t,
                }))}
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
            <Field title="Country ISO2" required span={3}>
              <TextInput
                value={form.countryIso2}
                onChange={(v) => set('countryIso2', v.toUpperCase().slice(0, 2))}
                placeholder="AE"
              />
            </Field>
            <Field title="Onboarding Status" required span={3}>
              <SelectInput
                value={form.onboardingStatus}
                onChange={(v) => set('onboardingStatus', v)}
                options={ONBOARDING_STATUS_OPTIONS.map((s) => ({
                  id: s,
                  labelText: s,
                }))}
              />
            </Field>
            <Field title="Website URL">
              <TextInput
                value={form.websiteUrl ?? ''}
                onChange={(v) => set('websiteUrl', v)}
                placeholder="https://"
              />
            </Field>
          </div>

          <h4 style={sectionTitle}>Coverage</h4>
          <div className="row">
            <Field title="Primary Cluster" required>
              <SelectInput
                value={form.primaryClusterId}
                onChange={(v) => set('primaryClusterId', v)}
                options={SAMPLE_CLUSTERS.map((c) => ({
                  id: c.id,
                  labelText: c.label,
                }))}
              />
            </Field>
            <Field title="Clusters" required span={6}>
              <div
                style={{
                  border: '1px solid var(--app-border)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  background: 'var(--app-surface-subtle)',
                }}
              >
                {SAMPLE_CLUSTERS.map((c) => (
                  <Checkbox
                    key={c.id}
                    title={c.label}
                    checked={form.clusterIds.includes(c.id)}
                    onChange={() => toggleCluster(c.id)}
                  />
                ))}
              </div>
            </Field>
            <Field title="Legal Basis" span={12}>
              <TextInput
                value={form.legalBasis ?? ''}
                onChange={(v) => set('legalBasis', v)}
              />
            </Field>
          </div>

          <h4 style={sectionTitle}>UTM Policy</h4>
          <div className="row">
            <Field title="UTM Framework">
              <TextInput
                value={form.utmFramework ?? ''}
                onChange={(v) => set('utmFramework', v)}
                placeholder="U-Space / UTM"
              />
            </Field>
            <Field title="UTM Authority Level">
              <TextInput
                value={form.utmAuthorityLevel ?? ''}
                onChange={(v) => set('utmAuthorityLevel', v)}
                placeholder="NATIONAL"
              />
            </Field>
            <Field title="Intent Submission Lead (hrs)" required span={4}>
              <TextInput
                type="number"
                value={form.intentSubmissionLeadHours}
                onChange={(v) =>
                  set('intentSubmissionLeadHours', Number(v) as never)
                }
              />
            </Field>
            <Field title="Max UTM Altitude (ft AGL)" span={4}>
              <TextInput
                type="number"
                value={form.maxUtmAltitudeFtAgl ?? ''}
                onChange={(v) =>
                  set('maxUtmAltitudeFtAgl', (v ? Number(v) : undefined) as never)
                }
              />
            </Field>
            <div className="col-12 col-md-4">
              <Checkbox
                title="Is UTM Owner"
                checked={form.isUtmOwner}
                onChange={(v) => set('isUtmOwner', v)}
              />
              <Checkbox
                title="USSP Designation Required"
                checked={form.usspDesignationRequired}
                onChange={(v) => set('usspDesignationRequired', v)}
              />
              <Checkbox
                title="Flight Intent Required"
                checked={form.flightIntentRequired}
                onChange={(v) => set('flightIntentRequired', v)}
              />
              <Checkbox
                title="Autonomous Ops Permitted"
                checked={form.autonomousOpsPermitted}
                onChange={(v) => set('autonomousOpsPermitted', v)}
              />
            </div>
          </div>

          <h4 style={sectionTitle}>Operations Contact</h4>
          <div className="row">
            <Field title="Ops Email">
              <TextInput
                value={form.opsEmail ?? ''}
                onChange={(v) => set('opsEmail', v)}
              />
            </Field>
            <Field title="Ops Phone">
              <TextInput
                value={form.opsPhone ?? ''}
                onChange={(v) => set('opsPhone', v)}
              />
            </Field>
            <Field title="Emergency Contact" span={12}>
              <TextInput
                value={form.emergencyContact ?? ''}
                onChange={(v) => set('emergencyContact', v)}
              />
            </Field>
            <Field title="Notes" span={12}>
              <TextInput
                value={form.notes ?? ''}
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
            onClick={submit}
          >
            {mode === 'edit' ? 'Save Changes' : 'Onboard Regulator'}
          </button>
        </div>
      </div>
    </div>
  );
}
