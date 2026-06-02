import { useState } from 'react';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePaperAirplane,
} from 'react-icons/hi';
import {
  btn,
  btnPrimary,
  btnDanger,
  statusBadge,
  badge,
  linkTile,
  spinnerWrap,
} from './uiStyles';
import AircraftTypeFormModal from './AircraftTypeFormModal';
import useOem from '../hooks/useOem';
import type { AircraftTypeDto, AircraftTypeRequest, MasterDto } from '../store/oemTypes';

export default function AircraftTypeTab({ oem }: { oem: MasterDto }) {
  const { aircraftTypes, addType, editType, removeType } = useOem();
  const list = aircraftTypes.byOem[oem.oemId] ?? [];

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [target, setTarget] = useState<AircraftTypeDto | null>(null);

  const openCreate = () => {
    setMode('create');
    setTarget(null);
    setShow(true);
  };
  const openEdit = (t: AircraftTypeDto) => {
    setMode('edit');
    setTarget(t);
    setShow(true);
  };

  const handleSubmit = (payload: AircraftTypeRequest) => {
    if (mode === 'edit' && target) {
      editType(oem.oemId, target.typeId, payload);
    } else {
      addType(oem.oemId, payload);
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
          {list.length} aircraft type{list.length === 1 ? '' : 's'}
        </span>
        <button style={btnPrimary} onClick={openCreate}>
          <HiOutlinePlus size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Add Aircraft Type
        </button>
      </div>

      {list.length === 0 ? (
        <div style={spinnerWrap}>No aircraft types yet.</div>
      ) : (
        list.map((t) => (
          <div style={linkTile} key={t.typeId}>
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
              <HiOutlinePaperAirplane size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontWeight: 700, color: '#0F172A' }}>
                  {t.modelName}
                </span>
                <span style={badge('#475569', '#E2E8F0')}>{t.typeCode}</span>
                {t.uamClass && (
                  <span style={badge('#1E40AF', '#DBEAFE')}>{t.uamClass}</span>
                )}
                {t.status && (
                  <span style={statusBadge(t.status)}>{t.status}</span>
                )}
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
                {t.propulsionType} · {t.vtolTopology} · MTOW {t.mtowKg}kg ·{' '}
                {t.maxPassengerCount} pax · {t.maxRangeNm}nm
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button style={btn} onClick={() => openEdit(t)}>
                <HiOutlinePencil size={14} />
              </button>
              <button
                style={btnDanger}
                onClick={() => {
                  if (window.confirm(`Remove aircraft type "${t.modelName}"?`)) {
                    removeType(oem.oemId, t.typeId);
                  }
                }}
              >
                <HiOutlineTrash size={14} />
              </button>
            </div>
          </div>
        ))
      )}

      <AircraftTypeFormModal
        show={show}
        mode={mode}
        oemId={oem.oemId}
        initial={target}
        onClose={() => setShow(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
