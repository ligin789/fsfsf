import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import type { Vertiport } from "./VertiportCard";

interface CreateVertiportModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (vertiport: Vertiport) => void;
  nextId: string;
}

export default function CreateVertiportModal({ show, onClose, onCreate, nextId }: CreateVertiportModalProps) {
  const [vertiportCode, setVertiportCode] = useState("");
  const [vertiportName, setVertiportName] = useState("");
  const [vertiportClass, setVertiportClass] = useState("VERTIHUB");
  const [partnerId, setPartnerId] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [regulatorId, setRegulatorId] = useState("");
  const [operatingZoneId, setOperatingZoneId] = useState("");
  const [operatingRegionId, setOperatingRegionId] = useState("");
  const [operatingClusterId, setOperatingClusterId] = useState("");
  const [vtmSystemId, setVtmSystemId] = useState("");
  const [latitudeDeg, setLatitudeDeg] = useState("");
  const [longitudeDeg, setLongitudeDeg] = useState("");
  const [elevationFtAmsl, setElevationFtAmsl] = useState("");
  const [magneticVariationDeg, setMagneticVariationDeg] = useState("");
  const [utcOffsetHours, setUtcOffsetHours] = useState("5.5");
  const [timezoneName, setTimezoneName] = useState("Asia/Kolkata");
  const [totalFatoCount, setTotalFatoCount] = useState("");
  const [totalPadCount, setTotalPadCount] = useState("");
  const [totalGateCount, setTotalGateCount] = useState("");
  const [maxSimultaneousMovements, setMaxSimultaneousMovements] = useState("");
  const [maxAircraftMtowKg, setMaxAircraftMtowKg] = useState("");
  const [noiseAbatementProcedure, setNoiseAbatementProcedure] = useState("");
  const [iataCode, setIataCode] = useState("");
  const [icaoDesignator, setIcaoDesignator] = useState("");
  const [swimEndpoint, setSwimEndpoint] = useState("");
  const [atmUnit, setAtmUnit] = useState("");
  const [certificationStatus, setCertificationStatus] = useState("CERTIFIED");
  const [certificationAuthority, setCertificationAuthority] = useState("");
  const [certificationExpiry, setCertificationExpiry] = useState("");
  const [isVtmConnected, setIsVtmConnected] = useState(false);
  const [vtmConnectivityStatus, setVtmConnectivityStatus] = useState("DISCONNECTED");

  const resetForm = () => {
    setVertiportCode(""); setVertiportName(""); setVertiportClass("VERTIHUB");
    setPartnerId(""); setOperatorId(""); setOwnerId(""); setRegulatorId("");
    setOperatingZoneId(""); setOperatingRegionId(""); setOperatingClusterId(""); setVtmSystemId("");
    setLatitudeDeg(""); setLongitudeDeg(""); setElevationFtAmsl("");
    setMagneticVariationDeg(""); setUtcOffsetHours("5.5"); setTimezoneName("Asia/Kolkata");
    setTotalFatoCount(""); setTotalPadCount(""); setTotalGateCount("");
    setMaxSimultaneousMovements(""); setMaxAircraftMtowKg("");
    setNoiseAbatementProcedure(""); setIataCode(""); setIcaoDesignator("");
    setSwimEndpoint(""); setAtmUnit("");
    setCertificationStatus("CERTIFIED"); setCertificationAuthority(""); setCertificationExpiry("");
    setIsVtmConnected(false); setVtmConnectivityStatus("DISCONNECTED");
  };

  const handleClose = () => { resetForm(); onClose(); };

  const handleCreate = () => {
    if (!vertiportName.trim() || !vertiportCode.trim()) return;

    const now = new Date().toISOString();
    const newVertiport: Vertiport = {
      vertiportId: nextId,
      vertiportCode: vertiportCode.trim().toUpperCase(),
      vertiportName: vertiportName.trim(),
      vertiportClass,
      partnerId: partnerId.trim(),
      operatorId: operatorId.trim(),
      ownerId: ownerId.trim(),
      regulatorId: regulatorId.trim(),
      operatingZoneId: operatingZoneId.trim(),
      operatingRegionId: operatingRegionId.trim(),
      operatingClusterId: operatingClusterId.trim(),
      vtmSystemId: vtmSystemId.trim(),
      latitudeDeg: parseFloat(latitudeDeg) || 0,
      longitudeDeg: parseFloat(longitudeDeg) || 0,
      elevationFtAmsl: parseFloat(elevationFtAmsl) || 0,
      arpGeometry: {},
      boundaryGeometry: {},
      magneticVariationDeg: parseFloat(magneticVariationDeg) || 0,
      utcOffsetHours: parseFloat(utcOffsetHours) || 5.5,
      timezoneName: timezoneName.trim(),
      totalFatoCount: parseInt(totalFatoCount) || 0,
      totalPadCount: parseInt(totalPadCount) || 0,
      totalGateCount: parseInt(totalGateCount) || 0,
      maxSimultaneousMovements: parseInt(maxSimultaneousMovements) || 0,
      maxAircraftMtowKg: parseFloat(maxAircraftMtowKg) || 0,
      noiseAbatementProcedure: noiseAbatementProcedure.trim(),
      iataCode: iataCode.trim().toUpperCase(),
      icaoDesignator: icaoDesignator.trim().toUpperCase(),
      swimEndpoint: swimEndpoint.trim(),
      atmUnit: atmUnit.trim(),
      certificationStatus,
      certificationAuthority: certificationAuthority.trim(),
      certificationExpiry: certificationExpiry || now.split("T")[0],
      isVtmConnected,
      vtmConnectivityStatus,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    onCreate(newVertiport);
    resetForm();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    fontSize: "0.875rem",
    color: "#1E293B",
    outline: "none",
    transition: "border-color 150ms ease",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#475569",
    marginBottom: "6px",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "auto" as React.CSSProperties["appearance"],
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#0F172A",
    marginBottom: "12px",
    marginTop: "8px",
    paddingBottom: "8px",
    borderBottom: "1px solid #F1F5F9",
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A" }}>
          New Vertiport
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh" }}>
        {/* Basic Information */}
        <div style={sectionTitle}>Basic Information</div>
        <div className="row g-3">
          <div className="col-sm-6">
            <label style={labelStyle}>Vertiport Name *</label>
            <input style={inputStyle} placeholder="Enter vertiport name" value={vertiportName} onChange={(e) => setVertiportName(e.target.value)} />
          </div>
          <div className="col-sm-3">
            <label style={labelStyle}>Vertiport Code *</label>
            <input style={inputStyle} placeholder="e.g. MBH-01" value={vertiportCode} onChange={(e) => setVertiportCode(e.target.value)} />
          </div>
          <div className="col-sm-3">
            <label style={labelStyle}>Class</label>
            <select style={selectStyle} value={vertiportClass} onChange={(e) => setVertiportClass(e.target.value)}>
              <option value="VERTIHUB">VERTIHUB</option>
              <option value="VERTIPORT">VERTIPORT</option>
              <option value="VERTIPAD">VERTIPAD</option>
            </select>
          </div>
        </div>

        {/* Associations */}
        <div style={{ ...sectionTitle, marginTop: "20px" }}>Associations</div>
        <div className="row g-3">
          <div className="col-sm-6">
            <label style={labelStyle}>Partner ID</label>
            <input style={inputStyle} placeholder="UUID" value={partnerId} onChange={(e) => setPartnerId(e.target.value)} />
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>Operator ID</label>
            <input style={inputStyle} placeholder="UUID" value={operatorId} onChange={(e) => setOperatorId(e.target.value)} />
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>Owner ID</label>
            <input style={inputStyle} placeholder="UUID" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} />
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>Regulator ID</label>
            <input style={inputStyle} placeholder="UUID" value={regulatorId} onChange={(e) => setRegulatorId(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Operating Zone ID</label>
            <input style={inputStyle} placeholder="UUID" value={operatingZoneId} onChange={(e) => setOperatingZoneId(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Operating Region ID</label>
            <input style={inputStyle} placeholder="UUID" value={operatingRegionId} onChange={(e) => setOperatingRegionId(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Operating Cluster ID</label>
            <input style={inputStyle} placeholder="UUID" value={operatingClusterId} onChange={(e) => setOperatingClusterId(e.target.value)} />
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>VTM System ID</label>
            <input style={inputStyle} placeholder="UUID" value={vtmSystemId} onChange={(e) => setVtmSystemId(e.target.value)} />
          </div>
        </div>

        {/* Location */}
        <div style={{ ...sectionTitle, marginTop: "20px" }}>Location</div>
        <div className="row g-3">
          <div className="col-sm-4">
            <label style={labelStyle}>Latitude (deg)</label>
            <input style={inputStyle} type="number" step="any" placeholder="e.g. 19.076" value={latitudeDeg} onChange={(e) => setLatitudeDeg(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Longitude (deg)</label>
            <input style={inputStyle} type="number" step="any" placeholder="e.g. 72.877" value={longitudeDeg} onChange={(e) => setLongitudeDeg(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Elevation (ft AMSL)</label>
            <input style={inputStyle} type="number" placeholder="e.g. 45" value={elevationFtAmsl} onChange={(e) => setElevationFtAmsl(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Magnetic Variation (deg)</label>
            <input style={inputStyle} type="number" step="any" placeholder="e.g. -0.5" value={magneticVariationDeg} onChange={(e) => setMagneticVariationDeg(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>UTC Offset (hours)</label>
            <input style={inputStyle} type="number" step="0.5" placeholder="e.g. 5.5" value={utcOffsetHours} onChange={(e) => setUtcOffsetHours(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Timezone</label>
            <input style={inputStyle} placeholder="e.g. Asia/Kolkata" value={timezoneName} onChange={(e) => setTimezoneName(e.target.value)} />
          </div>
        </div>

        {/* Capacity */}
        <div style={{ ...sectionTitle, marginTop: "20px" }}>Capacity</div>
        <div className="row g-3">
          <div className="col-sm-4">
            <label style={labelStyle}>Total FATO Count</label>
            <input style={inputStyle} type="number" placeholder="0" value={totalFatoCount} onChange={(e) => setTotalFatoCount(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Total Pad Count</label>
            <input style={inputStyle} type="number" placeholder="0" value={totalPadCount} onChange={(e) => setTotalPadCount(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Total Gate Count</label>
            <input style={inputStyle} type="number" placeholder="0" value={totalGateCount} onChange={(e) => setTotalGateCount(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Max Simultaneous Movements</label>
            <input style={inputStyle} type="number" placeholder="0" value={maxSimultaneousMovements} onChange={(e) => setMaxSimultaneousMovements(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Max Aircraft MTOW (kg)</label>
            <input style={inputStyle} type="number" placeholder="0" value={maxAircraftMtowKg} onChange={(e) => setMaxAircraftMtowKg(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Noise Abatement</label>
            <input style={inputStyle} placeholder="Procedure description" value={noiseAbatementProcedure} onChange={(e) => setNoiseAbatementProcedure(e.target.value)} />
          </div>
        </div>

        {/* Identifiers & ATM */}
        <div style={{ ...sectionTitle, marginTop: "20px" }}>Identifiers & ATM</div>
        <div className="row g-3">
          <div className="col-sm-3">
            <label style={labelStyle}>IATA Code</label>
            <input style={inputStyle} placeholder="e.g. MBV" maxLength={3} value={iataCode} onChange={(e) => setIataCode(e.target.value)} />
          </div>
          <div className="col-sm-3">
            <label style={labelStyle}>ICAO Designator</label>
            <input style={inputStyle} placeholder="e.g. VMBH" maxLength={4} value={icaoDesignator} onChange={(e) => setIcaoDesignator(e.target.value)} />
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>SWIM Endpoint</label>
            <input style={inputStyle} placeholder="https://..." value={swimEndpoint} onChange={(e) => setSwimEndpoint(e.target.value)} />
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>ATM Unit</label>
            <input style={inputStyle} placeholder="e.g. Mumbai ATC" value={atmUnit} onChange={(e) => setAtmUnit(e.target.value)} />
          </div>
        </div>

        {/* Certification */}
        <div style={{ ...sectionTitle, marginTop: "20px" }}>Certification</div>
        <div className="row g-3">
          <div className="col-sm-4">
            <label style={labelStyle}>Certification Status</label>
            <select style={selectStyle} value={certificationStatus} onChange={(e) => setCertificationStatus(e.target.value)}>
              <option value="CERTIFIED">CERTIFIED</option>
              <option value="PENDING">PENDING</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="REVOKED">REVOKED</option>
            </select>
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Certification Authority</label>
            <input style={inputStyle} placeholder="e.g. DGCA India" value={certificationAuthority} onChange={(e) => setCertificationAuthority(e.target.value)} />
          </div>
          <div className="col-sm-4">
            <label style={labelStyle}>Certification Expiry</label>
            <input style={inputStyle} type="date" value={certificationExpiry} onChange={(e) => setCertificationExpiry(e.target.value)} />
          </div>
        </div>

        {/* VTM Connectivity */}
        <div style={{ ...sectionTitle, marginTop: "20px" }}>VTM Connectivity</div>
        <div className="row g-3">
          <div className="col-sm-6">
            <label style={labelStyle}>VTM Connected</label>
            <select
              style={selectStyle}
              value={isVtmConnected ? "true" : "false"}
              onChange={(e) => {
                const connected = e.target.value === "true";
                setIsVtmConnected(connected);
                setVtmConnectivityStatus(connected ? "CONNECTED" : "DISCONNECTED");
              }}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>Connectivity Status</label>
            <select style={selectStyle} value={vtmConnectivityStatus} onChange={(e) => setVtmConnectivityStatus(e.target.value)}>
              <option value="CONNECTED">CONNECTED</option>
              <option value="DISCONNECTED">DISCONNECTED</option>
              <option value="DEGRADED">DEGRADED</option>
            </select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleCreate}
          disabled={!vertiportName.trim() || !vertiportCode.trim()}
        >
          Create Vertiport
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
