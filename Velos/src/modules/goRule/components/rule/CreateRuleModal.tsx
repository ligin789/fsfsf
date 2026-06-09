import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface CreateRuleModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (ruleId: string, ruleName: string, alertName: string) => void;
}

const CreateRuleModal: React.FC<CreateRuleModalProps> = ({
  show,
  onClose,
  onCreate,
}) => {
  const [ruleId, setRuleId] = useState("");
  const [ruleName, setRuleName] = useState("");
  const [alertName, setAlertName] = useState("");

  const handleCreate = () => {
    if (!ruleId.trim() || !ruleName.trim() || !alertName.trim()) return;
    onCreate(ruleId.trim(), ruleName.trim(), alertName.trim());
    setRuleId("");
    setRuleName("");
    setAlertName("");
  };

  const handleClose = () => {
    setRuleId("");
    setRuleName("");
    setAlertName("");
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="gorule-modal">
      <Modal.Header closeButton>
        <Modal.Title>Create Rule</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Rule ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. RULE_004"
              value={ruleId}
              onChange={(e) => setRuleId(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rule Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter rule name"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alert Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter alert name"
              value={alertName}
              onChange={(e) => setAlertName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateRuleModal;
