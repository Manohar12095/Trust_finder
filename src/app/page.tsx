"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import HowToPlay from "./components/HowToPlay";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center">
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

            <Link href="/create" className="block mt-4">
              <button className="btn-primary" id="create-quiz-btn">
                create quiz
              </button>
            </Link>
          </div>
        </section>

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
