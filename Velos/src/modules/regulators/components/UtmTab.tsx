import { useState } from 'react';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineExternalLink,
} from 'react-icons/hi';
import {
  btn,
  btnPrimary,
  btnDanger,
  btnGhost,
  statusBadge,
  badge,
  linkTile,
  spinnerWrap,
} from './uiStyles';
import UtmFormModal from './UtmFormModal';
import useRegulators from '../hooks/useRegulators';
import type { UtmDto, UtmRequest, RegulatorDto } from '../store/regulatorTypes';
import { SAMPLE_UTM_SYSTEMS, SAMPLE_CLUSTERS } from '../store/regulatorTypes';

const systemLabel = (id?: string) =>
  SAMPLE_UTM_SYSTEMS.find((s) => s.id === id)?.label || id || 'Unknown UTM';
const clusterLabel = (id?: string) =>
  SAMPLE_CLUSTERS.find((c) => c.id === id)?.label || id || '—';

export default function UtmTab({ regulator }: { regulator: RegulatorDto }) {
  const { utms, addUtm, editUtm, removeUtm } = useRegulators();
  const list = utms.byRegulator[regulator.regulatorId] ?? [];

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [target, setTarget] = useState<UtmDto | null>(null);

  const openCreate = () => {
    setMode('create');
    setTarget(null);
    setShow(true);
  };
  const openEdit = (u: UtmDto) => {
    setMode('edit');
    setTarget(u);
    setShow(true);
  };

  const handleSubmit = (payload: UtmRequest) => {
    if (mode === 'edit' && target) {
      editUtm(target.regulatorUtmId, payload);
    } else {
      addUtm(payload);
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
        <span style={{ fontSize: 13, color: '#64748B' }}>
          {list.length} UTM integration{list.length === 1 ? '' : 's'} — a
          regulator can connect to multiple UTM endpoints
        </span>
        <button style={btnPrimary} onClick={openCreate}>
          <HiOutlinePlus size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Add UTM Endpoint
        </button>
      </div>

      {list.length === 0 ? (
        <div style={spinnerWrap}>No UTM endpoints linked yet.</div>
      ) : (
        list.map((u) => (
          <div style={linkTile} key={u.regulatorUtmId}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
                flexShrink: 0,
              }}
            >
              <HiOutlineExternalLink size={20} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontWeight: 700, color: '#0F172A' }}>
                  {systemLabel(u.utmSystemId)}
                </span>
                {u.isPrimary && (
                  <span style={badge('#1E40AF', '#DBEAFE')}>Primary</span>
                )}
                {u.isFailover && (
                  <span style={badge('#92400E', '#FEF3C7')}>Failover</span>
                )}
                <span style={statusBadge(u.integrationStatus)}>
                  {u.integrationStatus}
                </span>
                <span style={statusBadge(u.complianceStatus)}>
                  {u.complianceStatus}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#64748B',
                  marginTop: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {clusterLabel(u.clusterId)} · scope {u.operationalScope} ·
                priority {u.integrationPriority}
                {u.clientCredentialRef ? ` · ${u.clientCredentialRef}` : ''}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {regulator.websiteUrl && (
                <a
                  href={regulator.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...btnGhost, textDecoration: 'none' }}
                  title="Open regulator site"
                >
                  <HiOutlineExternalLink size={15} />
                </a>
              )}
              <button style={btn} onClick={() => openEdit(u)}>
                <HiOutlinePencil size={14} />
              </button>
              <button
                style={btnDanger}
                onClick={() => {
                  if (window.confirm('Remove this UTM integration?')) {
                    removeUtm(u.regulatorUtmId, regulator.regulatorId);
                  }
                }}
              >
                <HiOutlineTrash size={14} />
              </button>
            </div>
          </div>
        ))
      )}

      <UtmFormModal
        show={show}
        mode={mode}
        regulatorId={regulator.regulatorId}
        initial={target}
        onClose={() => setShow(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
