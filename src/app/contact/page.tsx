"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />

      <main className="flex flex-1 flex-col items-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📧</div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Contact Us
            </h1>
            <p
              className="text-sm mt-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Have questions or feedback? We&apos;d love to hear from you!
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center py-8"
            >
              <div className="text-5xl mb-3">✅</div>
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Message Sent!
              </h2>
              <p
                className="text-sm mt-2"
                style={{ color: "var(--color-text-muted)" }}
              >
                We&apos;ll get back to you soon. Thank you!
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                  className="input-field min-h-[120px] resize-y"
                  required
                />
              </div>

              <button type="submit" className="btn-primary mt-2">
                Send Message 🚀
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
}
