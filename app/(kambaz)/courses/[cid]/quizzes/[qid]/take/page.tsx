"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, Form, Card, Alert } from "react-bootstrap";
import * as client from "../../client";
import type { Quiz, QuizQuestion } from "../../client";
import type { QuizAttempt } from "../../client";

export default function QuizTakePage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [accessCode, setAccessCode] = useState("");
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!qid) return;
    void (async () => {
      try {
        const q = await client.getQuizById(qid as string);
        setQuiz(q);
      } catch {
        setErr("Could not load quiz.");
      } finally {
        setLoading(false);
      }
    })();
  }, [qid]);

  const submit = async () => {
    if (!qid) return;
    setErr(null);
    try {
      const res = await client.submitQuizAttempt(qid as string, {
        answers,
        accessCode: accessCode || undefined,
      });
      setAttempt(res);
      setAnswers((res.answers as Record<string, unknown>) || {});
    } catch (e: unknown) {
      const msg =
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
          ? (e as { response: { data: { message: string } } }).response.data
              .message
          : "Submit failed.";
      setErr(msg);
    }
  };

  if (loading) return <div className="p-3">Loading…</div>;
  if (err && !quiz) return <div className="p-3 text-danger">{err}</div>;
  if (!quiz) return null;

  const showResults = !!attempt;
  const mapById = new Map(
    (attempt?.perQuestion ?? []).map((p) => [p.questionId, p])
  );

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

  return (
    <div className="p-3">
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => router.push(`/courses/${cid}/quizzes/${qid}`)}
      >
        ← Back
      </Button>
      <h3>{quiz.title}</h3>
      {err && <Alert variant="danger">{err}</Alert>}
      {quiz.accessCode ? (
        <Form.Group className="mb-3" style={{ maxWidth: 320 }}>
          <Form.Label>Access code</Form.Label>
          <Form.Control
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            disabled={showResults}
          />
        </Form.Group>
      ) : null}
      {(quiz.questions ?? []).map((q) => {
        const row = mapById.get(q._id);
        return (
          <Card key={q._id} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <strong>{q.title || "Question"}</strong>
                <span className="text-muted">{q.points} pts</span>
              </div>
              <div className="mb-2 small">{q.questionHtml}</div>
              {renderInput(q, showResults)}
              {showResults && row && quiz.showCorrectAnswers !== "Never" && (
                <div
                  className={`mt-2 fw-bold ${row.correct ? "text-success" : "text-danger"}`}
                >
                  {row.correct ? "✓ Correct" : "✗ Incorrect"} ({row.pointsEarned}/
                  {q.points})
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}
      {!showResults && (
        <Button variant="danger" onClick={() => void submit()}>
          Submit Quiz
        </Button>
      )}
      {showResults && (
        <div className="mt-3">
          <p className="fs-5">
            <strong>Your score:</strong> {attempt!.score} / {attempt!.maxScore}
          </p>
          <Link href={`/courses/${cid}/quizzes`} className="btn btn-primary">
            Back to Quizzes
          </Link>
        </div>
      )}
    </div>
  );
}
