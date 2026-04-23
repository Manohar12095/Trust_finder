"use client";

import { motion } from "framer-motion";
import type { Attempt } from "../lib/db";

interface LeaderboardProps {
  attempts: Attempt[];
  totalQuestions: number;
  creatorName: string;
}

function getTrustLevel(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct >= 90)
    return {
      label: "mostly safe",
      emoji: "👍",
      color: "#22c55e",
      barColor: "#22c55e",
      face: "😎",
      borderColor: "#22c55e",
    };
  if (pct >= 70)
    return {
      label: "mostly safe",
      emoji: "👍",
      color: "#22c55e",
      barColor: "#22c55e",
      face: "😎",
      borderColor: "#22c55e",
    };
  if (pct >= 60)
    return {
      label: "not sure",
      emoji: "😟",
      color: "#f59e0b",
      barColor: "#f59e0b",
      face: "🤨",
      borderColor: "#f59e0b",
    };
  if (pct >= 50)
    return {
      label: "seems fake",
      emoji: "🚩",
      color: "#f97316",
      barColor: "#f97316",
      face: "😟",
      borderColor: "#f97316",
    };
  return {
    label: "don't trust",
    emoji: "💀",
    color: "#ef4444",
    barColor: "#ef4444",
    face: "💀",
    borderColor: "#ef4444",
  };
}

function getRankDisplay(rank: number) {
  if (rank === 1) return { icon: "🥇", type: "medal" as const };
  if (rank === 2) return { icon: "🥈", type: "medal" as const };
  if (rank === 3) return { icon: "🥉", type: "medal" as const };
  return { icon: `${rank}`, type: "number" as const };
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
        <p
          className="text-sm mt-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Share the link and see who knows you best.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Scoreboard banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="scoreboard-banner"
      >
        <span className="text-2xl">🏆</span>
        <h3
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          scoreboard
        </h3>
        <span className="text-2xl">🏆</span>
      </motion.div>

      {/* Friends played counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center -mt-4 mb-4 relative z-10"
      >
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold"
          style={{
            background: "white",
            border: "2px solid #e5e7eb",
            fontFamily: "var(--font-heading)",
            color: "var(--color-text-dark)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <span>🎮</span>
          {attempts.length} friend{attempts.length !== 1 ? "s" : ""} played
        </div>
      </motion.div>

      {/* Leaderboard entries */}
      <div className="flex flex-col gap-3">
        {attempts.map((attempt, index) => {
          const trust = getTrustLevel(attempt.score, totalQuestions);
          const rank = getRankDisplay(index + 1);
          const progressPct = (attempt.score / totalQuestions) * 100;

          return (
            <motion.div
              key={attempt.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="leaderboard-entry"
              style={{ borderLeftColor: trust.borderColor }}
            >
              {/* Rank badge */}
              <div className="leaderboard-rank">
                {rank.type === "medal" ? (
                  <span className="text-2xl">{rank.icon}</span>
                ) : (
                  <div
                    className="rank-number"
                    style={{ borderColor: trust.borderColor, color: trust.color }}
                  >
                    {rank.icon}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className="font-bold truncate text-base"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {attempt.friend_name}
                  </p>
                  <span
                    className="text-base font-bold ml-2 whitespace-nowrap"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: trust.color,
                    }}
                  >
                    {attempt.score}
                    <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                      /{totalQuestions}
                    </span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="leaderboard-progress-track">
                  <motion.div
                    className="leaderboard-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    style={{ background: trust.barColor }}
                  />
                </div>

                {/* Trust level label */}
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className="text-xs"
                    style={{
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    trust level→
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: trust.color,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {trust.emoji} {trust.label}
                  </span>
                </div>
              </div>

              {/* Face emoji */}
              <div className="text-3xl ml-2">{trust.face}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
