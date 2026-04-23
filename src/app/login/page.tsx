"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import { loginUser, registerUser } from "../lib/db";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const user = await loginUser(name.trim(), password);
        if (user) {
          localStorage.setItem("trustmenot_user", JSON.stringify(user));
          window.location.href = "/";
        } else {
          setError("Wrong name or password! 😢");
        }
      } else {
        const user = await registerUser(name.trim(), password);
        if (user) {
          localStorage.setItem("trustmenot_user", JSON.stringify(user));
          window.location.href = "/";
        } else {
          setError("Name already taken! Try another 😅");
        }
      }
    } catch {
      setError("Something went wrong. Try again!");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm flex flex-col items-center gap-5"
          >
            {/* Emoji */}
            <div className="text-6xl animate-wiggle">
              {mode === "login" ? "🔐" : "✨"}
            </div>

            {/* Title */}
            <h1
              className="text-2xl font-bold text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {mode === "login" ? (
                <>
                  welcome{" "}
                  <span className="text-highlight-pink">back!</span>
                </>
              ) : (
                <>
                  create{" "}
                  <span className="text-highlight-cyan">account</span>
                </>
              )}
            </h1>

            {/* Form */}
            <div className="w-full flex flex-col gap-3">
              <div className="w-full relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 15))}
                  placeholder="Your name..."
                  className="input-field pr-16"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {name.length}/15
                </span>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "login" ? "Your password..." : "Create a password..."}
                className="input-field"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-bold text-center"
                style={{ color: "#ef4444" }}
              >
                {error}
              </motion.p>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              className="btn-primary"
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading
                ? "Loading..."
                : mode === "login"
                ? "Login 🚀"
                : "Sign Up ✨"}
            </button>

            {/* Toggle mode */}
            <p
              className="text-sm text-center"
              style={{ color: "var(--color-text-muted)" }}
            >
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => { setMode("register"); setError(""); }}
                    className="font-bold underline"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => { setMode("login"); setError(""); }}
                    className="font-bold underline"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
