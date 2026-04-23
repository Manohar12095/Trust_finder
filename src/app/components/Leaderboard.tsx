"use client";

import { motion } from "framer-motion";
import type { Attempt } from "../lib/db";

interface LeaderboardProps {
  attempts: Attempt[];
  totalQuestions: number;
  creatorName: string;
}

function getTrustBadge(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct >= 90) return { label: "Best Friend 💕", color: "#10b981" };
  if (pct >= 70) return { label: "True Friend ✨", color: "#7c5cfc" };
  if (pct >= 50) return { label: "Okay 😏", color: "#f59e0b" };
  if (pct >= 30) return { label: "Suspicious 🤨", color: "#f97316" };
  return { label: "Fake Friend 💔", color: "#ef4444" };
}

function getRankEmoji(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default function Leaderboard({
  attempts,
  totalQuestions,
  creatorName,
}: LeaderboardProps) {
  if (attempts.length === 0) {
    return (
      <div className="card w-full max-w-md mx-auto text-center py-8">
        <div className="text-4xl mb-3">👻</div>
        <p
          className="font-bold text-lg"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          No one has taken {creatorName}&apos;s quiz yet!
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
          Share the link and see who knows you best.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h3
        className="text-xl font-bold text-center mb-4"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        🏆 Leaderboard
      </h3>

      <div className="flex flex-col gap-3">
        {attempts.map((attempt, index) => {
          const badge = getTrustBadge(attempt.score, totalQuestions);
          return (
            <motion.div
              key={attempt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="leaderboard-row"
            >
              {/* Rank */}
              <span className="text-xl font-bold w-8 text-center">
                {getRankEmoji(index + 1)}
              </span>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold truncate"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {attempt.friend_name}
                </p>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: badge.color }}
                >
                  {badge.label}
                </span>
              </div>

              {/* Score */}
              <span
                className="text-lg font-bold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: badge.color,
                }}
              >
                {attempt.score}/{totalQuestions}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
