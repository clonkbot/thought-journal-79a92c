import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface ThoughtCardProps {
  id: Id<"thoughts">;
  content: string;
  mood?: string;
  createdAt: number;
  delay?: number;
}

const MOOD_COLORS: Record<string, string> = {
  Inspired: "bg-violet-100 text-violet-700 border-violet-200",
  Peaceful: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Passionate: "bg-rose-100 text-rose-700 border-rose-200",
  Reflective: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Joyful: "bg-amber-100 text-amber-700 border-amber-200",
  Calm: "bg-sky-100 text-sky-700 border-sky-200",
};

const MOOD_EMOJIS: Record<string, string> = {
  Inspired: "✨",
  Peaceful: "🌿",
  Passionate: "🔥",
  Reflective: "🌙",
  Joyful: "☀️",
  Calm: "🌊",
};

export function ThoughtCard({ id, content, mood, createdAt, delay = 0 }: ThoughtCardProps) {
  const removeThought = useMutation(api.thoughts.remove);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeThought({ id });
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div
      className="group relative animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="bg-white/50 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-amber-200/40 hover:border-amber-300/60 transition-all hover:shadow-lg hover:shadow-amber-900/5">
        {/* Header with mood and time */}
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            {mood && (
              <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-serif border ${MOOD_COLORS[mood] || "bg-gray-100 text-gray-700"}`}>
                {MOOD_EMOJIS[mood]} {mood}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <time className="font-serif text-xs text-amber-500">
              {formatDate(createdAt)}
            </time>

            {/* Delete button */}
            {!showConfirm && (
              <button
                onClick={() => setShowConfirm(true)}
                className="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1.5 md:p-2 text-amber-400 hover:text-rose-500 transition-all"
                aria-label="Delete thought"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="font-serif text-base md:text-lg text-amber-900 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>

        {/* Delete confirmation */}
        {showConfirm && (
          <div className="mt-4 pt-4 border-t border-amber-200/40 flex items-center justify-between gap-4">
            <p className="font-serif text-xs md:text-sm text-amber-600">Delete this thought?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 text-xs md:text-sm font-serif text-amber-600 hover:text-amber-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 text-xs md:text-sm font-serif bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 bg-amber-200/30 rotate-45 translate-x-4 -translate-y-4 md:translate-x-6 md:-translate-y-6 group-hover:bg-amber-300/40 transition-colors" />
      </div>
    </div>
  );
}
