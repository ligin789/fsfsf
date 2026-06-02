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
import type { UtmDto, UtmRequest } from '../store/regulatorTypes';
import {
  SAMPLE_PARTNERS,
  SAMPLE_CLUSTERS,
  SAMPLE_UTM_SYSTEMS,
  INTEGRATION_STATUS_OPTIONS,
  OPERATIONAL_SCOPE_OPTIONS,
  COMPLIANCE_STATUS_OPTIONS,
} from '../store/regulatorTypes';

interface Props {
  show: boolean;
  mode: 'create' | 'edit';
  regulatorId: string;
  initial?: UtmDto | null;
  onClose: () => void;
  onSubmit: (payload: UtmRequest) => void;
}

export default function UtmFormModal({
  show,
  mode,
  regulatorId,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const build = (): UtmRequest => ({
    regulatorId,
    utmSystemId: '',
    clusterId: '',
    partnerId: '',
    utmIntegrationEnabled: true,
    integrationStatus: 'ENABLED',
    isPrimary: false,
    integrationPriority: 1,
    isFailover: false,
    operationalScope: 'ALL',
    circuitBreakerEnabled: true,
    supportsFlightIntent: false,
    supportsAuthorisation: false,
    supportsOperationalIntent: false,
    supportsConstraints: false,
    supportsTelemetry: false,
    supportsSubscriptions: false,
    consecutiveFailures: 0,
    slaBreached: false,
    complianceStatus: 'PENDING',
    authScopeOverride: '',
    clientCredentialRef: '',
    mtlsCertRef: '',
    approvalReference: '',
  });

  const [form, setForm] = useState<UtmRequest>(build());

  useEffect(() => {
    if (show) {
      setForm(
        mode === 'edit' && initial
          ? { ...build(), ...initial, regulatorId }
          : build(),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, mode, initial, regulatorId]);

  if (!show) return null;

  const set = <K extends keyof UtmRequest>(k: K, v: UtmRequest[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const valid =
    form.utmSystemId &&
    form.clusterId &&
    form.partnerId &&
    form.integrationStatus &&
    form.operationalScope &&
    form.complianceStatus;

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <h3 style={modalTitle}>
            {mode === 'edit' ? 'Edit UTM Integration' : 'Add UTM Integration'}
          </h3>
          <button style={btnGhost} onClick={onClose}>
            <HiX size={18} />
          </button>
        </div>

        <div style={modalBody}>
          <h4 style={sectionTitle}>Integration Endpoint</h4>
          <div className="row">
            <Field title="UTM System" required>
              <SelectInput
                value={form.utmSystemId}
                onChange={(v) => set('utmSystemId', v)}
                options={SAMPLE_UTM_SYSTEMS.map((u) => ({
                  id: u.id,
                  labelText: u.label,
                }))}
              />
            </Field>
            <Field title="Cluster" required>
              <SelectInput
                value={form.clusterId}
                onChange={(v) => set('clusterId', v)}
                options={SAMPLE_CLUSTERS.map((c) => ({
                  id: c.id,
                  labelText: c.label,
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
            <Field title="Integration Status" required>
              <SelectInput
                value={form.integrationStatus}
                onChange={(v) =>
                  set('integrationStatus', v as UtmRequest['integrationStatus'])
                }
                options={INTEGRATION_STATUS_OPTIONS.map((s) => ({
                  id: s,
                  labelText: s,
                }))}
              />
            </Field>
            <Field title="Operational Scope" required>
              <SelectInput
                value={form.operationalScope}
                onChange={(v) =>
                  set('operationalScope', v as UtmRequest['operationalScope'])
                }
                options={OPERATIONAL_SCOPE_OPTIONS.map((s) => ({
                  id: s,
                  labelText: s,
                }))}
              />
            </Field>
            <Field title="Compliance Status" required>
              <SelectInput
                value={form.complianceStatus}
                onChange={(v) =>
                  set('complianceStatus', v as UtmRequest['complianceStatus'])
                }
                options={COMPLIANCE_STATUS_OPTIONS.map((s) => ({
                  id: s,
                  labelText: s,
                }))}
              />
            </Field>
            <Field title="Integration Priority" span={4}>
              <TextInput
                type="number"
                value={form.integrationPriority}
                onChange={(v) =>
                  set('integrationPriority', Number(v) as never)
                }
              />
            </Field>
            <Field title="Auth Scope Override" span={8}>
              <TextInput
                value={form.authScopeOverride ?? ''}
                onChange={(v) => set('authScopeOverride', v)}
                placeholder="utm.read utm.write"
              />
            </Field>
            <Field title="Client Credential Ref">
              <TextInput
                value={form.clientCredentialRef ?? ''}
                onChange={(v) => set('clientCredentialRef', v)}
                placeholder="vault://…"
              />
            </Field>
            <Field title="mTLS Cert Ref">
              <TextInput
                value={form.mtlsCertRef ?? ''}
                onChange={(v) => set('mtlsCertRef', v)}
              />
            </Field>
            <Field title="Approval Reference" span={12}>
              <TextInput
                value={form.approvalReference ?? ''}
                onChange={(v) => set('approvalReference', v)}
              />
            </Field>
          </div>

          <h4 style={sectionTitle}>Flags &amp; Capabilities</h4>
          <div className="row">
            <div className="col-12 col-md-6">
              <Checkbox
                title="UTM Integration Enabled"
                checked={form.utmIntegrationEnabled}
                onChange={(v) => set('utmIntegrationEnabled', v)}
              />
              <Checkbox
                title="Is Primary"
                checked={form.isPrimary}
                onChange={(v) => set('isPrimary', v)}
              />
              <Checkbox
                title="Is Failover"
                checked={form.isFailover}
                onChange={(v) => set('isFailover', v)}
              />
              <Checkbox
                title="Circuit Breaker Enabled"
                checked={form.circuitBreakerEnabled}
                onChange={(v) => set('circuitBreakerEnabled', v)}
              />
              <Checkbox
                title="SLA Breached"
                checked={form.slaBreached}
                onChange={(v) => set('slaBreached', v)}
              />
            </div>
            <div className="col-12 col-md-6">
              <Checkbox
                title="Supports Flight Intent"
                checked={form.supportsFlightIntent}
                onChange={(v) => set('supportsFlightIntent', v)}
              />
              <Checkbox
                title="Supports Authorisation"
                checked={form.supportsAuthorisation}
                onChange={(v) => set('supportsAuthorisation', v)}
              />
              <Checkbox
                title="Supports Operational Intent"
                checked={form.supportsOperationalIntent}
                onChange={(v) => set('supportsOperationalIntent', v)}
              />
              <Checkbox
                title="Supports Constraints"
                checked={form.supportsConstraints}
                onChange={(v) => set('supportsConstraints', v)}
              />
              <Checkbox
                title="Supports Telemetry"
                checked={form.supportsTelemetry}
                onChange={(v) => set('supportsTelemetry', v)}
              />
              <Checkbox
                title="Supports Subscriptions"
                checked={form.supportsSubscriptions}
                onChange={(v) => set('supportsSubscriptions', v)}
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
            {mode === 'edit' ? 'Save' : 'Add Integration'}
          </button>
        </div>
      </div>
    </div>
  );
}
