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
  ZONE_STATUS_OPTIONS,
  ZONE_SUBTYPE_OPTIONS,
  ZONE_TYPE_OPTIONS,
  type CreateOperatingZoneDTO,
  type OperatingClusterDTO,
  type OperatingZoneDTO,
  type RegionDTO,
  type UpdateOperatingZoneDTO,
} from '../../store/geographicalTypes';
import {
  emptyFeatureCollection,
  featureCollectionCentroid,
  featureCollectionToWkt,
  wktToFeatureCollection,
  type GeoFeatureCollection,
} from '../../utils/geojsonUtils';

interface Props {
  show: boolean;
  mode: 'create' | 'edit';
  initial?: OperatingZoneDTO | null;
  clusters: OperatingClusterDTO[];
  regions: RegionDTO[];
  defaultClusterId?: string;
  defaultRegionId?: string;
  loading?: boolean;
  currentUser?: string;
  onClose: () => void;
  onSubmitCreate: (payload: CreateOperatingZoneDTO) => void;
  onSubmitUpdate: (payload: UpdateOperatingZoneDTO) => void;
}

const DEFAULT_USER = 'admin@aam.com';

export default function ZoneFormModal({
  show,
  mode,
  initial,
  clusters,
  regions,
  defaultClusterId,
  defaultRegionId,
  loading,
  currentUser,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: Props) {
  const [clusterId, setClusterId] = useState('');
  const [regionId, setRegionId] = useState('');
  const [zoneCode, setZoneCode] = useState('');
  const [zoneName, setZoneName] = useState('');
  const [zoneDescription, setZoneDescription] = useState('');
  const [zoneType, setZoneType] = useState<typeof ZONE_TYPE_OPTIONS[number]>('OPERATION');
  const [zoneSubtype, setZoneSubtype] = useState<string>('');
  const [zoneStatus, setZoneStatus] = useState<typeof ZONE_STATUS_OPTIONS[number]>('PLANNED');
  const [altitudeFloorFtAmsl, setAltitudeFloorFtAmsl] = useState<number | ''>(0);
  const [altitudeCeilingFtAmsl, setAltitudeCeilingFtAmsl] = useState<number | ''>(800);
  const [populationDensity, setPopulationDensity] = useState<number | ''>('');
  const [baselineDemandPaxHr, setBaselineDemandPaxHr] = useState<number | ''>('');
  const [maxFleetSize, setMaxFleetSize] = useState<number | ''>('');
  const [responsibleAtcUnit, setResponsibleAtcUnit] = useState('');
  const [airspaceClass, setAirspaceClass] = useState('G');
  const [caaAuthorityCode, setCaaAuthorityCode] = useState('');
  const [timezoneName, setTimezoneName] = useState('');
  const [wxOverrideEnabled, setWxOverrideEnabled] = useState(false);
  const [perfOverrideEnabled, setPerfOverrideEnabled] = useState(false);
  const [operatorAccessRestricted, setOperatorAccessRestricted] = useState(false);
  const [fc, setFc] = useState<GeoFeatureCollection>(emptyFeatureCollection());
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset / populate
  useEffect(() => {
    if (!show) return;
    if (mode === 'edit' && initial) {
      setClusterId(initial.clusterId || '');
      setRegionId(initial.regionId || '');
      setZoneCode(initial.zoneCode || '');
      setZoneName(initial.zoneName || '');
      setZoneDescription(initial.zoneDescription || '');
      setZoneType((initial.zoneType as typeof ZONE_TYPE_OPTIONS[number]) || 'OPERATION');
      setZoneSubtype(initial.zoneSubtype || '');
      setZoneStatus((initial.zoneStatus as typeof ZONE_STATUS_OPTIONS[number]) || 'PLANNED');
      setAltitudeFloorFtAmsl(initial.altitudeFloorFtAmsl ?? '');
      setAltitudeCeilingFtAmsl(initial.altitudeCeilingFtAmsl ?? '');
      setPopulationDensity(initial.populationDensity ?? '');
      setBaselineDemandPaxHr(initial.baselineDemandPaxHr ?? '');
      setMaxFleetSize(initial.maxFleetSize ?? '');
      setResponsibleAtcUnit(initial.responsibleAtcUnit || '');
      setAirspaceClass(initial.airspaceClass || 'G');
      setCaaAuthorityCode(initial.caaAuthorityCode || '');
      setTimezoneName(initial.timezoneName || '');
      setWxOverrideEnabled(initial.wxOverrideEnabled ?? false);
      setPerfOverrideEnabled(initial.perfOverrideEnabled ?? false);
      setOperatorAccessRestricted(initial.operatorAccessRestricted ?? false);
      setFc(wktToFeatureCollection(initial.boundaryGeometry));
    } else {
      setClusterId(defaultClusterId || '');
      setRegionId(defaultRegionId || '');
      setZoneCode('');
      setZoneName('');
      setZoneDescription('');
      setZoneType('OPERATION');
      setZoneSubtype('');
      setZoneStatus('PLANNED');
      setAltitudeFloorFtAmsl(0);
      setAltitudeCeilingFtAmsl(800);
      setPopulationDensity('');
      setBaselineDemandPaxHr('');
      setMaxFleetSize('');
      setResponsibleAtcUnit('');
      setAirspaceClass('G');
      setCaaAuthorityCode('');
      setTimezoneName('');
      setWxOverrideEnabled(false);
      setPerfOverrideEnabled(false);
      setOperatorAccessRestricted(false);
      setFc(emptyFeatureCollection());
    }
    setValidationError(null);
  }, [show, mode, initial, defaultClusterId, defaultRegionId]);

  // When the user selects a cluster, narrow the regions list
  const filteredRegions = useMemo(
    () => (clusterId ? regions.filter((r) => r.clusterId === clusterId) : regions),
    [regions, clusterId],
  );

  // Auto-clear regionId if it does not belong to the selected cluster
  useEffect(() => {
    if (!regionId) return;
    if (!filteredRegions.some((r) => r.regionId === regionId)) {
      setRegionId('');
    }
  }, [filteredRegions, regionId]);

  const userId = currentUser || DEFAULT_USER;
  const wkt = useMemo(() => featureCollectionToWkt(fc), [fc]);
  const centroid = useMemo(() => featureCollectionCentroid(fc), [fc]);

  const handleSubmit = () => {
    setValidationError(null);

    if (!clusterId || !regionId || !zoneCode.trim() || !zoneName.trim()) {
      setValidationError('Cluster, Region, Zone Code and Zone Name are required.');
      return;
    }

    const centerLongitude = centroid ? centroid[0] : undefined;
    const centerLatitude = centroid ? centroid[1] : undefined;

    if (mode === 'create') {
      const payload: CreateOperatingZoneDTO = {
        zoneCode: zoneCode.trim(),
        zoneName: zoneName.trim(),
        zoneDescription: zoneDescription.trim() || undefined,
        regionId,
        clusterId,
        zoneType,
        zoneSubtype: (zoneSubtype as CreateOperatingZoneDTO['zoneSubtype']) || undefined,
        zoneStatus,
        altitudeFloorFtAmsl:
          altitudeFloorFtAmsl === '' ? undefined : Number(altitudeFloorFtAmsl),
        altitudeCeilingFtAmsl:
          altitudeCeilingFtAmsl === '' ? undefined : Number(altitudeCeilingFtAmsl),
        populationDensity:
          populationDensity === '' ? undefined : Number(populationDensity),
        baselineDemandPaxHr:
          baselineDemandPaxHr === '' ? undefined : Number(baselineDemandPaxHr),
        wxOverrideEnabled,
        perfOverrideEnabled,
        operatorAccessRestricted,
        timezoneName: timezoneName.trim() || undefined,
        responsibleAtcUnit: responsibleAtcUnit.trim() || undefined,
        airspaceClass: airspaceClass.trim() || undefined,
        maxFleetSize: maxFleetSize === '' ? undefined : Number(maxFleetSize),
        caaAuthorityCode: caaAuthorityCode.trim() || undefined,
        centerLatitude,
        centerLongitude,
        boundaryGeometry: wkt || undefined,
        createdBy: userId,
      };
      onSubmitCreate(payload);
      return;
    }

    if (!initial) return;
    const payload: UpdateOperatingZoneDTO = {
      zoneId: initial.zoneId,
      zoneCode: zoneCode.trim(),
      zoneName: zoneName.trim(),
      zoneDescription: zoneDescription.trim() || undefined,
      regionId,
      clusterId,
      zoneType,
      zoneSubtype: (zoneSubtype as UpdateOperatingZoneDTO['zoneSubtype']) || undefined,
      zoneStatus,
      altitudeFloorFtAmsl:
        altitudeFloorFtAmsl === '' ? undefined : Number(altitudeFloorFtAmsl),
      altitudeCeilingFtAmsl:
        altitudeCeilingFtAmsl === '' ? undefined : Number(altitudeCeilingFtAmsl),
      populationDensity:
        populationDensity === '' ? undefined : Number(populationDensity),
      baselineDemandPaxHr:
        baselineDemandPaxHr === '' ? undefined : Number(baselineDemandPaxHr),
      wxOverrideEnabled,
      perfOverrideEnabled,
      operatorAccessRestricted,
      timezoneName: timezoneName.trim() || undefined,
      responsibleAtcUnit: responsibleAtcUnit.trim() || undefined,
      airspaceClass: airspaceClass.trim() || undefined,
      maxFleetSize: maxFleetSize === '' ? undefined : Number(maxFleetSize),
      caaAuthorityCode: caaAuthorityCode.trim() || undefined,
      centerLatitude,
      centerLongitude,
      boundaryGeometry: wkt || undefined,
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
          {mode === 'create' ? 'New Zone' : 'Edit Zone'}
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
            <label style={label}>Cluster *</label>
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
            <label style={label}>Region *</label>
            <select
              style={selectStyle}
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              disabled={!clusterId || mode === 'edit'}
            >
              <option value="">
                {clusterId ? '— Select region —' : '— Select a cluster first —'}
              </option>
              {filteredRegions.map((r) => (
                <option key={r.regionId} value={r.regionId}>
                  {r.regionCode} — {r.regionName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-sm-6">
            <label style={label}>Zone Code *</label>
            <input
              style={input}
              value={zoneCode}
              maxLength={20}
              onChange={(e) => setZoneCode(e.target.value)}
              placeholder="SG-CENTRAL-Z01"
            />
          </div>
          <div className="col-sm-6">
            <label style={label}>Zone Name *</label>
            <input
              style={input}
              value={zoneName}
              maxLength={100}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="Singapore Central Zone 01"
            />
          </div>

          <div className="col-12">
            <label style={label}>Description</label>
            <input
              style={input}
              value={zoneDescription}
              maxLength={500}
              onChange={(e) => setZoneDescription(e.target.value)}
            />
          </div>

          <div className="col-sm-4">
            <label style={label}>Zone Type *</label>
            <select
              style={selectStyle}
              value={zoneType}
              onChange={(e) =>
                setZoneType(e.target.value as typeof ZONE_TYPE_OPTIONS[number])
              }
            >
              {ZONE_TYPE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-4">
            <label style={label}>Zone Subtype</label>
            <select
              style={selectStyle}
              value={zoneSubtype}
              onChange={(e) => setZoneSubtype(e.target.value)}
            >
              <option value="">— None —</option>
              {ZONE_SUBTYPE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-4">
            <label style={label}>Status *</label>
            <select
              style={selectStyle}
              value={zoneStatus}
              onChange={(e) =>
                setZoneStatus(e.target.value as typeof ZONE_STATUS_OPTIONS[number])
              }
            >
              {ZONE_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="col-sm-3">
            <label style={label}>Floor (ft AMSL)</label>
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
          <div className="col-sm-3">
            <label style={label}>Ceiling (ft AMSL)</label>
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
          <div className="col-sm-3">
            <label style={label}>Population Density</label>
            <input
              style={input}
              type="number"
              min={0}
              value={populationDensity}
              onChange={(e) =>
                setPopulationDensity(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>
          <div className="col-sm-3">
            <label style={label}>Baseline Demand (pax/hr)</label>
            <input
              style={input}
              type="number"
              min={0}
              step="0.1"
              value={baselineDemandPaxHr}
              onChange={(e) =>
                setBaselineDemandPaxHr(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>

          <div className="col-sm-3">
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
          <div className="col-sm-3">
            <label style={label}>Airspace Class</label>
            <input
              style={input}
              value={airspaceClass}
              maxLength={5}
              onChange={(e) => setAirspaceClass(e.target.value)}
            />
          </div>
          <div className="col-sm-3">
            <label style={label}>Responsible ATC Unit</label>
            <input
              style={input}
              value={responsibleAtcUnit}
              maxLength={20}
              onChange={(e) => setResponsibleAtcUnit(e.target.value)}
            />
          </div>
          <div className="col-sm-3">
            <label style={label}>CAA Authority Code</label>
            <input
              style={input}
              value={caaAuthorityCode}
              maxLength={10}
              onChange={(e) => setCaaAuthorityCode(e.target.value)}
            />
          </div>

          <div className="col-sm-6">
            <label style={label}>Timezone Name</label>
            <input
              style={input}
              value={timezoneName}
              maxLength={50}
              onChange={(e) => setTimezoneName(e.target.value)}
              placeholder="Asia/Singapore"
            />
          </div>
          <div className="col-sm-6">
            <div
              style={{
                display: 'flex',
                gap: 14,
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
                Wx override
              </label>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--app-text-muted)' }}
              >
                <input
                  type="checkbox"
                  checked={perfOverrideEnabled}
                  onChange={(e) => setPerfOverrideEnabled(e.target.checked)}
                />
                Perf override
              </label>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--app-text-muted)' }}
              >
                <input
                  type="checkbox"
                  checked={operatorAccessRestricted}
                  onChange={(e) => setOperatorAccessRestricted(e.target.checked)}
                />
                Operator access restricted
              </label>
            </div>
          </div>

          <div className="col-12">
            <label style={label}>Boundary Geometry (draw on map or paste GeoJSON)</label>
            <GeoInput value={fc} onChange={setFc} height={340} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" style={btn} onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button type="button" style={btnPrimary} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving…' : mode === 'create' ? 'Create Zone' : 'Save Changes'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
