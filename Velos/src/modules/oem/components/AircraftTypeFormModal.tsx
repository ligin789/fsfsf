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
import type { AircraftTypeDto, AircraftTypeRequest } from '../store/oemTypes';
import {
  SAMPLE_PARTNERS,
  CERTIFICATION_BASIS,
  AIRWORTHINESS_CATEGORY,
  OPERATIONAL_CATEGORY,
  UAM_CLASS,
  PROPULSION_TYPE,
  VTOL_TOPOLOGY,
  NOISE_CLASS,
  AIRCRAFT_STATUS,
} from '../store/oemTypes';

interface Props {
  show: boolean;
  mode: 'create' | 'edit';
  oemId: string;
  initial?: AircraftTypeDto | null;
  onClose: () => void;
  onSubmit: (payload: AircraftTypeRequest) => void;
}

const identitySpec: FieldSpec[] = [
  { key: 'typeCode', label: 'Type Code', type: 'text', required: true },
  { key: 'modelName', label: 'Model Name', type: 'text', required: true, span: 6 },
  { key: 'variant', label: 'Variant', type: 'text' },
  {
    key: 'certificationBasis',
    label: 'Certification Basis',
    type: 'select',
    required: true,
    options: CERTIFICATION_BASIS,
  },
  {
    key: 'airworthinessCategory',
    label: 'Airworthiness Category',
    type: 'select',
    required: true,
    options: AIRWORTHINESS_CATEGORY,
  },
  {
    key: 'operationalCategory',
    label: 'Operational Category',
    type: 'select',
    required: true,
    options: OPERATIONAL_CATEGORY,
  },
  {
    key: 'uamClass',
    label: 'UAM Class',
    type: 'select',
    required: true,
    options: UAM_CLASS,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: AIRCRAFT_STATUS,
  },
  { key: 'typeCertificateNumber', label: 'TC Number', type: 'text' },
  { key: 'tcIssuingAuthority', label: 'TC Authority', type: 'text' },
  { key: 'tcIssueDate', label: 'TC Issue Date', type: 'date' },
  { key: 'tcExpiryDate', label: 'TC Expiry Date', type: 'date' },
  { key: 'entryIntoServiceDate', label: 'Entry Into Service', type: 'date' },
];

const propulsionSpec: FieldSpec[] = [
  {
    key: 'propulsionType',
    label: 'Propulsion Type',
    type: 'select',
    required: true,
    options: PROPULSION_TYPE,
  },
  {
    key: 'vtolTopology',
    label: 'VTOL Topology',
    type: 'select',
    required: true,
    options: VTOL_TOPOLOGY,
  },
  { key: 'rotorCount', label: 'Rotor Count', type: 'number', required: true },
  { key: 'motorCount', label: 'Motor Count', type: 'number', required: true },
  { key: 'oeiFlightTimeMin', label: 'OEI Flight Time (min)', type: 'number' },
  { key: 'oeiCapable', label: 'OEI Capable', type: 'checkbox' },
  {
    key: 'vtolToFixedTransition',
    label: 'VTOL→Fixed Transition',
    type: 'checkbox',
  },
];

const massSpec: FieldSpec[] = [
  { key: 'mtowKg', label: 'MTOW (kg)', type: 'number', required: true },
  { key: 'mzfwKg', label: 'MZFW (kg)', type: 'number' },
  { key: 'mlwKg', label: 'MLW (kg)', type: 'number' },
  { key: 'oweKg', label: 'OWE (kg)', type: 'number', required: true },
  { key: 'maxPayloadKg', label: 'Max Payload (kg)', type: 'number', required: true },
  {
    key: 'maxPassengerCount',
    label: 'Max Passengers',
    type: 'number',
    required: true,
  },
  { key: 'pilotSeats', label: 'Pilot Seats', type: 'number', required: true },
  {
    key: 'standardPaxWeightKg',
    label: 'Std Pax Weight (kg)',
    type: 'number',
    required: true,
  },
  { key: 'maxBaggageKgPerPax', label: 'Max Baggage/Pax (kg)', type: 'number' },
  { key: 'pilotRequired', label: 'Pilot Required', type: 'checkbox' },
];

const perfSpec: FieldSpec[] = [
  { key: 'vneKts', label: 'VNE (kts)', type: 'number', required: true },
  { key: 'vmoKts', label: 'VMO (kts)', type: 'number', required: true },
  {
    key: 'cruiseSpeedKts',
    label: 'Cruise Speed (kts)',
    type: 'number',
    required: true,
  },
  { key: 'hoverMaxDurationMin', label: 'Hover Max (min)', type: 'number' },
  { key: 'maxWindKts', label: 'Max Wind (kts)', type: 'number', required: true },
  {
    key: 'maxCrosswindKts',
    label: 'Max Crosswind (kts)',
    type: 'number',
    required: true,
  },
  {
    key: 'maxTailwindKts',
    label: 'Max Tailwind (kts)',
    type: 'number',
    required: true,
  },
  {
    key: 'maxDensityAltitudeFt',
    label: 'Max Density Alt (ft)',
    type: 'number',
    required: true,
  },
  { key: 'ceilingFt', label: 'Ceiling (ft)', type: 'number', required: true },
  { key: 'maxRangeNm', label: 'Max Range (nm)', type: 'number', required: true },
  {
    key: 'typicalRangeNm',
    label: 'Typical Range (nm)',
    type: 'number',
    required: true,
  },
  {
    key: 'minTempOpsC',
    label: 'Min Temp Ops (°C)',
    type: 'number',
    required: true,
  },
  {
    key: 'maxTempOpsC',
    label: 'Max Temp Ops (°C)',
    type: 'number',
    required: true,
  },
  {
    key: 'noiseClass',
    label: 'Noise Class',
    type: 'select',
    required: true,
    options: NOISE_CLASS,
  },
  { key: 'maxNoiseEpndb', label: 'Max Noise (EPNdB)', type: 'number' },
  { key: 'co2gPerKm', label: 'CO₂ (g/km)', type: 'number' },
];

const allSpecs = [...identitySpec, ...propulsionSpec, ...massSpec, ...perfSpec];

export default function AircraftTypeFormModal({
  show,
  mode,
  oemId,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [partnerId, setPartnerId] = useState('');

  useEffect(() => {
    if (show) {
      if (mode === 'edit' && initial) {
        setValues({ ...initial });
        setPartnerId(initial.partnerId ?? '');
      } else {
        setValues({
          oeiCapable: false,
          vtolToFixedTransition: false,
          pilotRequired: true,
        });
        setPartnerId('');
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
  const valid = requiredOk && partnerId;

  const submit = () => {
    if (!valid) return;
    onSubmit({
      ...(values as unknown as AircraftTypeRequest),
      partnerId,
      manufacturer: oemId,
    });
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <h3 style={modalTitle}>
            {mode === 'edit' ? 'Edit Aircraft Type' : 'Add Aircraft Type'}
          </h3>
          <button style={btnGhost} onClick={onClose}>
            <HiX size={18} />
          </button>
        </div>

        <div style={modalBody}>
          <h4 style={sectionTitle}>Identity &amp; Certification</h4>
          <div className="row">
            <Field title="Partner" required span={4}>
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

          <h4 style={sectionTitle}>Propulsion</h4>
          <SchemaForm spec={propulsionSpec} values={values} onChange={onChange} />

          <h4 style={sectionTitle}>Mass &amp; Capacity</h4>
          <SchemaForm spec={massSpec} values={values} onChange={onChange} />

          <h4 style={sectionTitle}>Performance &amp; Environment</h4>
          <SchemaForm spec={perfSpec} values={values} onChange={onChange} />
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
            {mode === 'edit' ? 'Save' : 'Add Aircraft Type'}
          </button>
        </div>
      </div>
    </div>
  );
}
