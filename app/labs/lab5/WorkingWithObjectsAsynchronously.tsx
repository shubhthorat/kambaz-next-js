"use client";

import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import * as client from "./client";

export default function WorkingWithObjectsAsynchronously() {
  const [assignment, setAssignment] = useState<Record<string, unknown>>({});

  const loadAssignment = async () => {
    const data = await client.fetchAssignment();
    setAssignment(data);
  };

  const saveTitle = async () => {
    const title = String(assignment.title ?? "");
    const updated = await client.updateTitle(title);
    setAssignment(updated);
  };

  useEffect(() => {
    loadAssignment();
  }, []);

  return (
    <div id="wd-asynchronous-objects">
      <h3>Working with Objects Asynchronously</h3>
      <h4>Assignment</h4>
      <Form.Control
        className="mb-2"
        value={String(assignment.title ?? "")}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />
      <Form.Control
        as="textarea"
        rows={3}
        className="mb-2"
        value={String(assignment.description ?? "")}
        onChange={(e) =>
          setAssignment({ ...assignment, description: e.target.value })
        }
      />
      <Form.Control
        type="date"
        className="mb-2"
        value={String(assignment.due ?? "")}
        onChange={(e) =>
          setAssignment({ ...assignment, due: e.target.value })
        }
      />
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="wd-completed"
          checked={Boolean(assignment.completed)}
          onChange={(e) =>
            setAssignment({ ...assignment, completed: e.target.checked })
          }
        />
        <label className="form-check-label" htmlFor="wd-completed">
          Completed
        </label>
      </div>
      <button
        type="button"
        className="btn btn-primary me-2"
        onClick={saveTitle}
      >
        Update Title
      </button>
      <pre>{JSON.stringify(assignment, null, 2)}</pre>
      <hr />
    </div>
  );
}
