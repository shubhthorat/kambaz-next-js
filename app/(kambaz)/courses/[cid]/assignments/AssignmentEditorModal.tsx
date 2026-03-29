"use client";

import { Modal, Form, Button } from "react-bootstrap";

const defaultAssignment = {
  title: "",
  description: "",
  points: 100,
  dueDate: "2023-12-31",
  availableFrom: "2023-01-01",
  availableUntil: "2023-12-31",
};

export default function AssignmentEditorModal({
  show,
  handleClose,
  assignment,
  setAssignment,
  onSave,
  isEdit,
}: {
  show: boolean;
  handleClose: () => void;
  assignment: any;
  setAssignment: (a: any) => void;
  onSave: () => void | Promise<void>;
  isEdit: boolean;
}) {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Edit Assignment" : "Add Assignment"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={assignment?.title ?? ""}
            onChange={(e) =>
              setAssignment({ ...assignment, title: e.target.value })
            }
            placeholder="Assignment title"
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={assignment?.description ?? ""}
            onChange={(e) =>
              setAssignment({ ...assignment, description: e.target.value })
            }
            placeholder="Description"
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Points</Form.Label>
          <Form.Control
            type="number"
            value={assignment?.points ?? 100}
            onChange={(e) =>
              setAssignment({
                ...assignment,
                points: parseInt(e.target.value) || 0,
              })
            }
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="date"
            value={assignment?.dueDate ?? ""}
            onChange={(e) =>
              setAssignment({ ...assignment, dueDate: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Available From</Form.Label>
          <Form.Control
            type="date"
            value={assignment?.availableFrom ?? ""}
            onChange={(e) =>
              setAssignment({ ...assignment, availableFrom: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Available Until</Form.Label>
          <Form.Control
            type="date"
            value={assignment?.availableUntil ?? ""}
            onChange={(e) =>
              setAssignment({ ...assignment, availableUntil: e.target.value })
            }
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            void Promise.resolve(onSave()).then(() => handleClose());
          }}
        >
          {isEdit ? "Update" : "Add Assignment"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export { defaultAssignment };
