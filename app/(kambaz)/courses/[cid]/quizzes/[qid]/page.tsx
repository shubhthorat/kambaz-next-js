"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Spinner, Table } from "react-bootstrap";
import { RootState } from "../../../../store";
import { isFacultyLike } from "../../../../account/roles";
import * as client from "../client";
import type { Quiz, QuizAttempt } from "../client";
import { totalQuestionPoints } from "../quizUtils";

const quizTypeLabels: Record<string, string> = {
  GRADED_QUIZ: "Graded Quiz",
  PRACTICE_QUIZ: "Practice Quiz",
  GRADED_SURVEY: "Graded Survey",
  UNGRADED_SURVEY: "Ungraded Survey",
};

export default function QuizDetailsPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);
  const faculty = isFacultyLike(currentUser);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    if (!qid) return;
    void (async () => {
      try {
        const q = await client.getQuizById(qid as string);
        setQuiz(q);
        if (!faculty) {
          const max = q.multipleAttempts
            ? Math.max(1, Number(q.howManyAttempts) || 1)
            : 1;
          setMaxAttempts(max);
          const used = await client.getMyAttemptCount(qid as string);
          setAttemptsUsed(used);
          const last = await client.getMyLastAttempt(qid as string);
          setLastAttempt(last);
        }
      } catch {
        setErr("Unable to load this quiz.");
      }
    })();
  }, [qid, faculty]);

  if (err) {
    return <div className="p-3 text-danger">{err}</div>;
  }
  if (!quiz) {
    return (
      <div className="p-3">
        <Spinner animation="border" />
      </div>
    );
  }

  const pts = totalQuestionPoints(quiz.questions);
  const canStartStudent =
    !faculty &&
    quiz.published &&
    attemptsUsed < maxAttempts;

  return (
    <div className="p-3">
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button variant="secondary" onClick={() => router.push(`/courses/${cid}/quizzes`)}>
          ← Quizzes
        </Button>
        {faculty && (
          <>
            <Button
              variant={quiz.published ? "warning" : "success"}
              onClick={() =>
                void (async () => {
                  const saved = await client.updateQuiz({
                    ...quiz,
                    published: !quiz.published,
                  });
                  setQuiz(saved);
                })()
              }
            >
              {quiz.published ? "Unpublish" : "Publish"}
            </Button>
            <Link
              className="btn btn-secondary"
              href={`/courses/${cid}/quizzes/${qid}/preview`}
            >
              Preview
            </Link>
            <Link
              className="btn btn-primary"
              href={`/courses/${cid}/quizzes/${qid}/edit`}
            >
              Edit
            </Link>
          </>
        )}
        {!faculty && (
          <Link
            className={`btn ${canStartStudent ? "btn-danger" : "btn-outline-secondary"}`}
            href={canStartStudent ? `/courses/${cid}/quizzes/${qid}/take` : "#"}
            onClick={(e) => {
              if (!canStartStudent) e.preventDefault();
            }}
          >
            {attemptsUsed >= maxAttempts ? "No attempts left" : "Start Quiz"}
          </Link>
        )}
      </div>
      <h3>{quiz.title}</h3>
      {faculty ? (
        <Table bordered size="sm" className="mt-3" style={{ maxWidth: 640 }}>
          <tbody>
            <tr>
              <th scope="row">Quiz Type</th>
              <td>{quizTypeLabels[quiz.quizType] ?? quiz.quizType}</td>
            </tr>
            <tr>
              <th scope="row">Points</th>
              <td>{pts}</td>
            </tr>
            <tr>
              <th scope="row">Assignment Group</th>
              <td>{quiz.assignmentGroup}</td>
            </tr>
            <tr>
              <th scope="row">Shuffle Answers</th>
              <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <th scope="row">Time Limit</th>
              <td>
                {(quiz.timeLimitMinutes ?? 0) > 0
                  ? `${quiz.timeLimitMinutes} minutes`
                  : "No limit"}
              </td>
            </tr>
            <tr>
              <th scope="row">Multiple Attempts</th>
              <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <th scope="row">How Many Attempts</th>
              <td>{quiz.howManyAttempts}</td>
            </tr>
            <tr>
              <th scope="row">Show Correct Answers</th>
              <td>{quiz.showCorrectAnswers}</td>
            </tr>
            <tr>
              <th scope="row">Access Code</th>
              <td>{quiz.accessCode || "—"}</td>
            </tr>
            <tr>
              <th scope="row">One Question at a Time</th>
              <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <th scope="row">Webcam Required</th>
              <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <th scope="row">Lock Questions After Answering</th>
              <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <th scope="row">Due date</th>
              <td>{quiz.dueDate || "—"}</td>
            </tr>
            <tr>
              <th scope="row">Available date</th>
              <td>{quiz.availableDate || "—"}</td>
            </tr>
            <tr>
              <th scope="row">Until date</th>
              <td>{quiz.untilDate || "—"}</td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <div className="text-muted mt-2">
          {lastAttempt && (
            <p>
              <strong>Last attempt score:</strong> {lastAttempt.score} /{" "}
              {lastAttempt.maxScore}
            </p>
          )}
          <p>
            Use <strong>Start Quiz</strong> when you are ready. You have{" "}
            {Math.max(0, maxAttempts - attemptsUsed)} attempt(s) remaining.
          </p>
        </div>
      )}
    </div>
  );
}
