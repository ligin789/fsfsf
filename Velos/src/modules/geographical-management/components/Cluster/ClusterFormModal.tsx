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
  CLUSTER_STATUS_OPTIONS,
  type CreateOperatingClusterDTO,
  type OperatingClusterDTO,
  type UpdateOperatingClusterDTO,
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
  initial?: OperatingClusterDTO | null;
  loading?: boolean;
  currentUserId?: string;
  onClose: () => void;
  onSubmitCreate: (payload: CreateOperatingClusterDTO) => void;
  onSubmitUpdate: (payload: UpdateOperatingClusterDTO) => void;
}

const DEFAULT_USER = '00000000-0000-0000-0000-000000000000';

export default function ClusterFormModal({
  show,
  mode,
  initial,
  loading,
  currentUserId,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: Props) {
  const [clusterCode, setClusterCode] = useState('');
  const [clusterName, setClusterName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [timezoneCode, setTimezoneCode] = useState('');
  const [utcOffsetHours, setUtcOffsetHours] = useState<number | ''>('');
  const [caaAuthorityCode, setCaaAuthorityCode] = useState('');
  const [caaAuthorityName, setCaaAuthorityName] = useState('');
  const [airspaceClass, setAirspaceClass] = useState('G');
  const [altitudeLimitFtAgl, setAltitudeLimitFtAgl] = useState<number | ''>(400);
  const [clusterStatus, setClusterStatus] = useState<typeof CLUSTER_STATUS_OPTIONS[number]>(
    'PLANNED',
  );
  const [maxConcurrentFlights, setMaxConcurrentFlights] = useState<number | ''>(50);
  const [allowOperatorZoneOverride, setAllowOperatorZoneOverride] = useState(true);
  const [allowOperatorRegionOverride, setAllowOperatorRegionOverride] = useState(true);
  const [requireClusterApprovalForOverride, setRequireClusterApprovalForOverride] = useState(false);
  const [notes, setNotes] = useState('');
  const [fc, setFc] = useState<GeoFeatureCollection>(emptyFeatureCollection());
  const [validationError, setValidationError] = useState<string | null>(null);

  // Populate form when modal is opened
  useEffect(() => {
    if (!show) return;
    if (mode === 'edit' && initial) {
      setClusterCode(initial.clusterCode || '');
      setClusterName(initial.clusterName || '');
      setCountryCode(initial.countryCode || '');
      setCountryName(initial.countryName || '');
      setStateProvince(initial.stateProvince || '');
      setTimezoneCode(initial.timezoneCode || '');
      setUtcOffsetHours(initial.utcOffsetHours ?? '');
      setCaaAuthorityCode(initial.caaAuthorityCode || '');
      setCaaAuthorityName(initial.caaAuthorityName || '');
      setAirspaceClass(initial.airspaceClass || 'G');
      setAltitudeLimitFtAgl(initial.altitudeLimitFtAgl ?? '');
      setClusterStatus((initial.clusterStatus as typeof CLUSTER_STATUS_OPTIONS[number]) || 'PLANNED');
      setMaxConcurrentFlights(initial.maxConcurrentFlights ?? '');
      setAllowOperatorZoneOverride(initial.allowOperatorZoneOverride ?? true);
      setAllowOperatorRegionOverride(initial.allowOperatorRegionOverride ?? true);
      setRequireClusterApprovalForOverride(initial.requireClusterApprovalForOverride ?? false);
      setNotes(initial.notes || '');
      setFc(wktToFeatureCollection(initial.clusterGeometry));
    } else {
      setClusterCode('');
      setClusterName('');
      setCountryCode('');
      setCountryName('');
      setStateProvince('');
      setTimezoneCode('');
      setUtcOffsetHours('');
      setCaaAuthorityCode('');
      setCaaAuthorityName('');
      setAirspaceClass('G');
      setAltitudeLimitFtAgl(400);
      setClusterStatus('PLANNED');
      setMaxConcurrentFlights(50);
      setAllowOperatorZoneOverride(true);
      setAllowOperatorRegionOverride(true);
      setRequireClusterApprovalForOverride(false);
      setNotes('');
      setFc(emptyFeatureCollection());
    }
    setValidationError(null);
  }, [show, mode, initial]);

  const userId = currentUserId || DEFAULT_USER;
  const wkt = useMemo(() => featureCollectionToWkt(fc), [fc]);

  const handleSubmit = () => {
    setValidationError(null);

    if (mode === 'create') {
      if (
        !clusterCode.trim() ||
        !clusterName.trim() ||
        !countryCode.trim() ||
        !countryName.trim() ||
        !timezoneCode.trim() ||
        utcOffsetHours === '' ||
        !caaAuthorityCode.trim() ||
        !caaAuthorityName.trim() ||
        !airspaceClass.trim() ||
        maxConcurrentFlights === '' ||
        !wkt
      ) {
        setValidationError(
          'Please fill all required fields and draw the cluster geometry on the map.',
        );
        return;
      }
      const payload: CreateOperatingClusterDTO = {
        clusterCode: clusterCode.trim(),
        clusterName: clusterName.trim(),
        countryCode: countryCode.trim().toUpperCase(),
        countryName: countryName.trim(),
        stateProvince: stateProvince.trim() || undefined,
        clusterGeometry: wkt,
        timezoneCode: timezoneCode.trim(),
        utcOffsetHours: Number(utcOffsetHours),
        caaAuthorityCode: caaAuthorityCode.trim(),
        caaAuthorityName: caaAuthorityName.trim(),
        airspaceClass: airspaceClass.trim(),
        altitudeLimitFtAgl:
          altitudeLimitFtAgl === '' ? undefined : Number(altitudeLimitFtAgl),
        clusterStatus,
        maxConcurrentFlights: Number(maxConcurrentFlights),
        allowOperatorZoneOverride,
        allowOperatorRegionOverride,
        requireClusterApprovalForOverride,
        notes: notes.trim() || undefined,
        createdBy: userId,
      };
      onSubmitCreate(payload);
      return;
    }

    // edit
    if (!initial) return;
    const payload: UpdateOperatingClusterDTO = {
      clusterId: initial.clusterId,
      clusterCode: clusterCode.trim() || undefined,
      clusterName: clusterName.trim() || undefined,
      countryCode: countryCode.trim() || undefined,
      countryName: countryName.trim() || undefined,
      stateProvince: stateProvince.trim() || undefined,
      clusterGeometry: wkt || undefined,
      timezoneCode: timezoneCode.trim() || undefined,
      utcOffsetHours: utcOffsetHours === '' ? undefined : Number(utcOffsetHours),
      caaAuthorityCode: caaAuthorityCode.trim() || undefined,
      caaAuthorityName: caaAuthorityName.trim() || undefined,
      airspaceClass: airspaceClass.trim() || undefined,
      altitudeLimitFtAgl:
        altitudeLimitFtAgl === '' ? undefined : Number(altitudeLimitFtAgl),
      clusterStatus,
      maxConcurrentFlights:
        maxConcurrentFlights === '' ? undefined : Number(maxConcurrentFlights),
      allowOperatorZoneOverride,
      allowOperatorRegionOverride,
      requireClusterApprovalForOverride,
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
          {mode === 'create' ? 'New Cluster' : 'Edit Cluster'}
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
          <div className="col-sm-6">
            <label style={label}>Cluster Code *</label>
            <input
              style={input}
              value={clusterCode}
              maxLength={20}
              onChange={(e) => setClusterCode(e.target.value)}
              placeholder="SG-METRO"
            />
          </div>
          <div className="col-sm-6">
            <label style={label}>Cluster Name *</label>
            <input
              style={input}
              value={clusterName}
              maxLength={120}
              onChange={(e) => setClusterName(e.target.value)}
              placeholder="Singapore Metro Cluster"
            />
          </div>

          <div className="col-sm-3">
            <label style={label}>Country Code *</label>
            <input
              style={input}
              value={countryCode}
              maxLength={2}
              onChange={(e) => setCountryCode(e.target.value)}
              placeholder="SG"
            />
          </div>
          <div className="col-sm-5">
            <label style={label}>Country Name *</label>
            <input
              style={input}
              value={countryName}
              maxLength={80}
              onChange={(e) => setCountryName(e.target.value)}
              placeholder="Singapore"
            />
          </div>
          <div className="col-sm-4">
            <label style={label}>State / Province</label>
            <input
              style={input}
              value={stateProvince}
              maxLength={80}
              onChange={(e) => setStateProvince(e.target.value)}
              placeholder="Central Region"
            />
          </div>

          <div className="col-sm-4">
            <label style={label}>Timezone Code *</label>
            <input
              style={input}
              value={timezoneCode}
              maxLength={60}
              onChange={(e) => setTimezoneCode(e.target.value)}
              placeholder="Asia/Singapore"
            />
          </div>
          <div className="col-sm-4">
            <label style={label}>UTC Offset (hours) *</label>
            <input
              style={input}
              type="number"
              step="0.25"
              min={-12}
              max={14}
              value={utcOffsetHours}
              onChange={(e) =>
                setUtcOffsetHours(e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="8"
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

          <div className="col-sm-6">
            <label style={label}>CAA Authority Code *</label>
            <input
              style={input}
              value={caaAuthorityCode}
              maxLength={20}
              onChange={(e) => setCaaAuthorityCode(e.target.value)}
              placeholder="CAAS"
            />
          </div>
          <div className="col-sm-6">
            <label style={label}>CAA Authority Name *</label>
            <input
              style={input}
              value={caaAuthorityName}
              maxLength={120}
              onChange={(e) => setCaaAuthorityName(e.target.value)}
              placeholder="Civil Aviation Authority of Singapore"
            />
          </div>

          <div className="col-sm-4">
            <label style={label}>Altitude Limit (ft AGL)</label>
            <input
              style={input}
              type="number"
              min={0}
              max={10000}
              value={altitudeLimitFtAgl}
              onChange={(e) =>
                setAltitudeLimitFtAgl(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>
          <div className="col-sm-4">
            <label style={label}>Max Concurrent Flights *</label>
            <input
              style={input}
              type="number"
              min={1}
              value={maxConcurrentFlights}
              onChange={(e) =>
                setMaxConcurrentFlights(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>
          <div className="col-sm-4">
            <label style={label}>Status *</label>
            <select
              style={selectStyle}
              value={clusterStatus}
              onChange={(e) =>
                setClusterStatus(e.target.value as typeof CLUSTER_STATUS_OPTIONS[number])
              }
            >
              {CLUSTER_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 4 }}>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--app-text-muted)' }}
              >
                <input
                  type="checkbox"
                  checked={allowOperatorZoneOverride}
                  onChange={(e) => setAllowOperatorZoneOverride(e.target.checked)}
                />
                Allow operator zone override
              </label>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--app-text-muted)' }}
              >
                <input
                  type="checkbox"
                  checked={allowOperatorRegionOverride}
                  onChange={(e) => setAllowOperatorRegionOverride(e.target.checked)}
                />
                Allow operator region override
              </label>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--app-text-muted)' }}
              >
                <input
                  type="checkbox"
                  checked={requireClusterApprovalForOverride}
                  onChange={(e) => setRequireClusterApprovalForOverride(e.target.checked)}
                />
                Require cluster approval for override
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
            <label style={label}>Cluster Geometry * (draw on map or paste GeoJSON)</label>
            <GeoInput value={fc} onChange={setFc} height={360} />
            {wkt && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 11,
                  color: 'var(--app-text-faint)',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                }}
              >
                {wkt.slice(0, 160)}
                {wkt.length > 160 ? '…' : ''}
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" style={btn} onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button type="button" style={btnPrimary} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving…' : mode === 'create' ? 'Create Cluster' : 'Save Changes'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
