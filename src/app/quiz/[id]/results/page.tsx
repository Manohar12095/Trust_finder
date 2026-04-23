"use client";

import { useState, useEffect, use } from "react";
import Header from "../../../components/Header";
import Leaderboard from "../../../components/Leaderboard";
import ShareLink from "../../../components/ShareLink";
import { getQuizByShareId, getLeaderboard, type Attempt } from "../../../lib/db";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: shareId } = use(params);
  const [creatorName, setCreatorName] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(10);

  useEffect(() => {
    async function loadResults() {
      try {
        const quiz = await getQuizByShareId(shareId);
        if (quiz) {
          setCreatorName(quiz.creator_name);
          setTotalQuestions(quiz.question_ids.length);
          const lb = await getLeaderboard(quiz.id);
          setAttempts(lb);
        }
      } catch {
        // Silently fail
      }
      setLoading(false);
    }
    loadResults();
  }, [shareId]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/quiz/${shareId}`
      : "";

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack subtitle={`${creatorName}'s Results`} />

      <main className="flex flex-1 flex-col items-center px-4 py-6 gap-8">
        {loading ? (
          <div className="flex flex-col items-center gap-4 pt-20">
            <div className="text-5xl animate-bounce-gentle">📊</div>
            <p className="font-bold">Loading results...</p>
          </div>
        ) : (
          <>
            {/* Share link */}
            <ShareLink shareUrl={shareUrl} creatorName={creatorName} />

            {/* Leaderboard */}
            <Leaderboard
              attempts={attempts}
              totalQuestions={totalQuestions}
              creatorName={creatorName}
            />
          </>
        )}
      </main>
    </div>
  );
}
