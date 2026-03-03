"use client";

import { useState } from "react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = (await res.json()) as
          | { ok: true; needs_email_confirmation: boolean }
          | { error: string };

        if (!res.ok || ("error" in data && data.error)) {
          throw new Error("error" in data ? data.error : "Sign up failed");
        }

        if ("needs_email_confirmation" in data && data.needs_email_confirmation) {
          setError("Account created! Please confirm your email, then sign in.");
        } else {
          window.location.href = "/game";
        }
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = (await res.json()) as { ok: true } | { error: string };

        if (!res.ok || ("error" in data && data.error)) {
          throw new Error("error" in data ? data.error : "Sign in failed");
        }

        window.location.href = "/game";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    }

    setLoading(false);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="rounded-2xl p-8 shadow-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
              placeholder="Min 6 characters"
            />
          </div>

          {error && (
            <p className="text-sm rounded-lg p-3" style={{ background: "rgba(239,68,68,0.1)", color: "var(--accent-red)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
            style={{ background: "var(--accent-blue)" }}
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="font-medium hover:underline"
            style={{ color: "var(--accent-blue)" }}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
