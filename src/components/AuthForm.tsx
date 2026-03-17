import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function AuthForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch {
      setError(flow === "signIn" ? "Invalid email or password" : "Could not create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      {/* Welcome message */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-amber-950 mb-3 md:mb-4">
          {flow === "signIn" ? "Welcome Back" : "Begin Your Journey"}
        </h2>
        <p className="font-serif text-amber-700 text-base md:text-lg italic">
          {flow === "signIn"
            ? "Your thoughts await you"
            : "A place for your fleeting moments"}
        </p>
      </div>

      {/* Decorative line */}
      <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300" />
        <div className="w-2 h-2 rotate-45 bg-amber-400" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        <div className="space-y-2">
          <label className="block font-serif text-sm text-amber-800 uppercase tracking-widest">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 md:py-4 bg-white/60 border border-amber-200 rounded-lg font-serif text-amber-900 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-base"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-serif text-sm text-amber-800 uppercase tracking-widest">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 md:py-4 bg-white/60 border border-amber-200 rounded-lg font-serif text-amber-900 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-base"
          />
        </div>

        <input name="flow" type="hidden" value={flow} />

        {error && (
          <div className="p-3 md:p-4 bg-rose-50 border border-rose-200 rounded-lg">
            <p className="font-serif text-rose-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 md:py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-cream font-serif text-base md:text-lg rounded-lg hover:from-amber-800 hover:to-amber-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20"
        >
          {isSubmitting ? "Please wait..." : (flow === "signIn" ? "Enter Journal" : "Create Journal")}
        </button>
      </form>

      {/* Toggle flow */}
      <div className="mt-6 md:mt-8 text-center">
        <button
          type="button"
          onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          className="font-serif text-amber-600 hover:text-amber-800 transition-colors text-sm md:text-base"
        >
          {flow === "signIn" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>

      {/* Anonymous option */}
      <div className="mt-6 md:mt-8">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <div className="h-px flex-1 bg-amber-200" />
          <span className="font-serif text-xs md:text-sm text-amber-500 uppercase tracking-widest">or</span>
          <div className="h-px flex-1 bg-amber-200" />
        </div>

        <button
          type="button"
          onClick={() => signIn("anonymous")}
          className="w-full py-3 md:py-4 border-2 border-dashed border-amber-300 text-amber-700 font-serif rounded-lg hover:bg-amber-50 hover:border-amber-400 transition-all text-sm md:text-base"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
