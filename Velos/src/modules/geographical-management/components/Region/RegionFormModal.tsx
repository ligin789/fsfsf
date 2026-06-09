import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import GeoInput from '../Map/GeoInput';
import '../geoModal.css';
import {
  btn,
  btnPrimary,
  input,
  label,
  select as selectStyle,
} from '../uiStyles';
import {
  REGION_STATUS_OPTIONS,
  type CreateRegionDTO,
  type OperatingClusterDTO,
  type RegionDTO,
  type UpdateRegionDTO,
} from '../../store/geographicalTypes';
import {
  emptyFeatureCollection,
  featureCollectionToWkt,
  wktToFeatureCollection,
  type GeoFeatureCollection,
} from '../../utils/geojsonUtils';

interface Props {
  show: boolean;
  mode: 'create' | 'edit';
  initial?: RegionDTO | null;
  clusters: OperatingClusterDTO[];
  /** Optional preselected cluster (used when launching from a parent context). */
  defaultClusterId?: string;
  loading?: boolean;
  currentUserId?: string;
  onClose: () => void;
  onSubmitCreate: (payload: CreateRegionDTO) => void;
  onSubmitUpdate: (payload: UpdateRegionDTO) => void;
}

const DEFAULT_USER = '00000000-0000-0000-0000-000000000000';

export default function RegionFormModal({
  show,
  mode,
  initial,
  clusters,
  defaultClusterId,
  loading,
  currentUserId,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: Props) {
  const [regionCode, setRegionCode] = useState('');
  const [regionName, setRegionName] = useState('');
  const [clusterId, setClusterId] = useState('');
  const [altitudeFloorFtAmsl, setAltitudeFloorFtAmsl] = useState<number | ''>(0);
  const [altitudeCeilingFtAmsl, setAltitudeCeilingFtAmsl] = useState<number | ''>(1200);
  const [responsibleAtcUnit, setResponsibleAtcUnit] = useState('');
  const [airspaceClass, setAirspaceClass] = useState('G');
  const [uspaceZoneId, setUspaceZoneId] = useState('');
  const [maxFleetSize, setMaxFleetSize] = useState<number | ''>('');
  const [wxOverrideEnabled, setWxOverrideEnabled] = useState(true);
  const [perfOverrideEnabled, setPerfOverrideEnabled] = useState(true);
  const [regionStatus, setRegionStatus] = useState<typeof REGION_STATUS_OPTIONS[number]>('PLANNED');
  const [notes, setNotes] = useState('');
  const [fc, setFc] = useState<GeoFeatureCollection>(emptyFeatureCollection());
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;
    if (mode === 'edit' && initial) {
      setRegionCode(initial.regionCode || '');
      setRegionName(initial.regionName || '');
      setClusterId(initial.clusterId || '');
      setAltitudeFloorFtAmsl(initial.altitudeFloorFtAmsl ?? '');
      setAltitudeCeilingFtAmsl(initial.altitudeCeilingFtAmsl ?? '');
      setResponsibleAtcUnit(initial.responsibleAtcUnit || '');
      setAirspaceClass(initial.airspaceClass || 'G');
      setUspaceZoneId(initial.uspaceZoneId || '');
      setMaxFleetSize(initial.maxFleetSize ?? '');
      setWxOverrideEnabled(initial.wxOverrideEnabled ?? true);
      setPerfOverrideEnabled(initial.perfOverrideEnabled ?? true);
      setRegionStatus(
        (initial.regionStatus as typeof REGION_STATUS_OPTIONS[number]) || 'PLANNED',
      );
      setNotes(initial.notes || '');
      setFc(wktToFeatureCollection(initial.regionGeometry));
    } else {
      setRegionCode('');
      setRegionName('');
      setClusterId(defaultClusterId || '');
      setAltitudeFloorFtAmsl(0);
      setAltitudeCeilingFtAmsl(1200);
      setResponsibleAtcUnit('');
      setAirspaceClass('G');
      setUspaceZoneId('');
      setMaxFleetSize('');
      setWxOverrideEnabled(true);
      setPerfOverrideEnabled(true);
      setRegionStatus('PLANNED');
      setNotes('');
      setFc(emptyFeatureCollection());
    }
    setValidationError(null);
  }, [show, mode, initial, defaultClusterId]);

  const userId = currentUserId || DEFAULT_USER;
  const wkt = useMemo(() => featureCollectionToWkt(fc), [fc]);

  const handleSubmit = () => {
    setValidationError(null);

    if (mode === 'create') {
      if (
        !regionCode.trim() ||
        !regionName.trim() ||
        !clusterId ||
        !airspaceClass.trim() ||
        !wkt
      ) {
        setValidationError(
          'Please fill all required fields and draw the region geometry on the map.',
        );
        return;
      }
      const payload: CreateRegionDTO = {
        regionCode: regionCode.trim(),
        regionName: regionName.trim(),
        clusterId,
        regionGeometry: wkt,
        altitudeFloorFtAmsl:
          altitudeFloorFtAmsl === '' ? undefined : Number(altitudeFloorFtAmsl),
        altitudeCeilingFtAmsl:
          altitudeCeilingFtAmsl === '' ? undefined : Number(altitudeCeilingFtAmsl),
        responsibleAtcUnit: responsibleAtcUnit.trim() || undefined,
        airspaceClass: airspaceClass.trim(),
        uspaceZoneId: uspaceZoneId.trim() || undefined,
        maxFleetSize: maxFleetSize === '' ? undefined : Number(maxFleetSize),
        wxOverrideEnabled,
        perfOverrideEnabled,
        regionStatus,
        notes: notes.trim() || undefined,
        createdBy: userId,
      };
      onSubmitCreate(payload);
      return;
    }

    if (!initial) return;
    const payload: UpdateRegionDTO = {
      regionId: initial.regionId,
      regionCode: regionCode.trim() || undefined,
      regionName: regionName.trim() || undefined,
      clusterId: clusterId || undefined,
      regionGeometry: wkt || undefined,
      altitudeFloorFtAmsl:
        altitudeFloorFtAmsl === '' ? undefined : Number(altitudeFloorFtAmsl),
      altitudeCeilingFtAmsl:
        altitudeCeilingFtAmsl === '' ? undefined : Number(altitudeCeilingFtAmsl),
      responsibleAtcUnit: responsibleAtcUnit.trim() || undefined,
      airspaceClass: airspaceClass.trim() || undefined,
      uspaceZoneId: uspaceZoneId.trim() || undefined,
      maxFleetSize: maxFleetSize === '' ? undefined : Number(maxFleetSize),
      wxOverrideEnabled,
      perfOverrideEnabled,
      regionStatus,
      notes: notes.trim() || undefined,
      updatedBy: userId,
    };
    onSubmitUpdate(payload);
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      className="geo-modal"
      backdropClassName="geo-modal-backdrop"
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--app-text)' }}>
          {mode === 'create' ? 'New Region' : 'Edit Region'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {validationError && (
          <div
            style={{
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
              padding: '10px 14px',
              borderRadius: 10,
              marginBottom: 14,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {validationError}
          </div>
        )}

        <div className="row g-3">
          <div className="col-sm-12">
            <label style={label}>Parent Cluster *</label>
            <select
              style={selectStyle}
              value={clusterId}
              onChange={(e) => setClusterId(e.target.value)}
              disabled={mode === 'edit'}
            >
              <option value="">— Select cluster —</option>
              {clusters.map((c) => (
                <option key={c.clusterId} value={c.clusterId}>
                  {c.clusterCode} — {c.clusterName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-sm-6">
            <label style={label}>Region Code *</label>
            <input
              style={input}
              value={regionCode}
              maxLength={20}
              onChange={(e) => setRegionCode(e.target.value)}
              placeholder="SG-CENTRAL"
            />
          </div>
          <div className="col-sm-6">
            <label style={label}>Region Name *</label>
            <input
              style={input}
              value={regionName}
              maxLength={120}
              onChange={(e) => setRegionName(e.target.value)}
              placeholder="Singapore Central Region"
            />
          </div>

          <div className="col-sm-4">
            <label style={label}>Altitude Floor (ft AMSL)</label>
            <input
              style={input}
              type="number"
              min={0}
              max={100000}
              value={altitudeFloorFtAmsl}
              onChange={(e) =>
                setAltitudeFloorFtAmsl(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>
          <div className="col-sm-4">
            <label style={label}>Altitude Ceiling (ft AMSL)</label>
            <input
              style={input}
              type="number"
              min={0}
              max={100000}
              value={altitudeCeilingFtAmsl}
              onChange={(e) =>
                setAltitudeCeilingFtAmsl(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>
          <div className="col-sm-4">
            <label style={label}>Airspace Class *</label>
            <input
              style={input}
              value={airspaceClass}
              maxLength={20}
              onChange={(e) => setAirspaceClass(e.target.value)}
              placeholder="G"
            />
          </div>

          <div className="col-sm-4">
            <label style={label}>Responsible ATC Unit</label>
            <input
              style={input}
              value={responsibleAtcUnit}
              maxLength={80}
              onChange={(e) => setResponsibleAtcUnit(e.target.value)}
              placeholder="WSSS"
            />
          </div>
          <div className="col-sm-4">
            <label style={label}>U-Space Zone ID</label>
            <input
              style={input}
              value={uspaceZoneId}
              maxLength={60}
              onChange={(e) => setUspaceZoneId(e.target.value)}
            />
          </div>
          <div className="col-sm-4">
            <label style={label}>Max Fleet Size</label>
            <input
              style={input}
              type="number"
              min={1}
              value={maxFleetSize}
              onChange={(e) =>
                setMaxFleetSize(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>

          <div className="col-sm-6">
            <label style={label}>Status *</label>
            <select
              style={selectStyle}
              value={regionStatus}
              onChange={(e) =>
                setRegionStatus(e.target.value as typeof REGION_STATUS_OPTIONS[number])
              }
            >
              {REGION_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-6">
            <div
              style={{
                display: 'flex',
                gap: 18,
                flexWrap: 'wrap',
                marginTop: 26,
              }}
            >
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--app-text-muted)' }}
              >
                <input
                  type="checkbox"
                  checked={wxOverrideEnabled}
                  onChange={(e) => setWxOverrideEnabled(e.target.checked)}
                />
                Weather override
              </label>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--app-text-muted)' }}
              >
                <input
                  type="checkbox"
                  checked={perfOverrideEnabled}
                  onChange={(e) => setPerfOverrideEnabled(e.target.checked)}
                />
                Performance override
              </label>
            </div>
          </div>

          <div className="col-12">
            <label style={label}>Notes</label>
            <textarea
              style={{ ...input, minHeight: 70, resize: 'vertical' }}
              value={notes}
              maxLength={1000}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label style={label}>Region Geometry * (draw on map or paste GeoJSON)</label>
            <GeoInput value={fc} onChange={setFc} height={340} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" style={btn} onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button type="button" style={btnPrimary} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving…' : mode === 'create' ? 'Create Region' : 'Save Changes'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
