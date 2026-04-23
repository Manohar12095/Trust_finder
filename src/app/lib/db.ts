import { insforge } from "../insforge-client";

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
  answers: { questionId: number; selectedOption: "A" | "B" }[]
) {
  const shareId = generateShareId();

  const { data: quiz, error: quizError } = await insforge.database
    .from("quizzes")
    .insert([
      {
        share_id: shareId,
        creator_name: creatorName,
        gender,
        question_ids: questionIds,
      },
    ])
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
