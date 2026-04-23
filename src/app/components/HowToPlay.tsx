"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "CREATE YOUR QUIZ",
    description:
      "Answer 10 questions about yourself, then your friends will guess your choices",
    emoji: "✏️",
    color: "var(--color-primary)",
  },
  {
    number: 2,
    title: "SHARE WITH FRIENDS",
    description: "Share Quiz Link with your friends",
    emoji: "🔗",
    color: "var(--color-accent-pink)",
  },
  {
    number: 3,
    title: "FIND FAKE FRIENDS",
    description: "Let's see how well your friends know you.",
    emoji: "👀",
    color: "var(--color-accent-orange)",
  },
];

export default function HowToPlay() {
  return (
    <section className="w-full max-w-lg mx-auto px-4 py-8">
      <h2
        className="text-center text-2xl font-bold mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        how to play?
      </h2>
      <p
        className="text-center mb-8"
        style={{ color: "var(--color-text-muted)" }}
      >
        let&apos;s see if your friends know your choices
      </p>

      <div className="flex flex-col gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="card flex items-start gap-4"
          >
            {/* Step number circle */}
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white text-xl font-bold"
              style={{ background: step.color }}
            >
              {step.emoji}
            </div>

            {/* Step content */}
            <div>
              <h3
                className="text-lg font-bold mb-1"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-text-dark)",
                }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
