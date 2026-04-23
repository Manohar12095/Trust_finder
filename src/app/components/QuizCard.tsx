"use client";

import { motion } from "framer-motion";
import type { Question } from "../data/questions";

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userName: string;
  onSelectOption: (option: "A" | "B") => void;
  onChangeQuestion: () => void;
  selectedOption?: "A" | "B" | null;
}

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  userName,
  onSelectOption,
  onChangeQuestion,
  selectedOption,
}: QuizCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      {/* Question number badge */}
      <div className="flex justify-center mb-4">
        <span className="step-badge">
          Question {questionNumber}
        </span>
      </div>

      {/* Quiz card */}
      <div className="quiz-card">
        {/* Question prompt */}
        <h2
          className="text-center text-xl font-bold text-white mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="marker-highlight">{userName}</span>{" "}
          {question.prompt} {question.emoji}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {/* Option A */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectOption("A")}
            className={`option-card flex flex-col items-center gap-3 ${
              selectedOption === "A" ? "selected" : ""
            }`}
          >
            <span className="text-5xl">{question.optionA.emoji}</span>
            <span
              className="text-sm font-bold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text-dark)",
              }}
            >
              {question.optionA.text}{" "}
              <span className="text-base">🔥</span>
            </span>
          </motion.button>

          {/* Option B */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectOption("B")}
            className={`option-card flex flex-col items-center gap-3 ${
              selectedOption === "B" ? "selected" : ""
            }`}
          >
            <span className="text-5xl">{question.optionB.emoji}</span>
            <span
              className="text-sm font-bold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text-dark)",
              }}
            >
              {question.optionB.text}{" "}
              <span className="text-base">🚫</span>
            </span>
          </motion.button>
        </div>

        {/* Dots decoration */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < questionNumber
                  ? "bg-white"
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Change question button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={onChangeQuestion}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          change question 🔄
        </button>
      </div>
    </motion.div>
  );
}
