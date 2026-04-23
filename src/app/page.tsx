"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "./components/Header";
import HowToPlay from "./components/HowToPlay";
import Leaderboard from "./components/Leaderboard";
import { getUserLeaderboard, type User, type Attempt, type Quiz } from "./lib/db";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<{
    quiz: Quiz | null;
    attempts: Attempt[];
  }>({ quiz: null, attempts: [] });
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const stored = localStorage.getItem("trustmenot_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("trustmenot_user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("trustmenot_user");
    setUser(null);
    setShowLeaderboard(false);
  };

  const handleViewLeaderboard = async () => {
    if (!user) return;
    setLeaderboardLoading(true);
    try {
      const result = await getUserLeaderboard(user.id);
      setLeaderboardData(result);
      setShowLeaderboard(true);
    } catch {
      setLeaderboardData({ quiz: null, attempts: [] });
      setShowLeaderboard(true);
    }
    setLeaderboardLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center">
        {/* User greeting bar */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md px-4 pt-4"
          >
            <div
              className="flex items-center justify-between rounded-2xl px-5 py-3"
              style={{
                background: "linear-gradient(135deg, #f0eaff, #e8f5e9)",
                border: "2px solid #e0d8ff",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">👋</span>
                <p
                  className="font-bold text-sm"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  hi, {user.name}!
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                }}
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}

        {/* Not logged in → Login prompt */}
        {!user && (
          <section className="w-full max-w-sm px-4 mt-4 animate-fade-in">
            <div className="card text-center">
              <div className="text-4xl mb-2">🔐</div>
              <h2
                className="text-lg font-bold mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Login to get started
              </h2>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--color-text-muted)" }}
              >
                Create an account to make quizzes and track your friends&apos; scores!
              </p>
              <Link href="/login" className="block">
                <button className="btn-primary">
                  Login / Sign Up 🚀
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* Hero illustration */}
        <section className="flex flex-col items-center px-4 pt-6 pb-4">
          <div className="relative animate-float">
            <Image
              src="/images/hero.png"
              alt="Friends whispering"
              width={340}
              height={280}
              className="rounded-2xl"
              priority
            />
          </div>

          {/* Tagline */}
          <h1
            className="mt-4 text-center text-3xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            find friends
            <br />
            you shouldn&apos;t
            <br />
            <span className="marker-highlight text-4xl" style={{ color: "var(--color-text-dark)" }}>
              &quot;trust&quot;
            </span>
          </h1>
        </section>

        {/* Language selector (decorative) */}
        <div className="my-4">
          <div
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white"
            style={{ background: "var(--color-text-dark)" }}
          >
            English (English)
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
              style={{ background: "var(--color-accent-pink)" }}
            >
              ▾
            </span>
          </div>
        </div>

        {/* CTA Card */}
        <section className="w-full max-w-sm px-4 animate-fade-in">
          <div className="card text-center">
            <h2
              className="text-xl font-bold mb-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ✨{" "}
              <span className="text-highlight-pink">create your quiz</span>{" "}
              ❤️
              <br />
              &amp;
              <br />
              find{" "}
              <span className="text-highlight-cyan">friends</span> you
              shouldn&apos;t
              <br />
              trust 👀
            </h2>

            <Link href={user ? "/create" : "/login"} className="block mt-4">
              <button className="btn-primary" id="create-quiz-btn">
                create quiz
              </button>
            </Link>
          </div>
        </section>

        {/* Leaderboard Button — only show when logged in */}
        {user && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-sm px-4 mt-4"
          >
            <button
              onClick={handleViewLeaderboard}
              disabled={leaderboardLoading}
              className="leaderboard-btn w-full"
              id="leaderboard-btn"
            >
              <span className="text-2xl">🏆</span>
              <span className="font-bold text-lg">
                {leaderboardLoading ? "Loading..." : "Leaderboard"}
              </span>
              <span className="text-2xl">🏆</span>
            </button>
          </motion.section>
        )}

        {/* Leaderboard display */}
        {showLeaderboard && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md px-4 mt-4"
          >
            {leaderboardData.quiz ? (
              <Leaderboard
                attempts={leaderboardData.attempts}
                totalQuestions={leaderboardData.quiz.question_ids.length}
                creatorName={user?.name || ""}
              />
            ) : (
              <div className="card text-center py-6">
                <div className="text-4xl mb-2">📝</div>
                <p
                  className="font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  No quiz created yet!
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Create a quiz first, share the link, and check back to see scores.
                </p>
              </div>
            )}

            {/* Close leaderboard */}
            <button
              onClick={() => setShowLeaderboard(false)}
              className="w-full mt-3 py-2 text-sm font-bold text-center rounded-xl"
              style={{ color: "var(--color-text-muted)" }}
            >
              Close ✕
            </button>
          </motion.section>
        )}

        {/* Mascot */}
        <div className="mt-6 animate-bounce-gentle">
          <Image
            src="/images/mascot.png"
            alt="Mascot"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        {/* How to Play */}
        <HowToPlay />

        {/* Footer */}
        <footer className="w-full py-8 px-4 text-center" style={{ background: "var(--color-primary)" }}>
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/contact"
              className="text-white/90 font-bold hover:text-white transition"
            >
              📧 Contact Us
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-white/90 font-bold hover:text-white transition"
            >
              📸 Follow on Instagram
            </a>
            <p className="text-sm text-white/60 mt-2">
              © 2026 TrustMeNot. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
