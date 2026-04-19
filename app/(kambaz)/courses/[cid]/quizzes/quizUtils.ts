export function quizAvailabilityText(
  availableDate?: string,
  untilDate?: string
): string {
  const now = Date.now();
  if (availableDate) {
    const av = new Date(availableDate).getTime();
    if (!Number.isNaN(av) && now < av) {
      return `Not available until ${availableDate}`;
    }
  }
  if (untilDate) {
    const un = new Date(untilDate).getTime();
    if (!Number.isNaN(un) && now > un) {
      return "Closed";
    }
  }
  return "Available";
}

export function totalQuestionPoints(
  questions: { points?: number }[] | undefined
) {
  if (!questions?.length) return 0;
  return questions.reduce((s, q) => s + (Number(q.points) || 0), 0);
}

type QChoice = { text?: string; isCorrect?: boolean };
type QBase = {
  type?: string;
  points?: number;
  choices?: QChoice[];
  correctTrueFalse?: boolean;
  correctBlanks?: string[];
};

export function scoreAnswerClient(question: QBase, rawAnswer: unknown) {
  const pts = Number(question.points) || 0;
  if (question.type === "MULTIPLE_CHOICE") {
    const idx = Number(rawAnswer);
    const choice = question.choices?.[idx];
    return choice?.isCorrect ? pts : 0;
  }
  if (question.type === "TRUE_FALSE") {
    const v =
      rawAnswer === true ||
      rawAnswer === "true" ||
      rawAnswer === "True";
    return !!v === !!question.correctTrueFalse ? pts : 0;
  }
  if (question.type === "FILL_BLANK") {
    const a = String(rawAnswer ?? "").trim().toLowerCase();
    const blanks = question.correctBlanks || [];
    const ok = blanks.some((b) => String(b).trim().toLowerCase() === a);
    return ok ? pts : 0;
  }
  return 0;
}
