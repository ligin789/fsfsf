import { useState } from 'react';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineLightningBolt,
} from 'react-icons/hi';
import {
  btn,
  btnPrimary,
  btnDanger,
  badge,
  linkTile,
  spinnerWrap,
} from './uiStyles';
import BatteryProfileFormModal from './BatteryProfileFormModal';
import useOem from '../hooks/useOem';
import type {
  AircraftBatteryProfileDto,
  AircraftBatteryProfileRequest,
  MasterDto,
} from '../store/oemTypes';

export default function BatteryProfileTab({ oem }: { oem: MasterDto }) {
  const {
    batteryProfiles,
    aircraftTypes,
    addBattery,
    editBattery,
    removeBattery,
  } = useOem();
  const list = batteryProfiles.byOem[oem.oemId] ?? [];
  const types = aircraftTypes.byOem[oem.oemId] ?? [];

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [target, setTarget] = useState<AircraftBatteryProfileDto | null>(null);

  const openCreate = () => {
    setMode('create');
    setTarget(null);
    setShow(true);
  };
  const openEdit = (b: AircraftBatteryProfileDto) => {
    setMode('edit');
    setTarget(b);
    setShow(true);
  };

  const handleSubmit = (payload: AircraftBatteryProfileRequest) => {
    if (mode === 'edit' && target) {
      editBattery(oem.oemId, target.batterySpecId, payload);
    } else {
      addBattery(oem.oemId, payload);
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
          {list.length} battery profile{list.length === 1 ? '' : 's'}
        </span>
        <button style={btnPrimary} onClick={openCreate}>
          <HiOutlinePlus size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Add Battery Profile
        </button>
      </div>

      {list.length === 0 ? (
        <div style={spinnerWrap}>No battery profiles yet.</div>
      ) : (
        list.map((b) => (
          <div style={linkTile} key={b.batterySpecId}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#15803D',
                flexShrink: 0,
              }}
            >
              <HiOutlineLightningBolt size={20} />
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
                <span style={{ fontWeight: 700, color: 'var(--app-text)' }}>
                  {b.specName}
                </span>
                <span style={badge('var(--app-text-muted)', 'var(--app-border)')}>{b.specCode}</span>
                {b.packRole && (
                  <span style={badge('#1E40AF', '#DBEAFE')}>{b.packRole}</span>
                )}
                {b.isCurrent && (
                  <span style={badge('#065F46', '#D1FAE5')}>Current</span>
                )}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--app-text-subtle)',
                  marginTop: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {b.cellChemistry} · {b.typeCode} · {b.usableCapacityKwh}kWh ·{' '}
                {b.nominalVoltageV}V · {b.packWeightKg}kg
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button style={btn} onClick={() => openEdit(b)}>
                <HiOutlinePencil size={14} />
              </button>
              <button
                style={btnDanger}
                onClick={() => {
                  if (window.confirm(`Remove battery profile "${b.specName}"?`)) {
                    removeBattery(oem.oemId, b.batterySpecId);
                  }
                }}
              >
                <HiOutlineTrash size={14} />
              </button>
            </div>
          </div>
        ))
      )}

      <BatteryProfileFormModal
        show={show}
        mode={mode}
        oemId={oem.oemId}
        aircraftTypes={types}
        initial={target}
        onClose={() => setShow(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
