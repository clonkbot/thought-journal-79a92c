import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { ThoughtCard } from "./ThoughtCard";
import { Id } from "../../convex/_generated/dataModel";

const MOODS = [
  { emoji: "✨", label: "Inspired" },
  { emoji: "🌿", label: "Peaceful" },
  { emoji: "🔥", label: "Passionate" },
  { emoji: "🌙", label: "Reflective" },
  { emoji: "☀️", label: "Joyful" },
  { emoji: "🌊", label: "Calm" },
];

export function ThoughtsApp() {
  const thoughts = useQuery(api.thoughts.list);
  const createThought = useMutation(api.thoughts.create);
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await createThought({ content: content.trim(), mood: selectedMood });
      setContent("");
      setSelectedMood(undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="animate-fade-in">
      {/* Date header */}
      <div className="text-center mb-6 md:mb-10">
        <p className="font-serif text-xs md:text-sm text-amber-600 uppercase tracking-[0.2em] md:tracking-[0.3em]">
          {currentDate}
        </p>
      </div>

      {/* New thought form */}
      <form onSubmit={handleSubmit} className="mb-8 md:mb-16">
        <div className="bg-white/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-8 border border-amber-200/60 shadow-xl shadow-amber-900/5">
          <label className="block font-serif text-xs md:text-sm text-amber-700 uppercase tracking-widest mb-3 md:mb-4">
            What's on your mind?
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Capture this moment..."
            rows={3}
            className="w-full bg-transparent border-none resize-none font-serif text-base md:text-lg lg:text-xl text-amber-900 placeholder:text-amber-400 focus:outline-none leading-relaxed"
          />

          {/* Mood selector */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-amber-200/40">
            <p className="font-serif text-xs text-amber-600 mb-3">How are you feeling?</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((mood) => (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() => setSelectedMood(selectedMood === mood.label ? undefined : mood.label)}
                  className={`px-3 py-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-serif transition-all ${
                    selectedMood === mood.label
                      ? "bg-amber-700 text-cream"
                      : "bg-amber-100/60 text-amber-700 hover:bg-amber-200/60"
                  }`}
                >
                  {mood.emoji} {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-4 md:mt-6 flex justify-end">
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="px-6 py-2.5 md:px-8 md:py-3 bg-amber-800 text-cream font-serif text-sm md:text-base rounded-lg hover:bg-amber-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20"
            >
              {isSubmitting ? "Saving..." : "Save Thought"}
            </button>
          </div>
        </div>
      </form>

      {/* Thoughts list */}
      <div className="space-y-1">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <h2 className="font-display text-lg md:text-xl text-amber-900">Your Thoughts</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent" />
          {thoughts && (
            <span className="font-serif text-xs md:text-sm text-amber-500">
              {thoughts.length} {thoughts.length === 1 ? "entry" : "entries"}
            </span>
          )}
        </div>

        {/* Loading state */}
        {thoughts === undefined && (
          <div className="text-center py-8 md:py-12">
            <div className="inline-block w-6 h-6 md:w-8 md:h-8 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {thoughts && thoughts.length === 0 && (
          <div className="text-center py-12 md:py-20">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-amber-100/60 flex items-center justify-center">
              <span className="text-2xl md:text-3xl">📝</span>
            </div>
            <p className="font-display text-xl md:text-2xl text-amber-800 mb-2">Begin Your Collection</p>
            <p className="font-serif text-amber-600 italic text-sm md:text-base">Your first thought is waiting to be written</p>
          </div>
        )}

        {/* Thoughts grid */}
        {thoughts && thoughts.length > 0 && (
          <div className="grid gap-4 md:gap-6">
            {thoughts.map((thought: { _id: Id<"thoughts">; content: string; mood?: string; createdAt: number }, index: number) => (
              <ThoughtCard
                key={thought._id}
                id={thought._id as Id<"thoughts">}
                content={thought.content}
                mood={thought.mood}
                createdAt={thought.createdAt}
                delay={index * 50}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
