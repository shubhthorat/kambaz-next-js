"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../courses/reducer";
import { RootState } from "../store";
import { isFacultyLike } from "../account/roles";
import * as client from "../courses/client";

const defaultCourse = {
  _id: "0",
  name: "New Course",
  number: "New Number",
  startDate: "2023-09-10",
  endDate: "2023-12-15",
  image: "/images/reactjs.jpg",
  description: "New Description",
};

type CourseCard = {
  _id: string;
  name?: string;
  description?: string;
  image?: string;
};

export default function Dashboard() {
  const { courses } = useSelector(
    (state: RootState) => state.coursesReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const faculty = isFacultyLike(currentUser);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<Record<string, unknown>>(defaultCourse);
  const [allCourses, setAllCourses] = useState<CourseCard[]>([]);
  const [view, setView] = useState<"my" | "all">("my");

  const refreshAllCourses = async () => {
    try {
      const all = await client.fetchAllCourses();
      setAllCourses(all);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function load() {
      if (!currentUser?._id) return;
      try {
        const list = await client.findMyCourses();
        dispatch(setCourses(list));
      } catch (e) {
        console.error(e);
      }
    }
    void load();
  }, [currentUser, dispatch]);

  useEffect(() => {
    void refreshAllCourses();
  }, []);

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
    await refreshAllCourses();
    setView("my");
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(
      setCourses(courses.filter((c: { _id: string }) => c._id !== courseId))
    );
    await refreshAllCourses();
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course as { _id: string });
    dispatch(
      setCourses(
        courses.map((c: { _id: string }) =>
          c._id === (course as { _id: string })._id ? course : c
        )
      )
    );
    await refreshAllCourses();
  };

  const onEnroll = async (courseId: string) => {
    await client.enrollInCourse(courseId);
    const list = await client.findMyCourses();
    dispatch(setCourses(list));
    await refreshAllCourses();
  };

  const onUnenroll = async (courseId: string) => {
    await client.unenrollFromCourse(courseId);
    const list = await client.findMyCourses();
    dispatch(setCourses(list));
    await refreshAllCourses();
  };

  const enrolledIds = new Set(courses.map((c: { _id: string }) => c._id));

  return (
    <div id="wd-dashboard" className="p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
        <h1 id="wd-dashboard-title" className="mb-0">
          Dashboard
        </h1>
        <div className="d-flex gap-2">
          <Button
            id="wd-btn-all-courses"
            variant={view === "all" ? "primary" : "outline-primary"}
            onClick={() => setView("all")}
          >
            All Courses
          </Button>
          <Button
            id="wd-btn-my-courses"
            variant={view === "my" ? "primary" : "outline-primary"}
            onClick={() => setView("my")}
          >
            My Courses
          </Button>
        </div>
      </div>
      <hr />
      {faculty && (
        <>
          <h5>
            New Course
            <Button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => void onAddNewCourse()}
            >
              Add
            </Button>
            <Button
              className="btn btn-warning float-end me-2"
              id="wd-update-course-click"
              onClick={() => void onUpdateCourse()}
            >
              Update
            </Button>
          </h5>
          <br />
          <Form.Control
            value={String(course.name ?? "")}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <Form.Control
            value={String(course.description ?? "")}
            rows={3}
            as="textarea"
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}
      {!faculty && view === "my" && courses.length === 0 && (
        <p className="text-muted mb-3">
          You are not enrolled in any courses yet. Open{" "}
          <strong>All Courses</strong> to enroll.
        </p>
      )}
      {view === "my" && (
        <>
          <h2 id="wd-dashboard-published">
            My Courses ({courses.length})
          </h2>
          <hr />
          <div id="wd-dashboard-courses">
            <Row xs={1} md={5} className="g-4">
              {courses.map((c: Record<string, unknown> & { _id: string }) => (
                <Col
                  key={c._id}
                  className="wd-dashboard-course"
                  style={{ width: "300px" }}
                >
                  <Card>
                    <Link
                      href={`/courses/${c._id}/home`}
                      className="wd-dashboard-course-link text-decoration-none text-dark"
                    >
                      <CardImg
                        src={String(c.image || "/images/reactjs.jpg")}
                        variant="top"
                        width="100%"
                        height={160}
                      />
                      <CardBody className="card-body">
                        <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                          {String(c.name)}
                        </CardTitle>
                        <CardText
                          className="wd-dashboard-course-description overflow-hidden"
                          style={{ height: "100px" }}
                        >
                          {String(c.description)}
                        </CardText>
                        <Button variant="primary">Go</Button>
                        {faculty && (
                          <>
                            <Button
                              id="wd-edit-course-click"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setCourse(c);
                              }}
                              className="btn btn-warning me-2 float-end"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                void onDeleteCourse(c._id);
                              }}
                              className="btn btn-danger float-end me-2"
                              id="wd-delete-course-click"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </CardBody>
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </>
      )}

      {view === "all" && (
        <>
          <h2 id="wd-dashboard-catalog">
            All Courses ({allCourses.length})
          </h2>
          <hr />
          <Row xs={1} md={5} className="g-4">
            {allCourses.map((c) => {
              const isEnrolled = enrolledIds.has(c._id);
              return (
                <Col key={c._id} style={{ width: "300px" }}>
                  <Card>
                    <CardImg
                      src={String(c.image || "/images/reactjs.jpg")}
                      variant="top"
                      width="100%"
                      height={160}
                    />
                    <CardBody>
                      <CardTitle className="text-nowrap overflow-hidden">
                        {c.name}
                      </CardTitle>
                      <CardText
                        className="overflow-hidden small"
                        style={{ height: "72px" }}
                      >
                        {c.description}
                      </CardText>
                      <Link
                        href={`/courses/${c._id}/home`}
                        className="btn btn-primary me-2"
                      >
                        Go
                      </Link>
                      {isEnrolled ? (
                        <Button
                          variant="outline-secondary"
                          id={`wd-unenroll-course-${c._id}`}
                          onClick={() => void onUnenroll(c._id)}
                        >
                          Unenroll
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          id={`wd-enroll-course-${c._id}`}
                          onClick={() => void onEnroll(c._id)}
                        >
                          Enroll
                        </Button>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </div>
  );
}
