"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { isFacultyLike } from "../../../../../account/roles";
import { Button, Form, Nav, Card } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import * as client from "../../client";
import type { Quiz, QuizQuestion } from "../../client";
import { totalQuestionPoints } from "../../quizUtils";

const defaultMcQuestion = (): QuizQuestion => ({
  _id: uuidv4(),
  type: "MULTIPLE_CHOICE",
  title: "",
  points: 1,
  questionHtml: "",
  choices: [
    { text: "Choice A", isCorrect: true },
    { text: "Choice B", isCorrect: false },
  ],
});

export default function QuizEditPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [tab, setTab] = useState<"details" | "questions">("details");
  /** false = preview mode (rubric), true = full edit */
  const [questionEditOpen, setQuestionEditOpen] = useState<
    Record<string, boolean>
  >({});
  const [questionSnap, setQuestionSnap] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (!qid) return;
    const q = await client.getQuizById(qid as string);
    setQuiz(q);
    setQuestionEditOpen({});
    setQuestionSnap({});
  }, [qid]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (currentUser && !isFacultyLike(currentUser) && cid && qid) {
      router.replace(`/courses/${cid}/quizzes/${qid}`);
    }
  }, [currentUser, cid, qid, router]);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t === "questions") setTab("questions");
  }, [qid]);

  const saveBody = async (next: Quiz) => {
    const saved = await client.updateQuiz(next);
    setQuiz(saved);
    return saved;
  };

  const onSave = async () => {
    if (!quiz) return;
    await saveBody(quiz);
    router.push(`/courses/${cid}/quizzes/${qid}`);
  };

  const onSaveAndPublish = async () => {
    if (!quiz) return;
    await saveBody({ ...quiz, published: true });
    router.push(`/courses/${cid}/quizzes`);
  };

  const onCancel = () => {
    router.push(`/courses/${cid}/quizzes`);
  };

  const addQuestion = () => {
    if (!quiz) return;
    const nq = defaultMcQuestion();
    setQuiz({
      ...quiz,
      questions: [...(quiz.questions ?? []), nq],
    });
    setQuestionEditOpen((m) => ({ ...m, [nq._id]: true }));
  };

  const openQuestionEdit = (q: QuizQuestion) => {
    setQuestionSnap((s) => ({ ...s, [q._id]: JSON.stringify(q) }));
    setQuestionEditOpen((m) => ({ ...m, [q._id]: true }));
  };

  const cancelQuestionEdit = (qidStr: string) => {
    const snap = questionSnap[qidStr];
    if (snap && quiz) {
      const restored = JSON.parse(snap) as QuizQuestion;
      setQuiz({
        ...quiz,
        questions: (quiz.questions ?? []).map((qq) =>
          qq._id === qidStr ? restored : qq
        ),
      });
    }
    setQuestionEditOpen((m) => ({ ...m, [qidStr]: false }));
  };

  const saveQuestionToServer = async (qidStr: string) => {
    if (!quiz) return;
    const saved = await saveBody(quiz);
    const updated = (saved.questions ?? []).find((qq) => qq._id === qidStr);
    if (updated) {
      setQuestionSnap((s) => ({ ...s, [qidStr]: JSON.stringify(updated) }));
    }
    setQuestionEditOpen((m) => ({ ...m, [qidStr]: false }));
  };

  const updateQuestion = (id: string, patch: Partial<QuizQuestion>) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      questions: (quiz.questions ?? []).map((q) =>
        q._id === id ? { ...q, ...patch } : q
      ),
    });
  };

  const removeQuestion = (id: string) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      questions: (quiz.questions ?? []).filter((q) => q._id !== id),
    });
    setQuestionEditOpen((m) => {
      const next = { ...m };
      delete next[id];
      return next;
    });
    setQuestionSnap((s) => {
      const next = { ...s };
      delete next[id];
      return next;
    });
  };

  if (!quiz) {
    return <div className="p-3">Loading…</div>;
  }

  const pts = totalQuestionPoints(quiz.questions);

  return (
    <div className="p-3">
      <h3>Edit Quiz</h3>
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link
            active={tab === "details"}
            onClick={(e) => {
              e.preventDefault();
              setTab("details");
            }}
            href="#"
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={tab === "questions"}
            onClick={(e) => {
              e.preventDefault();
              setTab("questions");
            }}
            href="#"
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {tab === "details" && (
        <div className="d-flex flex-column gap-2" style={{ maxWidth: 720 }}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={quiz.description ?? ""}
              onChange={(e) =>
                setQuiz({ ...quiz, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Quiz Type</Form.Label>
            <Form.Select
              value={quiz.quizType}
              onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
            >
              <option value="GRADED_QUIZ">Graded Quiz</option>
              <option value="PRACTICE_QUIZ">Practice Quiz</option>
              <option value="GRADED_SURVEY">Graded Survey</option>
              <option value="UNGRADED_SURVEY">Ungraded Survey</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Points (sum of question points)</Form.Label>
            <Form.Control type="number" readOnly value={pts} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Assignment Group</Form.Label>
            <Form.Select
              value={quiz.assignmentGroup}
              onChange={(e) =>
                setQuiz({ ...quiz, assignmentGroup: e.target.value })
              }
            >
              <option>Quizzes</option>
              <option>Exams</option>
              <option>Assignments</option>
              <option>Project</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="d-flex align-items-center gap-2">
            <Form.Check
              type="checkbox"
              id="wd-shuffle-answers"
              label="Shuffle answers"
              checked={quiz.shuffleAnswers}
              onChange={(e) =>
                setQuiz({ ...quiz, shuffleAnswers: e.target.checked })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              id="wd-time-limit-enabled"
              className="mb-2"
              label="Time limit"
              checked={(quiz.timeLimitMinutes ?? 0) > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setQuiz({
                    ...quiz,
                    timeLimitMinutes:
                      quiz.timeLimitMinutes && quiz.timeLimitMinutes > 0
                        ? quiz.timeLimitMinutes
                        : 20,
                  });
                } else {
                  setQuiz({ ...quiz, timeLimitMinutes: 0 });
                }
              }}
            />
            <Form.Control
              type="number"
              min={1}
              disabled={!quiz.timeLimitMinutes || quiz.timeLimitMinutes <= 0}
              value={quiz.timeLimitMinutes > 0 ? quiz.timeLimitMinutes : 20}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  timeLimitMinutes: Number(e.target.value) || 20,
                })
              }
            />
            <Form.Text muted>
              Uncheck for no time limit (0 minutes).
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Multiple Attempts</Form.Label>
            <Form.Select
              value={quiz.multipleAttempts ? "yes" : "no"}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  multipleAttempts: e.target.value === "yes",
                })
              }
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>How Many Attempts</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={quiz.howManyAttempts}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  howManyAttempts: Number(e.target.value) || 1,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Show Correct Answers</Form.Label>
            <Form.Select
              value={quiz.showCorrectAnswers}
              onChange={(e) =>
                setQuiz({ ...quiz, showCorrectAnswers: e.target.value })
              }
            >
              <option value="Never">Never</option>
              <option value="Immediately">Immediately</option>
              <option value="AfterLastAttempt">After last attempt</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Access Code</Form.Label>
            <Form.Control
              value={quiz.accessCode ?? ""}
              onChange={(e) =>
                setQuiz({ ...quiz, accessCode: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>One Question at a Time</Form.Label>
            <Form.Select
              value={quiz.oneQuestionAtATime ? "yes" : "no"}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  oneQuestionAtATime: e.target.value === "yes",
                })
              }
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Webcam Required</Form.Label>
            <Form.Select
              value={quiz.webcamRequired ? "yes" : "no"}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  webcamRequired: e.target.value === "yes",
                })
              }
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Lock Questions After Answering</Form.Label>
            <Form.Select
              value={quiz.lockQuestionsAfterAnswering ? "yes" : "no"}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  lockQuestionsAfterAnswering: e.target.value === "yes",
                })
              }
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Due date</Form.Label>
            <Form.Control
              type="date"
              value={quiz.dueDate?.slice(0, 10) ?? ""}
              onChange={(e) =>
                setQuiz({ ...quiz, dueDate: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Available date</Form.Label>
            <Form.Control
              type="date"
              value={quiz.availableDate?.slice(0, 10) ?? ""}
              onChange={(e) =>
                setQuiz({ ...quiz, availableDate: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Until date</Form.Label>
            <Form.Control
              type="date"
              value={quiz.untilDate?.slice(0, 10) ?? ""}
              onChange={(e) =>
                setQuiz({ ...quiz, untilDate: e.target.value })
              }
            />
          </Form.Group>
        </div>
      )}

      {tab === "questions" && (
        <div>
          <div className="mb-2">
            <strong>Total points:</strong> {pts}
          </div>
          <Button className="mb-3" variant="primary" onClick={addQuestion}>
            + New Question
          </Button>
          {(quiz.questions ?? []).map((q) => {
            const isEdit = questionEditOpen[q._id] === true;
            const typeLabel =
              q.type === "MULTIPLE_CHOICE"
                ? "Multiple choice"
                : q.type === "TRUE_FALSE"
                  ? "True / False"
                  : "Fill in the blank";
            const previewText = (q.questionHtml || "").trim();
            return (
              <Card key={q._id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="text-muted small">{typeLabel}</span>
                    <div className="d-flex gap-2">
                      {!isEdit && (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openQuestionEdit(q)}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeQuestion(q._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  {!isEdit ? (
                    <>
                      <h6 className="mb-1">{q.title || "Untitled question"}</h6>
                      <p className="small text-secondary mb-0">
                        {q.points} pts
                        {previewText
                          ? ` · ${previewText.length > 140 ? `${previewText.slice(0, 140)}…` : previewText}`
                          : ""}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between mb-3">
                        <Form.Select
                          style={{ maxWidth: 220 }}
                          value={q.type}
                          onChange={(e) => {
                            const t = e.target.value as QuizQuestion["type"];
                            if (t === "MULTIPLE_CHOICE") {
                              updateQuestion(q._id, {
                                type: t,
                                choices: [
                                  { text: "", isCorrect: true },
                                  { text: "", isCorrect: false },
                                ],
                              });
                            } else if (t === "TRUE_FALSE") {
                              updateQuestion(q._id, {
                                type: t,
                                correctTrueFalse: true,
                                choices: undefined,
                              });
                            } else {
                              updateQuestion(q._id, {
                                type: t,
                                correctBlanks: [""],
                                choices: undefined,
                              });
                            }
                          }}
                        >
                          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                          <option value="TRUE_FALSE">True/False</option>
                          <option value="FILL_BLANK">Fill in the Blank</option>
                        </Form.Select>
                      </div>
                      <Form.Group className="mb-2">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          value={q.title}
                          onChange={(e) =>
                            updateQuestion(q._id, { title: e.target.value })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Points</Form.Label>
                        <Form.Control
                          type="number"
                          min={0}
                          value={q.points}
                          onChange={(e) =>
                            updateQuestion(q._id, {
                              points: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Question</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={q.questionHtml}
                          onChange={(e) =>
                            updateQuestion(q._id, {
                              questionHtml: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      {q.type === "MULTIPLE_CHOICE" && (
                        <div>
                          <Form.Label>Choices</Form.Label>
                          {(q.choices ?? []).map((c, idx) => (
                            <div
                              key={idx}
                              className="d-flex align-items-start gap-2 mb-2"
                            >
                              <Form.Check
                                type="radio"
                                name={`correct-${q._id}`}
                                checked={!!c.isCorrect}
                                onChange={() => {
                                  const choices = (q.choices ?? []).map(
                                    (ch, j) => ({
                                      ...ch,
                                      isCorrect: j === idx,
                                    })
                                  );
                                  updateQuestion(q._id, { choices });
                                }}
                              />
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={c.text}
                                onChange={(e) => {
                                  const choices = [...(q.choices ?? [])];
                                  choices[idx] = {
                                    ...choices[idx],
                                    text: e.target.value,
                                  };
                                  updateQuestion(q._id, { choices });
                                }}
                              />
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={() => {
                                  const choices = [...(q.choices ?? [])];
                                  choices.splice(idx, 1);
                                  updateQuestion(q._id, { choices });
                                }}
                              >
                                −
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() =>
                              updateQuestion(q._id, {
                                choices: [
                                  ...(q.choices ?? []),
                                  { text: "", isCorrect: false },
                                ],
                              })
                            }
                          >
                            Add choice
                          </Button>
                        </div>
                      )}
                      {q.type === "TRUE_FALSE" && (
                        <Form.Group>
                          <Form.Label>Correct answer</Form.Label>
                          <div>
                            <Form.Check
                              type="radio"
                              name={`tf-${q._id}`}
                              id={`tf-true-${q._id}`}
                              label="True"
                              checked={q.correctTrueFalse === true}
                              onChange={() =>
                                updateQuestion(q._id, {
                                  correctTrueFalse: true,
                                })
                              }
                            />
                            <Form.Check
                              type="radio"
                              name={`tf-${q._id}`}
                              id={`tf-false-${q._id}`}
                              label="False"
                              checked={q.correctTrueFalse === false}
                              onChange={() =>
                                updateQuestion(q._id, {
                                  correctTrueFalse: false,
                                })
                              }
                            />
                          </div>
                        </Form.Group>
                      )}
                      {q.type === "FILL_BLANK" && (
                        <div>
                          <Form.Label>
                            Correct answers for the blank (case-insensitive
                            match)
                          </Form.Label>
                          {(q.correctBlanks ?? []).map((b, idx) => (
                            <div key={idx} className="d-flex gap-2 mb-2">
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={b}
                                onChange={(e) => {
                                  const correctBlanks = [
                                    ...(q.correctBlanks ?? []),
                                  ];
                                  correctBlanks[idx] = e.target.value;
                                  updateQuestion(q._id, { correctBlanks });
                                }}
                              />
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={() => {
                                  const correctBlanks = [
                                    ...(q.correctBlanks ?? []),
                                  ];
                                  correctBlanks.splice(idx, 1);
                                  updateQuestion(q._id, { correctBlanks });
                                }}
                              >
                                −
                              </Button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() =>
                              updateQuestion(q._id, {
                                correctBlanks: [
                                  ...(q.correctBlanks ?? []),
                                  "",
                                ],
                              })
                            }
                          >
                            Add accepted answer
                          </Button>
                        </div>
                      )}
                      <div className="d-flex gap-2 mt-3">
                        <Button
                          variant="secondary"
                          onClick={() => cancelQuestionEdit(q._id)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => void saveQuestionToServer(q._id)}
                        >
                          Update Question
                        </Button>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            );
          })}
          <div className="d-flex gap-2 mt-4 pt-3 border-top">
            <Button variant="primary" onClick={() => void onSave()}>
              Save
            </Button>
            <Button variant="success" onClick={() => void onSaveAndPublish()}>
              Save &amp; Publish
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {tab === "details" && (
        <div className="d-flex gap-2 mt-4">
          <Button variant="primary" onClick={() => void onSave()}>
            Save
          </Button>
          <Button variant="success" onClick={() => void onSaveAndPublish()}>
            Save &amp; Publish
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
