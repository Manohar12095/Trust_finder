"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  showBack?: boolean;
  subtitle?: string;
}

export default function Header({ showBack = false, subtitle }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="header-bar relative z-50">
        {/* Left: Back button */}
        <div className="w-16">
          {showBack && (
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              Back
            </Link>
          )}
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="TrustMeNot"
            width={120}
            height={60}
            className="animate-bounce-gentle"
            priority
          />
          {subtitle && (
            <span className="mt-1 text-sm text-white/80">{subtitle}</span>
          )}
        </Link>

        {/* Right: Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg transition hover:bg-white/10"
          aria-label="Menu"
        >
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 p-6 pt-20 shadow-2xl"
            style={{
              background:
                "linear-gradient(180deg, var(--color-primary), var(--color-primary-dark))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="rounded-xl px-4 py-3 text-lg font-bold text-white transition hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link
                href="/create"
                className="rounded-xl px-4 py-3 text-lg font-bold text-white transition hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                ✏️ Create Quiz
              </Link>
              <Link
                href="/contact"
                className="rounded-xl px-4 py-3 text-lg font-bold text-white transition hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                📧 Contact Us
              </Link>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl px-4 py-3 text-lg font-bold text-white transition hover:bg-white/10"
              >
                📸 Follow on Instagram
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
