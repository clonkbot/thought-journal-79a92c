import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { ThoughtsApp } from "./components/ThoughtsApp";
import { AuthForm } from "./components/AuthForm";
import "./styles.css";

function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-pulse">
          <div className="font-serif text-2xl text-amber-900 italic">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden flex flex-col">
      {/* Paper texture overlay */}
      <div className="fixed inset-0 pointer-events-none paper-texture opacity-40" />

      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-64 h-64 md:w-96 md:h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="fixed bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 translate-x-1/2 translate-y-1/2 rounded-full bg-rose-200/20 blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-amber-200/60 bg-cream/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                <span className="text-cream font-serif text-sm md:text-lg">T</span>
              </div>
              <h1 className="font-display text-xl md:text-2xl lg:text-3xl text-amber-950 tracking-tight">
                Thought<span className="italic text-amber-700">Journal</span>
              </h1>
            </div>

            {isAuthenticated && (
              <button
                onClick={() => signOut()}
                className="text-xs md:text-sm font-serif text-amber-700 hover:text-amber-900 transition-colors px-3 py-2 md:px-4 md:py-2 rounded-full border border-amber-300 hover:border-amber-400 hover:bg-amber-50"
              >
                Sign Out
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-6 md:py-12">
          {isAuthenticated ? <ThoughtsApp /> : <AuthForm />}
        </main>

        {/* Footer */}
        <footer className="border-t border-amber-200/40 py-4 md:py-6 mt-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <p className="text-xs text-amber-600/60 font-serif">
              Requested by @web-user · Built by @clonkbot
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
