"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Hearts */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`text-lg transition-all duration-300 ${
              i < current
                ? "scale-110 saturate-100"
                : "grayscale opacity-40 scale-90"
            }`}
            style={{
              animationDelay: `${i * 0.05}s`,
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Progress bar track */}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
