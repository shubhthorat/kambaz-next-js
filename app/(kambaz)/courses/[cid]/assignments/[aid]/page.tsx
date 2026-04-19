"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  FormSelect,
  FormCheck,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { isFacultyLike } from "../../../../account/roles";
import { setAssignments, updateAssignment } from "../reducer";
import * as assignmentsClient from "../client";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const readOnly = !isFacultyLike(currentUser);
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const assignmentFromStore = assignments.find((a: any) => a._id === aid);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableFrom: "",
    availableUntil: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cid) return;
    void (async () => {
      setLoading(true);
      const list = await assignmentsClient.findAssignmentsForCourse(
        cid as string
      );
      dispatch(setAssignments(list));
      setLoading(false);
    })();
  }, [cid, dispatch]);

  useEffect(() => {
    if (assignmentFromStore) {
      setFormData({
        title: assignmentFromStore.title,
        description: assignmentFromStore.description || "",
        points: assignmentFromStore.points || 100,
        dueDate: assignmentFromStore.dueDate || "",
        availableFrom: assignmentFromStore.availableFrom || "",
        availableUntil: assignmentFromStore.availableUntil || "",
      });
    }
  }, [assignmentFromStore]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (readOnly) return;
    if (!assignmentFromStore || !cid) return;
    const updated = { ...assignmentFromStore, ...formData };
    await assignmentsClient.updateAssignmentOnServer(updated);
    dispatch(updateAssignment(updated));
    const list = await assignmentsClient.findAssignmentsForCourse(
      cid as string
    );
    dispatch(setAssignments(list));
    router.push(`/courses/${cid}/assignments`);
  };

  if (loading) {
    return <div>Loading assignment…</div>;
  }
  if (!assignmentFromStore) {
    return <div>Assignment not found</div>;
  }

  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form>
        <fieldset disabled={readOnly}>
        <Row className="mb-3">
          <Col>
            <FormGroup>
              <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
              <FormControl
                id="wd-name"
                className="form-control"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Assignment Name"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <FormGroup>
              <FormLabel htmlFor="wd-description">Description</FormLabel>
              <FormControl
                as="textarea"
                id="wd-description"
                className="form-control"
                rows={10}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <FormLabel htmlFor="wd-points">Points</FormLabel>
              <FormControl
                type="number"
                id="wd-points"
                className="form-control"
                value={formData.points}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    points: parseInt(e.target.value) || 0,
                  })
                }
              />
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <FormLabel htmlFor="wd-assignment-group">
                Assignment Group
              </FormLabel>
              <FormSelect
                id="wd-assignment-group"
                defaultValue="ASSIGNMENTS"
                className="form-control"
              >
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="PROJECT">PROJECT</option>
              </FormSelect>
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <FormLabel htmlFor="wd-display-grade-as">
                Display Grade as
              </FormLabel>
              <FormSelect
                id="wd-display-grade-as"
                defaultValue="Percentage"
                className="form-control"
              >
                <option value="Percentage">Percentage</option>
                <option value="Points">Points</option>
                <option value="Letter">Letter</option>
              </FormSelect>
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <FormLabel htmlFor="wd-submission-type">
                Submission Type
              </FormLabel>
              <FormSelect
                id="wd-submission-type"
                defaultValue="Online"
                className="form-control"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </FormSelect>
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <FormGroup>
              <FormLabel>Online Entry Options</FormLabel>
              <div className="ps-2">
                <FormCheck
                  type="checkbox"
                  id="wd-online-text-entry"
                  label="Text Entry"
                />
                <FormCheck
                  type="checkbox"
                  id="wd-online-website-url"
                  label="Website URL"
                  defaultChecked
                />
                <FormCheck
                  type="checkbox"
                  id="wd-online-media-recording"
                  label="Media Recording"
                />
                <FormCheck
                  type="checkbox"
                  id="wd-online-student-annotation"
                  label="Student Annotation"
                />
                <FormCheck
                  type="checkbox"
                  id="wd-online-file-upload"
                  label="File Uploads"
                />
              </div>
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <FormLabel htmlFor="wd-assign-to">Assign</FormLabel>
              <FormControl
                id="wd-assign-to"
                className="form-control"
                defaultValue="Everyone"
                placeholder="Everyone"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <FormLabel htmlFor="wd-due-date">Due</FormLabel>
              <FormControl
                type="date"
                id="wd-due-date"
                className="form-control"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <FormLabel htmlFor="wd-available-from">Available from</FormLabel>
              <FormControl
                type="date"
                id="wd-available-from"
                className="form-control"
                value={formData.availableFrom}
                onChange={(e) =>
                  setFormData({ ...formData, availableFrom: e.target.value })
                }
              />
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <FormLabel htmlFor="wd-available-until">Until</FormLabel>
              <FormControl
                type="date"
                id="wd-available-until"
                className="form-control"
                value={formData.availableUntil}
                onChange={(e) =>
                  setFormData({ ...formData, availableUntil: e.target.value })
                }
              />
            </FormGroup>
          </Col>
        </Row>

        </fieldset>
        <Row>
          <Col>
            <hr />
            <div className="d-flex gap-2 float-end">
              <Link href={`/courses/${cid}/assignments`}>
                <Button variant="secondary">Cancel</Button>
              </Link>
              {!readOnly && (
                <Button
                  variant="danger"
                  id="wd-save-assignment"
                  onClick={(e) => void handleSave(e)}
                >
                  Save
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
