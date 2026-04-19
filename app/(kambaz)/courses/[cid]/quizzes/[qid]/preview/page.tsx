"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { isFacultyLike } from "../../../../../account/roles";
import { Button, Form, Card, ButtonGroup } from "react-bootstrap";
import * as client from "../../client";
import type { Quiz, QuizQuestion } from "../../client";
import { scoreAnswerClient } from "../../quizUtils";

export default function QuizPreviewPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);
  const [perQ, setPerQ] = useState<
    { id: string; correct: boolean; earned: number; max: number }[]
  >([]);
  const [total, setTotal] = useState({ score: 0, max: 0 });
  const [qIndex, setQIndex] = useState(0);

  useEffect(() => {
    if (currentUser && !isFacultyLike(currentUser) && cid && qid) {
      router.replace(`/courses/${cid}/quizzes/${qid}`);
    }
  }, [currentUser, cid, qid, router]);

  useEffect(() => {
    if (!qid) return;
    void client.getQuizById(qid as string).then(setQuiz);
  }, [qid]);

  const questions = quiz?.questions ?? [];
  const n = questions.length;
  const safeIndex = n ? Math.min(Math.max(0, qIndex), n - 1) : 0;
  const current = questions[safeIndex];

  useEffect(() => {
    if (qIndex > 0 && n > 0 && qIndex >= n) setQIndex(n - 1);
  }, [n, qIndex]);

  const runSubmit = () => {
    if (!quiz) return;
    const rows: typeof perQ = [];
    let score = 0;
    let max = 0;
    for (const q of quiz.questions ?? []) {
      const full = Number(q.points) || 0;
      max += full;
      const earned = scoreAnswerClient(q, answers[q._id]);
      score += earned;
      rows.push({
        id: q._id,
        correct: full > 0 && earned === full,
        earned,
        max: full,
      });
    }
    setPerQ(rows);
    setTotal({ score, max });
    setSubmitted(true);
    setQIndex(0);
  };

  const renderInput = (q: QuizQuestion, locked: boolean) => {
    if (q.type === "MULTIPLE_CHOICE") {
      return (q.choices ?? []).map((c, idx) => (
        <Form.Check
          key={idx}
          type="radio"
          name={q._id}
          label={c.text || `Choice ${idx + 1}`}
          checked={Number(answers[q._id]) === idx}
          onChange={() =>
            setAnswers((a) => ({ ...a, [q._id]: idx }))
          }
          disabled={locked}
        />
      ));
    }
    if (q.type === "TRUE_FALSE") {
      return (
        <>
          <Form.Check
            type="radio"
            name={q._id}
            label="True"
            checked={answers[q._id] === true || answers[q._id] === "true"}
            onChange={() =>
              setAnswers((a) => ({ ...a, [q._id]: true }))
            }
            disabled={locked}
          />
          <Form.Check
            type="radio"
            name={q._id}
            label="False"
            checked={answers[q._id] === false || answers[q._id] === "false"}
            onChange={() =>
              setAnswers((a) => ({ ...a, [q._id]: false }))
            }
            disabled={locked}
          />
        </>
      );
    }
    return (
      <Form.Control
        value={String(answers[q._id] ?? "")}
        onChange={(e) =>
          setAnswers((a) => ({ ...a, [q._id]: e.target.value }))
        }
        disabled={locked}
      />
    );
  };

  if (!quiz) return <div className="p-3">Loading…</div>;

  const row = current ? perQ.find((p) => p.id === current._id) : undefined;

  return (
    <div className="p-3">
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Link
          className="btn btn-secondary"
          href={`/courses/${cid}/quizzes/${qid}`}
        >
          ← Quiz
        </Link>
        <Link
          className="btn btn-primary"
          href={`/courses/${cid}/quizzes/${qid}/edit?tab=questions`}
        >
          Edit Quiz
        </Link>
      </div>
      <h3>Preview: {quiz.title}</h3>
      <p className="text-muted small">
        This preview is not saved. Faculty answers are not stored on the server.
      </p>
      {n === 0 && <p className="text-muted">No questions in this quiz yet.</p>}
      {n > 0 && current && (
        <>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <ButtonGroup size="sm">
              <Button
                variant="outline-secondary"
                disabled={safeIndex <= 0}
                onClick={() => setQIndex((i) => Math.max(0, i - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline-secondary"
                disabled={safeIndex >= n - 1}
                onClick={() => setQIndex((i) => Math.min(n - 1, i + 1))}
              >
                Next
              </Button>
            </ButtonGroup>
            <span className="small text-muted">
              Question {safeIndex + 1} of {n}
            </span>
          </div>
          <div className="d-flex flex-wrap gap-1 mb-3">
            {questions.map((_, i) => (
              <Button
                key={questions[i]._id}
                size="sm"
                variant={i === safeIndex ? "primary" : "outline-secondary"}
                onClick={() => setQIndex(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <strong>{current.title || "Question"}</strong>
                <span className="text-muted">{current.points} pts</span>
              </div>
              <div className="mb-2 small">{current.questionHtml}</div>
              {renderInput(current, submitted)}
              {submitted && row && (
                <div
                  className={`mt-2 fw-bold ${row.correct ? "text-success" : "text-danger"}`}
                >
                  {row.correct ? "✓ Correct" : "✗ Incorrect"} ({row.earned}/
                  {row.max})
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      )}
      {!submitted && n > 0 && (
        <Button variant="danger" onClick={runSubmit}>
          Submit Preview
        </Button>
      )}
      {submitted && (
        <div className="mt-3 fs-5">
          <strong>Score:</strong> {total.score} / {total.max}
          <p className="small text-muted mb-0 mt-2">
            Use the question numbers above to review each item.
          </p>
        </div>
      )}
    </div>
  );
}
