import React from "react";
import { Modal, Button } from "react-bootstrap";

interface DeleteConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  show,
  onClose,
  onDelete,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered className="gorule-modal">
      <Modal.Header closeButton>
        <Modal.Title>Delete Rule</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this rule?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
