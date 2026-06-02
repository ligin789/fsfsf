import { useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import type { Operator } from "./OperatorCard";

interface CreateOperatorModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (operator: Operator) => void;
  nextId: string;
}

export default function CreateOperatorModal({ show, onClose, onCreate, nextId }: CreateOperatorModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName("");
    setCode("");
    setLocation("");
    setContactEmail("");
    setContactPhone("");
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (!name.trim() || !code.trim() || !location.trim()) return;

    const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=2563EB&color=fff&size=128&bold=true`;

    const newOperator: Operator = {
      id: nextId,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      location: location.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      createdDate: new Date().toISOString().split("T")[0],
      status: "PENDING_L1",
      logo: logoPreview || fallbackLogo,
    };

    onCreate(newOperator);
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

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A" }}>
          New Operator
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3">
          <div className="col-sm-6">
            <label style={labelStyle}>Operator Name *</label>
            <input
              style={inputStyle}
              placeholder="Enter operator name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>Operator Code *</label>
            <input
              style={inputStyle}
              placeholder="e.g. SPAM"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>Location *</label>
            <input
              style={inputStyle}
              placeholder="City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>Contact Email</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="email@example.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>Contact Phone</label>
            <input
              style={inputStyle}
              type="tel"
              placeholder="+91-XXXXXXXXXX"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>
          <div className="col-sm-6">
            <label style={labelStyle}>Operator Logo</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Logo Preview */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: logoPreview ? "transparent" : "#F1F5F9",
                  border: "2px dashed #CBD5E1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                  />
                ) : (
                  <span style={{ fontSize: "0.7rem", color: "#94A3B8", textAlign: "center" }}>Logo</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <input
                  ref={fileInputRef}
                  style={{ ...inputStyle, padding: "8px 12px" }}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                <span style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "4px", display: "block" }}>
                  Upload operator logo (displayed as circle)
                </span>
              </div>
            </div>
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
          disabled={!name.trim() || !code.trim() || !location.trim()}
        >
          Create Operator
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
