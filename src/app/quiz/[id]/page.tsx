"use client";

import { useState, useEffect, useCallback, use } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../../components/Header";
import QuizCard from "../../components/QuizCard";
import ProgressBar from "../../components/ProgressBar";
import { questions as allQuestions } from "../../data/questions";
import {
  getQuizByShareId,
  getQuizAnswers,
  submitAttempt,
  type QuizAnswer,
} from "../../lib/db";

type Step = "loading" | "name" | "quiz" | "result";

export default function TakeQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: shareId } = use(params);
  const [step, setStep] = useState<Step>("loading");
  const [creatorName, setCreatorName] = useState("");
  const [quizId, setQuizId] = useState("");
  const [quizQuestionIds, setQuizQuestionIds] = useState<number[]>([]);
  const [creatorAnswers, setCreatorAnswers] = useState<QuizAnswer[]>([]);
  const [friendName, setFriendName] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<
    { questionId: number; selectedOption: "A" | "B" }[]
  >([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");

  // Load quiz data
  useEffect(() => {
    async function loadQuiz() {
      try {
        // Try from database first
        const quiz = await getQuizByShareId(shareId);
        if (quiz) {
          setCreatorName(quiz.creator_name);
          setQuizId(quiz.id);
          setQuizQuestionIds(quiz.question_ids);
          const qAnswers = await getQuizAnswers(quiz.id);
          setCreatorAnswers(qAnswers);
          setStep("name");
          return;
        }

        // Fallback: check localStorage
        const localData = localStorage.getItem(`quiz_${shareId}`);
        if (localData) {
          const parsed = JSON.parse(localData);
          setCreatorName(parsed.creator_name);
          setQuizId(shareId);
          setQuizQuestionIds(parsed.question_ids);
          const mockAnswers = parsed.answers.map(
            (a: { questionId: number; selectedOption: "A" | "B" }, i: number) => ({
              id: `local-${i}`,
              quiz_id: shareId,
              question_id: a.questionId,
              selected_option: a.selectedOption,
            })
          );
          setCreatorAnswers(mockAnswers);
          setStep("name");
          return;
        }

        setError("Quiz not found! The link may be invalid.");
        setStep("name");
      } catch {
        // Try localStorage as final fallback
        const localData = localStorage.getItem(`quiz_${shareId}`);
        if (localData) {
          const parsed = JSON.parse(localData);
          setCreatorName(parsed.creator_name);
          setQuizId(shareId);
          setQuizQuestionIds(parsed.question_ids);
          const mockAnswers = parsed.answers.map(
            (a: { questionId: number; selectedOption: "A" | "B" }, i: number) => ({
              id: `local-${i}`,
              quiz_id: shareId,
              question_id: a.questionId,
              selected_option: a.selectedOption,
            })
          );
          setCreatorAnswers(mockAnswers);
          setStep("name");
        } else {
          setError("Quiz not found!");
          setStep("name");
        }
      }
    }
    loadQuiz();
  }, [shareId]);

  const quizQuestions = quizQuestionIds
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter(Boolean) as (typeof allQuestions)[number][];

  const handleNameContinue = () => {
    if (friendName.trim().length > 0 && !error) {
      setStep("quiz");
    }
  };

  const handleSelectOption = useCallback(
    (option: "A" | "B") => {
      const currentQuestion = quizQuestions[currentQ];
      const updatedAnswers = [
        ...answers.filter((a) => a.questionId !== currentQuestion.id),
        { questionId: currentQuestion.id, selectedOption: option },
      ];
      setAnswers(updatedAnswers);

      setTimeout(() => {
        if (currentQ < quizQuestions.length - 1) {
          setCurrentQ((prev) => prev + 1);
        } else {
          finishQuiz(updatedAnswers);
        }
      }, 400);
    },
    [currentQ, quizQuestions, answers]
  );

  const handleChangeQuestion = useCallback(() => {
    // Find questions not currently in the active quiz set
    const activeIds = new Set(quizQuestions.map((q) => q.id));
    const unusedQuestions = allQuestions.filter((q) => !activeIds.has(q.id));

    if (unusedQuestions.length === 0) return; // No more questions to swap

    // Pick a random unused question
    const randomUnused =
      unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];

    // Replace the current question ID in the list
    const oldQuestionId = quizQuestionIds[currentQ];
    setQuizQuestionIds((prev) =>
      prev.map((id, i) => (i === currentQ ? randomUnused.id : id))
    );

    // Also update creator answers: copy the creator's answer for the old question to the new one
    // (so scoring still works — the friend just gets a different question to guess)
    const oldCreatorAnswer = creatorAnswers.find(
      (ca) => ca.question_id === oldQuestionId
    );
    if (oldCreatorAnswer) {
      // Assign a random answer for the new question (since creator never answered it)
      const randomOption = Math.random() > 0.5 ? "A" : "B";
      setCreatorAnswers((prev) => [
        ...prev.filter((ca) => ca.question_id !== oldQuestionId),
        { ...oldCreatorAnswer, question_id: randomUnused.id, selected_option: randomOption },
      ]);
    }

    // Remove any existing answer for the old question
    setAnswers((prev) =>
      prev.filter((a) => a.questionId !== oldQuestionId)
    );
  }, [currentQ, quizQuestions, quizQuestionIds, creatorAnswers]);

  const finishQuiz = async (
    finalAnswers: { questionId: number; selectedOption: "A" | "B" }[]
  ) => {
    // Calculate score
    let calcScore = 0;
    for (const answer of finalAnswers) {
      const creatorAnswer = creatorAnswers.find(
        (ca) => ca.question_id === answer.questionId
      );
      if (
        creatorAnswer &&
        creatorAnswer.selected_option === answer.selectedOption
      ) {
        calcScore++;
      }
    }
    setScore(calcScore);

    // Save attempt
    try {
      await submitAttempt(quizId, friendName.trim(), finalAnswers, calcScore);
    } catch {
      // Silently fail - local score is still shown
    }

    setStep("result");
  };

  // Fire confetti on result
  useEffect(() => {
    if (step === "result") {
      import("canvas-confetti").then((confettiModule) => {
        const confetti = confettiModule.default;
        // Initial burst
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.3 } });
        // Side bursts
        setTimeout(() => {
          confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
          confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
        }, 500);
      }).catch(() => {});
    }
  }, [step]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />

      <main className="flex flex-1 flex-col items-center px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Loading */}
          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 pt-20"
            >
              <div className="text-5xl animate-bounce-gentle">🔄</div>
              <p className="font-bold">Loading quiz...</p>
            </motion.div>
          )}

          {/* Name entry */}
          {step === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm flex flex-col items-center gap-6 pt-4"
            >
              {error ? (
                <div className="card text-center py-8">
                  <div className="text-5xl mb-4">😢</div>
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {error}
                  </h2>
                  <p
                    className="text-sm mt-2"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Please check the link and try again.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-5xl animate-wiggle mb-3">🤗</div>
                    <h1
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      <span className="text-highlight-cyan">
                        {creatorName}
                      </span>{" "}
                      wants to know...
                    </h1>
                    <p
                      className="text-sm mt-2"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Do you really know them? Take the quiz!
                    </p>
                  </div>

                  <div className="w-full relative">
                    <input
                      type="text"
                      value={friendName}
                      onChange={(e) =>
                        setFriendName(e.target.value.slice(0, 15))
                      }
                      placeholder="Enter your name..."
                      className="input-field pr-16"
                      autoFocus
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleNameContinue()
                      }
                    />
                    <span
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {friendName.length}/15
                    </span>
                  </div>

                  <button
                    onClick={handleNameContinue}
                    className="btn-primary"
                    disabled={friendName.trim().length === 0}
                    style={{
                      opacity: friendName.trim().length === 0 ? 0.5 : 1,
                    }}
                  >
                    Start Quiz 🚀
                  </button>
                </>
              )}
            </motion.div>
          )}

          {/* Quiz */}
          {step === "quiz" && quizQuestions.length > 0 && (
            <motion.div
              key={`quiz-${currentQ}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md flex flex-col items-center gap-6 pt-2"
            >
              <div className="text-center mb-2">
                <p
                  className="text-sm font-bold"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-primary)",
                  }}
                >
                  What would {creatorName} choose? 🤔
                </p>
              </div>

              <ProgressBar
                current={currentQ}
                total={quizQuestions.length}
              />

              <QuizCard
                question={quizQuestions[currentQ]}
                questionNumber={currentQ + 1}
                totalQuestions={quizQuestions.length}
                userName={creatorName}
                onSelectOption={handleSelectOption}
                onChangeQuestion={handleChangeQuestion}
                selectedOption={
                  answers.find(
                    (a) =>
                      a.questionId === quizQuestions[currentQ].id
                  )?.selectedOption || null
                }
              />
            </motion.div>
          )}

          {/* Results — Dramatic Score Reveal */}
          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md flex flex-col items-center gap-0"
            >
              {/* Purple gradient score section */}
              <div className="score-reveal-bg w-full">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-bold text-white/80 mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  your score
                </motion.p>

                {/* Giant 3D score */}
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.8, delay: 0.3 }}
                  className="score-3d"
                >
                  <span className="score-3d-number">{score}</span>
                  <span className="score-3d-total">/{quizQuestions.length}</span>
                </motion.div>

                {/* Reaction emoji */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.8 }}
                  className="text-6xl mt-4"
                >
                  {score >= 9 ? "🥰" : score >= 7 ? "😎" : score >= 5 ? "🤨" : score >= 3 ? "😟" : "💀"}
                </motion.div>
              </div>

              {/* Chat messages */}
              <div className="w-full px-4 pt-6 pb-4 flex flex-col gap-3">
                {/* Creator message — right */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="chat-bubble-right"
                >
                  <p className="font-bold text-white text-sm">
                    {score >= 7
                      ? `so, do you trust me now? 😇`
                      : score >= 4
                      ? `hmm, do you even know me? 🤔`
                      : `you don't know me at all! 😤`}
                  </p>
                  <span className="chat-name-right">{creatorName}</span>
                </motion.div>

                {/* Friend message — left */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 }}
                  className="chat-bubble-left"
                >
                  <p className="font-bold text-sm" style={{ color: "var(--color-text-dark)" }}>
                    {score >= 7
                      ? `okay... I trust you now 😘`
                      : score >= 4
                      ? `let me try again! 😅`
                      : `oops... sorry! 🫣`}
                  </p>
                  <span className="chat-name-left">{friendName}</span>
                </motion.div>
              </div>

              {/* Mascot */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
                className="text-6xl mb-4"
              >
                🤩
              </motion.div>

              {/* Trust level card + CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                className="w-full px-4"
              >
                <div className="card w-full text-center">
                  <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                    trust level
                  </p>
                  <p
                    className="text-lg font-bold mb-4"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: score >= 7 ? "#22c55e" : score >= 4 ? "#f59e0b" : "#ef4444",
                    }}
                  >
                    {score >= 9
                      ? "💕 Best Friend!"
                      : score >= 7
                      ? "✨ Mostly Safe"
                      : score >= 5
                      ? "😟 Not Sure"
                      : score >= 3
                      ? "🚩 Seems Fake"
                      : "💀 Don't Trust"}
                  </p>

                  <div className="flex flex-col gap-3">
                    <a href={`/quiz/${shareId}/results`} className="block">
                      <button className="btn-secondary w-full">
                        View Scoreboard 🏆
                      </button>
                    </a>
                    <a href="/" className="block">
                      <button className="btn-primary">
                        Create Your Own Quiz ✨
                      </button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

