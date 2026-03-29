"use client";

import { useState } from "react";
import { Form } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });
  const [moduleState, setModuleState] = useState({
    id: "M1",
    name: "Sample Module",
    description: "Module description text",
    course: "RS101",
  });

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      <h4>Retrieving Objects</h4>
      <a
        id="wd-retrieve-assignments"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment`}
      >
        Get Assignment
      </a>
      <hr />
      <h4>Retrieving Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment/title`}
      >
        Get Title
      </a>
      <hr />
      <h4>Modifying Properties</h4>
      <a
        id="wd-update-assignment-title"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/title/${encodeURIComponent(assignment.title)}`}
      >
        Update Title
      </a>
      <Form.Control
        className="w-75"
        id="wd-assignment-title"
        value={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />
      <hr />
      <h4>Update score &amp; completed (assignment)</h4>
      <Form.Control
        type="number"
        className="w-25 mb-2"
        id="wd-assignment-score"
        value={assignment.score}
        onChange={(e) =>
          setAssignment({ ...assignment, score: Number(e.target.value) })
        }
      />
      <a
        id="wd-update-assignment-score"
        className="btn btn-secondary me-2"
        href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
      >
        Update Score
      </a>
      <Form.Check
        type="checkbox"
        id="wd-assignment-completed"
        label="Completed"
        checked={assignment.completed}
        onChange={(e) =>
          setAssignment({ ...assignment, completed: e.target.checked })
        }
        className="mb-2"
      />
      <a
        id="wd-update-assignment-completed"
        className="btn btn-secondary"
        href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
      >
        Update Completed
      </a>
      <hr />
      <h4>Module object</h4>
      <a
        id="wd-retrieve-module"
        className="btn btn-primary me-2"
        href={`${HTTP_SERVER}/lab5/module`}
      >
        Get Module
      </a>
      <a
        id="wd-retrieve-module-name"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/module/name`}
      >
        Get Module Name
      </a>
      <hr />
      <a
        id="wd-update-module-name"
        className="btn btn-primary float-end"
        href={`${HTTP_SERVER}/lab5/module/name/${encodeURIComponent(moduleState.name)}`}
      >
        Update Module Name
      </a>
      <Form.Control
        className="w-75 mb-2"
        id="wd-module-name"
        value={moduleState.name}
        onChange={(e) =>
          setModuleState({ ...moduleState, name: e.target.value })
        }
      />
      <a
        id="wd-update-module-description"
        className="btn btn-primary float-end"
        href={`${HTTP_SERVER}/lab5/module/description/${encodeURIComponent(moduleState.description)}`}
      >
        Update Module Description
      </a>
      <Form.Control
        className="w-75"
        id="wd-module-description"
        value={moduleState.description}
        onChange={(e) =>
          setModuleState({ ...moduleState, description: e.target.value })
        }
      />
      <hr />
    </div>
  );
}
