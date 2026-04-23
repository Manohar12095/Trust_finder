"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ShareLinkProps {
  shareUrl: string;
  creatorName: string;
}

export default function ShareLink({ shareUrl, creatorName }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = `Hey! Think you know me? Take my TrustMeNot quiz and find out! 🤔`;

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`,
      "_blank"
    );
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card w-full max-w-md mx-auto text-center"
    >
      <div className="text-4xl mb-3">🎉</div>
      <h2
        className="text-2xl font-bold mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Quiz Created!
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
        Share this link with your friends and find out who really knows{" "}
        <strong>{creatorName}</strong>!
      </p>

      {/* Share URL display */}
      <div className="flex items-center gap-2 mb-4 rounded-xl bg-gray-50 p-3">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
          style={{ fontFamily: "var(--font-system)" }}
        />
        <button
          onClick={handleCopy}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold text-white transition-all ${
            copied ? "bg-green-500" : "bg-[var(--color-primary)]"
          }`}
        >
          {copied ? "Copied! ✓" : "Copy 📋"}
        </button>
      </div>

      {/* Share buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleWhatsApp}
          className="flex-1 rounded-xl bg-green-500 py-3 text-sm font-bold text-white transition hover:bg-green-600"
        >
          WhatsApp 💬
        </button>
        <button
          onClick={handleTwitter}
          className="flex-1 rounded-xl bg-sky-500 py-3 text-sm font-bold text-white transition hover:bg-sky-600"
        >
          Twitter 🐦
        </button>
      </div>
    </motion.div>
  );
}
