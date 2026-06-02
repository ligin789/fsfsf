import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Rule } from "../../store/ruleTypes";

interface EditRuleModalProps {
  show: boolean;
  rule: Rule | null;
  onClose: () => void;
  onUpdate: (rule: Rule) => void;
}

const EditRuleModal: React.FC<EditRuleModalProps> = ({
  show,
  rule,
  onClose,
  onUpdate,
}) => {
  const [ruleId, setRuleId] = useState("");
  const [ruleName, setRuleName] = useState("");
  const [alertName, setAlertName] = useState("");

  useEffect(() => {
    if (rule) {
      setRuleId(rule.ruleId);
      setRuleName(rule.ruleName);
      setAlertName(rule.alertName);
    }
  }, [rule]);

  const handleUpdate = () => {
    if (!rule || !ruleId.trim() || !ruleName.trim() || !alertName.trim()) return;
    onUpdate({
      ...rule,
      ruleId: ruleId.trim(),
      ruleName: ruleName.trim(),
      alertName: alertName.trim(),
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Rule</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Rule ID</Form.Label>
            <Form.Control
              type="text"
              value={ruleId}
              onChange={(e) => setRuleId(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rule Name</Form.Label>
            <Form.Control
              type="text"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alert Name</Form.Label>
            <Form.Control
              type="text"
              value={alertName}
              onChange={(e) => setAlertName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditRuleModal;
