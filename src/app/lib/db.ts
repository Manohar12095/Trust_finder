import { insforge } from "../insforge-client";

// ====== User Auth ======
export interface User {
  id: string;
  name: string;
  password: string;
  quiz_share_id: string | null;
  created_at: string;
}

export async function registerUser(name: string, password: string): Promise<User | null> {
  const { data, error } = await insforge.database
    .from("users")
    .insert([{ name, password }])
    .select();

  if (error || !data || data.length === 0) {
    console.error("Error registering user:", error);
    return null;
  }
  return data[0] as User;
}

export async function loginUser(name: string, password: string): Promise<User | null> {
  const { data, error } = await insforge.database
    .from("users")
    .select()
    .eq("name", name)
    .eq("password", password);

  if (error || !data || data.length === 0) return null;
  return data[0] as User;
}

export async function updateUserQuizShareId(userId: string, shareId: string) {
  await insforge.database
    .from("users")
    .update({ quiz_share_id: shareId })
    .eq("id", userId);
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await insforge.database
    .from("users")
    .select()
    .eq("id", userId);

  if (error || !data || data.length === 0) return null;
  return data[0] as User;
}

// Get leaderboard for a user's quiz via their stored quiz_share_id
export async function getUserLeaderboard(userId: string) {
  // First get the user to find their quiz_share_id
  const user = await getUserById(userId);
  if (!user || !user.quiz_share_id) return { quiz: null, attempts: [] };

  // Look up the quiz by share_id
  const quiz = await getQuizByShareId(user.quiz_share_id);
  if (!quiz) return { quiz: null, attempts: [] };

  const attempts = await getLeaderboard(quiz.id);
  return { quiz, attempts };
}

// ====== Quiz Types ======

export interface Quiz {
  id: string;
  share_id: string;
  creator_name: string;
  gender: string;
  question_ids: number[];
  created_at: string;
}

export interface QuizAnswer {
  id: string;
  quiz_id: string;
  question_id: number;
  selected_option: "A" | "B";
}

export interface Attempt {
  id: string;
  quiz_id: string;
  friend_name: string;
  score: number;
  created_at: string;
}

export interface AttemptAnswer {
  id: string;
  attempt_id: string;
  question_id: number;
  selected_option: "A" | "B";
}

// Create a new quiz
export async function createQuiz(
  creatorName: string,
  gender: string,
  questionIds: number[],
  answers: { questionId: number; selectedOption: "A" | "B" }[],
  userId?: string
) {
  const shareId = generateShareId();

  const insertData: Record<string, unknown> = {
    share_id: shareId,
    creator_name: creatorName,
    gender,
    question_ids: questionIds,
  };

  if (userId) {
    insertData.user_id = userId;
  }

  const { data: quiz, error: quizError } = await insforge.database
    .from("quizzes")
    .insert([insertData])
    .select()
    .single();

  if (quizError || !quiz) {
    console.error("Error creating quiz:", quizError);
    return null;
  }

  const quizAnswers = answers.map((a) => ({
    quiz_id: quiz.id,
    question_id: a.questionId,
    selected_option: a.selectedOption,
  }));

  const { error: answersError } = await insforge.database
    .from("quiz_answers")
    .insert(quizAnswers);

  if (answersError) {
    console.error("Error saving answers:", answersError);
    return null;
  }

  // Update user's quiz_share_id
  if (userId) {
    await updateUserQuizShareId(userId, shareId);
  }

  return { ...quiz, share_id: shareId } as Quiz;
}

// Get quiz by share ID
export async function getQuizByShareId(shareId: string) {
  const { data, error } = await insforge.database
    .from("quizzes")
    .select()
    .eq("share_id", shareId)
    .single();

  if (error || !data) return null;
  return data as Quiz;
}

// Get quiz answers
export async function getQuizAnswers(quizId: string) {
  const { data, error } = await insforge.database
    .from("quiz_answers")
    .select()
    .eq("quiz_id", quizId);

  if (error || !data) return [];
  return data as QuizAnswer[];
}

// Submit friend's attempt
export async function submitAttempt(
  quizId: string,
  friendName: string,
  answers: { questionId: number; selectedOption: "A" | "B" }[],
  score: number
) {
  const { data: attempt, error: attemptError } = await insforge.database
    .from("attempts")
    .insert([
      {
        quiz_id: quizId,
        friend_name: friendName,
        score,
      },
    ])
    .select()
    .single();

  if (attemptError || !attempt) {
    console.error("Error submitting attempt:", attemptError);
    return null;
  }

  const attemptAnswers = answers.map((a) => ({
    attempt_id: attempt.id,
    question_id: a.questionId,
    selected_option: a.selectedOption,
  }));

  const { error: answersError } = await insforge.database
    .from("attempt_answers")
    .insert(attemptAnswers);

  if (answersError) {
    console.error("Error saving attempt answers:", answersError);
  }

  return attempt as Attempt;
}

// Get leaderboard for a quiz
export async function getLeaderboard(quizId: string) {
  const { data, error } = await insforge.database
    .from("attempts")
    .select()
    .eq("quiz_id", quizId)
    .order("score", { ascending: false });

  if (error || !data) return [];
  return data as Attempt[];
}

// Generate a short, unique share ID
function generateShareId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
