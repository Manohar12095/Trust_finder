"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../components/Header";
import QuizCard from "../components/QuizCard";
import ProgressBar from "../components/ProgressBar";
import ShareLink from "../components/ShareLink";
import { getRandomQuestions, questions as allQuestions, type Question } from "../data/questions";
import { createQuiz } from "../lib/db";

type Step = "name" | "gender" | "quiz" | "done";

export default function CreatePage() {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<
    { questionId: number; selectedOption: "A" | "B" }[]
  >([]);
  const [shareUrl, setShareUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize random questions on mount
  useEffect(() => {
    setQuestions(getRandomQuestions(10));
  }, []);

  const handleNameContinue = () => {
    if (name.trim().length > 0) {
      setStep("gender");
    }
  };

  const handleGenderSelect = (g: "male" | "female") => {
    setGender(g);
    setStep("quiz");
  };

  const handleSelectOption = useCallback(
    (option: "A" | "B") => {
      const currentQuestion = questions[currentQ];
      setAnswers((prev) => [
        ...prev.filter((a) => a.questionId !== currentQuestion.id),
        { questionId: currentQuestion.id, selectedOption: option },
      ]);

      // Auto-advance after 400ms
      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          setCurrentQ((prev) => prev + 1);
        } else {
          handleSubmitQuiz([
            ...answers.filter((a) => a.questionId !== currentQuestion.id),
            { questionId: currentQuestion.id, selectedOption: option },
          ]);
        }
      }, 400);
    },
    [currentQ, questions, answers]
  );

  const handleChangeQuestion = useCallback(() => {
    // Find questions not currently in the active set
    const activeIds = new Set(questions.map((q) => q.id));
    const unusedQuestions = allQuestions.filter((q) => !activeIds.has(q.id));

    if (unusedQuestions.length === 0) return; // No more questions to swap

    // Pick a random unused question
    const randomUnused =
      unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];

    // Replace the current question with the new one
    setQuestions((prev) =>
      prev.map((q, i) => (i === currentQ ? randomUnused : q))
    );

    // Remove any existing answer for the old question
    setAnswers((prev) =>
      prev.filter((a) => a.questionId !== questions[currentQ].id)
    );
  }, [currentQ, questions]);

  const handleSubmitQuiz = async (
    finalAnswers: { questionId: number; selectedOption: "A" | "B" }[]
  ) => {
    setIsSubmitting(true);
    const questionIds = questions.map((q) => q.id);

    try {
      const quiz = await createQuiz(
        name.trim(),
        gender || "male",
        questionIds,
        finalAnswers
      );

      if (quiz) {
        const url = `${window.location.origin}/quiz/${quiz.share_id}`;
        setShareUrl(url);
        setStep("done");
      } else {
        // Fallback: use local storage if DB fails
        const shareId = Math.random().toString(36).substring(2, 10);
        const quizData = {
          creator_name: name.trim(),
          gender: gender || "male",
          question_ids: questionIds,
          answers: finalAnswers,
        };
        localStorage.setItem(`quiz_${shareId}`, JSON.stringify(quizData));
        const url = `${window.location.origin}/quiz/${shareId}`;
        setShareUrl(url);
        setStep("done");
      }
    } catch {
      // Fallback: use local storage
      const shareId = Math.random().toString(36).substring(2, 10);
      const quizData = {
        creator_name: name.trim(),
        gender: gender || "male",
        question_ids: questionIds,
        answers: finalAnswers,
      };
      localStorage.setItem(`quiz_${shareId}`, JSON.stringify(quizData));
      const url = `${window.location.origin}/quiz/${shareId}`;
      setShareUrl(url);
      setStep("done");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        showBack
        subtitle={step === "quiz" ? `hi, ${name} 👋` : undefined}
      />

      <main className="flex flex-1 flex-col items-center px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Name */}
          {step === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm flex flex-col items-center gap-6 pt-4"
            >
              <div className="text-5xl animate-wiggle">🤔</div>
              <h1
                className="text-2xl font-bold text-center"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                what&apos;s your{" "}
                <span className="text-highlight-pink">name?</span>
              </h1>

              <div className="w-full relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value.slice(0, 15))
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
                  {name.length}/15
                </span>
              </div>

              <button
                onClick={handleNameContinue}
                className="btn-primary"
                disabled={name.trim().length === 0}
                style={{
                  opacity: name.trim().length === 0 ? 0.5 : 1,
                }}
              >
                continue
              </button>
            </motion.div>
          )}

          {/* Step 2: Gender */}
          {step === "gender" && (
            <motion.div
              key="gender"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm flex flex-col items-center gap-6 pt-4"
            >
              <p
                className="text-sm"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-primary)",
                }}
              >
                hi, {name} 👋
              </p>
              <h1
                className="text-2xl font-bold text-center"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                select your{" "}
                <span className="text-highlight-pink">gender</span>
              </h1>

              <div className="grid grid-cols-2 gap-6 w-full">
                {/* Male */}
                <button
                  onClick={() => handleGenderSelect("male")}
                  className={`gender-card flex flex-col items-center gap-3 ${
                    gender === "male" ? "selected" : ""
                  }`}
                >
                  <Image
                    src="/images/male-avatar.png"
                    alt="Male"
                    width={120}
                    height={120}
                    className="rounded-xl"
                  />
                  <span
                    className="font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Male
                  </span>
                </button>

                {/* Female */}
                <button
                  onClick={() => handleGenderSelect("female")}
                  className={`gender-card flex flex-col items-center gap-3 ${
                    gender === "female" ? "selected" : ""
                  }`}
                >
                  <Image
                    src="/images/female-avatar.png"
                    alt="Female"
                    width={120}
                    height={120}
                    className="rounded-xl"
                  />
                  <span
                    className="font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Female
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Quiz questions */}
          {step === "quiz" && questions.length > 0 && (
            <motion.div
              key={`quiz-${currentQ}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md flex flex-col items-center gap-6 pt-2"
            >
              {/* Play banner */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">❤️</span>
                <span className="text-2xl">❤️</span>
                <div
                  className="rounded-lg px-8 py-2 text-2xl font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    fontFamily: "var(--font-heading)",
                    boxShadow:
                      "0 4px 0 #15803d, 0 6px 12px rgba(22, 163, 74, 0.3)",
                  }}
                >
                  PLAY
                </div>
                <span className="text-2xl">❤️</span>
                <span className="text-2xl">❤️</span>
              </div>

              {/* Progress */}
              <ProgressBar
                current={currentQ}
                total={questions.length}
              />

              {/* Question card */}
              <QuizCard
                question={questions[currentQ]}
                questionNumber={currentQ + 1}
                totalQuestions={questions.length}
                userName={name}
                onSelectOption={handleSelectOption}
                onChangeQuestion={handleChangeQuestion}
                selectedOption={
                  answers.find(
                    (a) =>
                      a.questionId === questions[currentQ].id
                  )?.selectedOption || null
                }
              />
            </motion.div>
          )}

          {/* Step 4: Done / Share */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md flex flex-col items-center gap-6 pt-8"
            >
              {isSubmitting ? (
                <div className="text-center">
                  <div className="text-5xl animate-bounce-gentle mb-4">
                    ⏳
                  </div>
                  <p className="font-bold text-lg">
                    Creating your quiz...
                  </p>
                </div>
              ) : (
                <ShareLink
                  shareUrl={shareUrl}
                  creatorName={name}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
