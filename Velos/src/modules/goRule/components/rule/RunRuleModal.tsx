import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

interface RunRuleModalProps {
  show: boolean;
  onClose: () => void;
}

const dummyNodes = [
  { id: "1", name: "Request (Input)" },
  { id: "2", name: "Decision Table" },
  { id: "3", name: "Response (Output)" },
];

const dummyOutput = JSON.stringify(
  { result: true, score: 85, action: "approve" },
  null,
  2
);

const RunRuleModal: React.FC<RunRuleModalProps> = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Run Rule</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <h6>Input</h6>
            <Form.Control
              as="textarea"
              rows={12}
              placeholder='{"amount": 5000, "currency": "USD"}'
              defaultValue={'{\n  "amount": 5000,\n  "currency": "USD"\n}'}
              style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
            />
          </Col>
          <Col md={4}>
            <h6>Nodes</h6>
            <ul className="list-group">
              {dummyNodes.map((node) => (
                <li key={node.id} className="list-group-item py-2">
                  {node.name}
                </li>
              ))}
            </ul>
          </Col>
          <Col md={4}>
            <h6>Output</h6>
            <Form.Control
              as="textarea"
              rows={12}
              readOnly
              value={dummyOutput}
              style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RunRuleModal;
