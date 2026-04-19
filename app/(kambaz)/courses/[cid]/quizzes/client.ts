import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER!;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

export type QuizQuestion = {
  _id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  title: string;
  points: number;
  questionHtml: string;
  choices?: { text: string; isCorrect: boolean }[];
  correctTrueFalse?: boolean;
  correctBlanks?: string[];
};

export type Quiz = {
  _id: string;
  course: string;
  title: string;
  description?: string;
  quizType: string;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimitMinutes: number;
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate?: string;
  availableDate?: string;
  untilDate?: string;
  published: boolean;
  questions?: QuizQuestion[];
};

export type QuizAttempt = {
  _id: string;
  quiz: string;
  user: string;
  answers: Record<string, unknown>;
  score: number;
  maxScore: number;
  perQuestion: { questionId: string; correct: boolean; pointsEarned: number }[];
  submittedAt: string;
};

export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get<Quiz[]>(
    `${COURSES_API}/${courseId}/quizzes`
  );
  return data;
};

export const createQuizForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.post<Quiz>(
    `${COURSES_API}/${courseId}/quizzes`,
    {}
  );
  return data;
};

export const getQuizById = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get<Quiz>(
    `${QUIZZES_API}/${quizId}`
  );
  return data;
};

export const updateQuiz = async (quiz: Quiz) => {
  const { data } = await axiosWithCredentials.put<Quiz>(
    `${QUIZZES_API}/${quiz._id}`,
    quiz
  );
  return data;
};

export const deleteQuiz = async (quizId: string) => {
  await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
};

export const submitQuizAttempt = async (
  quizId: string,
  body: { answers: Record<string, unknown>; accessCode?: string }
) => {
  const { data } = await axiosWithCredentials.post<QuizAttempt>(
    `${QUIZZES_API}/${quizId}/attempts`,
    body
  );
  return data;
};

export const getMyLastAttempt = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get<QuizAttempt | null>(
    `${QUIZZES_API}/${quizId}/attempts/me`
  );
  return data;
};

export const getMyAttemptCount = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get<{ count: number }>(
    `${QUIZZES_API}/${quizId}/attempts/me/count`
  );
  return data.count;
};
