"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { BsGripVertical } from "react-icons/bs";
import {
  FaCheckCircle,
  FaEllipsisV,
  FaPlus,
  FaSearch,
  FaPencilAlt,
  FaTrash,
} from "react-icons/fa";
import { RootState } from "../../../store";
import { isFacultyLike } from "../../../account/roles";
import { setAssignments } from "./reducer";
import AssignmentEditorModal, {
  defaultAssignment,
} from "./AssignmentEditorModal";
import * as assignmentsClient from "./client";

function SectionControls() {
  return (
    <div className="float-end">
      <FaCheckCircle className="text-success me-1" />
      <FaPlus className="ms-1" />
      <FaEllipsisV className="ms-1 fs-4" />
    </div>
  );
}

function ItemControls({
  assignmentId,
  onEdit,
  onDelete,
  readOnly,
}: {
  assignmentId: string;
  onEdit: () => void;
  onDelete: () => void;
  readOnly?: boolean;
}) {
  if (readOnly) return null;
  return (
    <div className="float-end">
      <FaPencilAlt
        className="text-primary me-2"
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.preventDefault();
          onEdit();
        }}
        role="button"
      />
      <FaTrash
        className="text-danger me-2"
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.preventDefault();
          onDelete();
        }}
        role="button"
      />
      <FaCheckCircle className="text-success me-1" />
      <FaEllipsisV className="ms-1 fs-4" />
    </div>
  );
}

export default function Assignments() {
  const { cid } = useParams();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const readOnly = !isFacultyLike(currentUser);
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const dispatch = useDispatch();
  const courseAssignments = assignments.filter((a: any) => a.course === cid);

  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [assignmentForm, setAssignmentForm] = useState<any>({
    ...defaultAssignment,
    course: cid,
  });

  const refetchAssignments = useCallback(async () => {
    if (!cid) return;
    const list = await assignmentsClient.findAssignmentsForCourse(
      cid as string
    );
    dispatch(setAssignments(list));
  }, [cid, dispatch]);

  useEffect(() => {
    void refetchAssignments();
  }, [refetchAssignments]);

  const handleClose = () => {
    setShowModal(false);
    setEditingAssignment(null);
    setAssignmentForm({ ...defaultAssignment, course: cid });
  };

  const handleShowAdd = () => {
    setEditingAssignment(null);
    setAssignmentForm({ ...defaultAssignment, course: cid });
    setShowModal(true);
  };

  const handleEdit = (a: any) => {
    setEditingAssignment(a);
    setAssignmentForm({
      ...a,
      title: a.title,
      description: a.description,
      points: a.points,
      dueDate: a.dueDate,
      availableFrom: a.availableFrom,
      availableUntil: a.availableUntil,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!cid) return;
    if (editingAssignment) {
      const merged = { ...editingAssignment, ...assignmentForm };
      await assignmentsClient.updateAssignmentOnServer(merged);
    } else {
      await assignmentsClient.createAssignmentForCourse(
        cid as string,
        assignmentForm
      );
    }
    await refetchAssignments();
  };

  const handleDelete = async (assignmentId: string) => {
    await assignmentsClient.deleteAssignmentOnServer(assignmentId);
    await refetchAssignments();
  };

  return (
    <div id="wd-assignments">
      <div className="text-nowrap mb-4">
        <div
          className="input-group flex-grow-1 d-inline-block"
          style={{ maxWidth: "400px" }}
        >
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search for Assignments"
            id="wd-search-assignment"
            aria-label="Search for Assignments"
          />
        </div>
        {!readOnly && (
          <>
            <button
              type="button"
              className="btn btn-danger btn-lg float-end ms-1"
              id="wd-add-assignment"
              onClick={handleShowAdd}
            >
              <FaPlus
                className="position-relative me-2"
                style={{ bottom: "1px" }}
              />
              Assignment
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg float-end"
              id="wd-add-assignment-group"
            >
              Group
            </button>
          </>
        )}
      </div>
      <br />
      <br />
      <br />

      <div className="wd-module p-0 mb-5 fs-5 border border-secondary rounded-0">
        <div className="wd-title p-3 ps-2 bg-secondary">
          <BsGripVertical className="me-2 fs-3" />
          ASSIGNMENTS
          <SectionControls />
        </div>
        <ul className="list-group wd-lessons rounded-0">
          {courseAssignments.map((a: any) => (
            <li
              key={a._id}
              className="list-group-item wd-lesson p-3 ps-1 border-0"
            >
              <BsGripVertical className="me-2 fs-3" />
              <Link
                href={`/courses/${cid}/assignments/${a._id}`}
                className="wd-assignment-link fw-bold text-danger text-decoration-none"
              >
                {a.title}
              </Link>
              <span className="text-secondary small ms-1">
                Multiple Modules | Not available until {a.availableFrom} | Due{" "}
                {a.dueDate} | {a.points} pts
              </span>
              <ItemControls
                assignmentId={a._id}
                onEdit={() => handleEdit(a)}
                onDelete={() => void handleDelete(a._id)}
                readOnly={readOnly}
              />
            </li>
          ))}
        </ul>
      </div>

      {!readOnly && (
        <AssignmentEditorModal
          show={showModal}
          handleClose={handleClose}
          assignment={assignmentForm}
          setAssignment={setAssignmentForm}
          onSave={handleSave}
          isEdit={!!editingAssignment}
        />
      )}
    </div>
  );
}
