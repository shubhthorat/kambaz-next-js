"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Button,
  Dropdown,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { FaCheckCircle, FaEllipsisV, FaPlus } from "react-icons/fa";
import { RootState } from "../../../store";
import { isFacultyLike } from "../../../account/roles";
import * as client from "./client";
import type { Quiz } from "./client";
import { quizAvailabilityText, totalQuestionPoints } from "./quizUtils";

export default function QuizzesPage() {
  const { cid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);
  const faculty = isFacultyLike(currentUser);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastScores, setLastScores] = useState<Record<string, number>>({});

  const load = useCallback(async () => {
    if (!cid) return;
    setLoading(true);
    try {
      const list = await client.findQuizzesForCourse(cid as string);
      setQuizzes(list);
    } catch {
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, [cid]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (faculty || !quizzes.length) return;
    void (async () => {
      const scores: Record<string, number> = {};
      await Promise.all(
        quizzes.map(async (q) => {
          try {
            const att = await client.getMyLastAttempt(q._id);
            if (att) scores[q._id] = att.score;
          } catch {
            /* ignore */
          }
        })
      );
      setLastScores(scores);
    })();
  }, [quizzes, faculty]);

  const onAddQuiz = async () => {
    if (!cid) return;
    const created = await client.createQuizForCourse(cid as string);
    router.push(`/courses/${cid}/quizzes/${created._id}/edit`);
  };

  const persistQuiz = async (next: Quiz) => {
    const saved = await client.updateQuiz(next);
    setQuizzes((prev) => prev.map((q) => (q._id === saved._id ? saved : q)));
    return saved;
  };

  const onDelete = async (quizId: string) => {
    await client.deleteQuiz(quizId);
    await load();
  };

  const onTogglePublish = async (quiz: Quiz) => {
    await persistQuiz({ ...quiz, published: !quiz.published });
  };

  if (loading) {
    return (
      <div className="p-3">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div id="wd-quizzes" className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Quizzes</h2>
        {faculty && (
          <Button variant="danger" size="lg" onClick={() => void onAddQuiz()}>
            <FaPlus className="me-2" />
            Quiz
          </Button>
        )}
      </div>
      <hr />
      {quizzes.length === 0 && (
        <p className="text-muted">
          No quizzes yet.
          {faculty && (
            <>
              {" "}
              Click <strong>+ Quiz</strong> to create one.
            </>
          )}
        </p>
      )}
      <ListGroup className="rounded-0">
        {quizzes.map((q) => {
          const pts = totalQuestionPoints(q.questions);
          const nq = q.questions?.length ?? 0;
          const avail = quizAvailabilityText(q.availableDate, q.untilDate);
          return (
            <ListGroup.Item
              key={q._id}
              className="d-flex justify-content-between align-items-start"
            >
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2">
                  {faculty && (
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none fs-4"
                      title={q.published ? "Published — click to unpublish" : "Unpublished — click to publish"}
                      onClick={() => void onTogglePublish(q)}
                      aria-label={q.published ? "Unpublish" : "Publish"}
                    >
                      {q.published ? (
                        <FaCheckCircle className="text-success" aria-hidden />
                      ) : (
                        <span aria-hidden>🚫</span>
                      )}
                    </button>
                  )}
                  <Link
                    href={`/courses/${cid}/quizzes/${q._id}`}
                    className="fw-bold text-danger text-decoration-none"
                  >
                    {q.title}
                  </Link>
                </div>
                <div className="small text-secondary ms-1 mt-1">
                  <div>
                    <strong>Availability</strong> {avail}
                  </div>
                  <div>
                    <strong>Due</strong> {q.dueDate || "—"}
                  </div>
                  <div>
                    <strong>Points</strong> {pts}
                  </div>
                  <div>
                    <strong>Questions</strong> {nq}
                  </div>
                  {!faculty && (
                    <div>
                      <strong>Score</strong>{" "}
                      {lastScores[q._id] != null
                        ? `${lastScores[q._id]}`
                        : "—"}
                    </div>
                  )}
                </div>
              </div>
              {faculty && (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    className="border-0"
                    id={`wd-quiz-menu-${q._id}`}
                  >
                    <FaEllipsisV />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      href={`/courses/${cid}/quizzes/${q._id}/edit`}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => void onDelete(q._id)}>
                      Delete
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => void onTogglePublish(q)}>
                      {q.published ? "Unpublish" : "Publish"}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}
