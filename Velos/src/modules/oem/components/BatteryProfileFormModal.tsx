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
import { Field, SelectInput, SchemaForm } from './FormControls';
import type { FieldSpec } from './FormControls';
import type {
  AircraftBatteryProfileDto,
  AircraftBatteryProfileRequest,
  AircraftTypeDto,
} from '../store/oemTypes';
import {
  SAMPLE_PARTNERS,
  PACK_ROLE,
  CELL_CHEMISTRY,
  CHARGE_PROTOCOL,
} from '../store/oemTypes';

interface Props {
  show: boolean;
  mode: 'create' | 'edit';
  oemId: string;
  aircraftTypes: AircraftTypeDto[];
  initial?: AircraftBatteryProfileDto | null;
  onClose: () => void;
  onSubmit: (payload: AircraftBatteryProfileRequest) => void;
}

const identitySpec: FieldSpec[] = [
  { key: 'specCode', label: 'Spec Code', type: 'text', required: true },
  { key: 'specName', label: 'Spec Name', type: 'text', required: true, span: 6 },
  {
    key: 'packRole',
    label: 'Pack Role',
    type: 'select',
    required: true,
    options: PACK_ROLE,
  },
  {
    key: 'cellChemistry',
    label: 'Cell Chemistry',
    type: 'select',
    required: true,
    options: CELL_CHEMISTRY,
  },
];

const capacitySpec: FieldSpec[] = [
  { key: 'nominalVoltageV', label: 'Nominal Voltage (V)', type: 'number', required: true },
  { key: 'usableCapacityKwh', label: 'Usable Capacity (kWh)', type: 'number', required: true },
  { key: 'grossCapacityKwh', label: 'Gross Capacity (kWh)', type: 'number', required: true },
  { key: 'minSocPct', label: 'Min SOC %', type: 'number', required: true },
  { key: 'maxSocPct', label: 'Max SOC %', type: 'number', required: true },
  { key: 'reserveSocPct', label: 'Reserve SOC %', type: 'number', required: true },
  { key: 'contingencySocPct', label: 'Contingency SOC %', type: 'number', required: true },
  { key: 'alternateSocPct', label: 'Alternate SOC %', type: 'number' },
  { key: 'dispatchMinSocPct', label: 'Dispatch Min SOC %', type: 'number', required: true },
  { key: 'packWeightKg', label: 'Pack Weight (kg)', type: 'number', required: true },
];

const chargeSpec: FieldSpec[] = [
  { key: 'maxChargeRateKw', label: 'Max Charge Rate (kW)', type: 'number', required: true },
  { key: 'maxChargeCRate', label: 'Max Charge C-Rate', type: 'number', required: true },
  { key: 'fastChargeMaxKw', label: 'Fast Charge Max (kW)', type: 'number' },
  { key: 'trickleChargeKw', label: 'Trickle Charge (kW)', type: 'number' },
  {
    key: 'chargeProtocol',
    label: 'Charge Protocol',
    type: 'select',
    required: true,
    options: CHARGE_PROTOCOL,
  },
  { key: 'chargingStandard', label: 'Charging Standard', type: 'text', required: true },
  { key: 'regenMaxKw', label: 'Regen Max (kW)', type: 'number' },
  { key: 'regenBrakingCapable', label: 'Regen Braking Capable', type: 'checkbox' },
];

const thermalSpec: FieldSpec[] = [
  { key: 'minChargeTempC', label: 'Min Charge Temp (°C)', type: 'number', required: true },
  { key: 'maxChargeTempC', label: 'Max Charge Temp (°C)', type: 'number', required: true },
  { key: 'minDischargeTempC', label: 'Min Discharge Temp (°C)', type: 'number', required: true },
  { key: 'maxDischargeTempC', label: 'Max Discharge Temp (°C)', type: 'number', required: true },
  { key: 'thermalRunawayTempC', label: 'Thermal Runaway (°C)', type: 'number', required: true },
  { key: 'thermalMgmtPowerKw', label: 'Thermal Mgmt Power (kW)', type: 'number' },
  { key: 'activeThermalMgmt', label: 'Active Thermal Mgmt', type: 'checkbox' },
];

const lifeSpec: FieldSpec[] = [
  { key: 'designCycleLife', label: 'Design Cycle Life', type: 'number', required: true },
  { key: 'soh80pctThresholdCycles', label: 'SOH80% Threshold Cycles', type: 'number' },
  { key: 'calendarLifeYears', label: 'Calendar Life (yrs)', type: 'number' },
  { key: 'capacityFadePctPer100c', label: 'Fade %/100c', type: 'number' },
  { key: 'sohRemovalThresholdPct', label: 'SOH Removal %', type: 'number', required: true },
  { key: 'effectiveFrom', label: 'Effective From', type: 'date', required: true },
  { key: 'isCurrent', label: 'Is Current', type: 'checkbox' },
];

const allSpecs = [
  ...identitySpec,
  ...capacitySpec,
  ...chargeSpec,
  ...thermalSpec,
  ...lifeSpec,
];

export default function BatteryProfileFormModal({
  show,
  mode,
  oemId,
  aircraftTypes,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [partnerId, setPartnerId] = useState('');
  const [typeId, setTypeId] = useState('');

  useEffect(() => {
    if (show) {
      if (mode === 'edit' && initial) {
        setValues({ ...initial });
        setPartnerId(initial.partnerId ?? '');
        setTypeId(initial.typeId ?? '');
      } else {
        setValues({
          regenBrakingCapable: false,
          activeThermalMgmt: true,
          isCurrent: true,
        });
        setPartnerId('');
        setTypeId('');
      }
    }
  }, [show, mode, initial]);

  if (!show) return null;

  const onChange = (key: string, value: unknown) =>
    setValues((v) => ({ ...v, [key]: value }));

  const requiredOk = allSpecs
    .filter((f) => f.required)
    .every((f) => {
      const v = values[f.key];
      return v !== undefined && v !== '' && v !== null;
    });
  const valid = requiredOk && partnerId && typeId;

  const selectedType = aircraftTypes.find((t) => t.typeId === typeId);

  const submit = () => {
    if (!valid) return;
    onSubmit({
      ...(values as unknown as AircraftBatteryProfileRequest),
      partnerId,
      manufacturer: oemId,
      typeId,
      typeCode: selectedType?.typeCode ?? '',
    });
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <h3 style={modalTitle}>
            {mode === 'edit' ? 'Edit Battery Profile' : 'Add Battery Profile'}
          </h3>
          <button style={btnGhost} onClick={onClose}>
            <HiX size={18} />
          </button>
        </div>

        <div style={modalBody}>
          <h4 style={sectionTitle}>Linkage &amp; Identity</h4>
          <div className="row">
            <Field title="Aircraft Type" required span={6}>
              <SelectInput
                value={typeId}
                onChange={setTypeId}
                options={aircraftTypes.map((t) => ({
                  id: t.typeId,
                  labelText: `${t.modelName} (${t.typeCode})`,
                }))}
                placeholder={
                  aircraftTypes.length
                    ? 'Select aircraft type…'
                    : 'No aircraft types — add one first'
                }
              />
            </Field>
            <Field title="Partner" required span={6}>
              <SelectInput
                value={partnerId}
                onChange={setPartnerId}
                options={SAMPLE_PARTNERS.map((p) => ({
                  id: p.id,
                  labelText: p.label,
                }))}
              />
            </Field>
          </div>
          <SchemaForm spec={identitySpec} values={values} onChange={onChange} />

          <h4 style={sectionTitle}>Capacity &amp; SOC</h4>
          <SchemaForm spec={capacitySpec} values={values} onChange={onChange} />

          <h4 style={sectionTitle}>Charging</h4>
          <SchemaForm spec={chargeSpec} values={values} onChange={onChange} />

          <h4 style={sectionTitle}>Thermal</h4>
          <SchemaForm spec={thermalSpec} values={values} onChange={onChange} />

          <h4 style={sectionTitle}>Life &amp; Validity</h4>
          <SchemaForm spec={lifeSpec} values={values} onChange={onChange} />
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
            {mode === 'edit' ? 'Save' : 'Add Battery Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
