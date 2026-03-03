"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { Game, GameTurn, Decisions, GameState } from "@/lib/types";
import DecisionPanel from "@/components/DecisionPanel";
import Dashboard from "@/components/Dashboard";
import OfficeVisualization from "@/components/OfficeVisualization";
import GameOverModal from "@/components/GameOverModal";

export default function GamePage() {
  const [game, setGame] = useState<Game | null>(null);
  const [turns, setTurns] = useState<GameTurn[]>([]);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const loadGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/game/load");
      const data: GameState = await res.json();
      if (!res.ok) throw new Error((data as unknown as { error: string }).error);
      setGame(data.game);
      setTurns(data.turns);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load game");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  async function startNewGame() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/game/new", { method: "POST" });
      const data: GameState = await res.json();
      if (!res.ok) throw new Error((data as unknown as { error: string }).error);
      setGame(data.game);
      setTurns(data.turns);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create game");
    }
    setLoading(false);
  }

  async function advanceTurn(decisions: Decisions) {
    if (!game) return;
    setAdvancing(true);
    setError(null);
    try {
      const res = await fetch("/api/game/advance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id: game.id, decisions }),
      });
      const data: GameState = await res.json();
      if (!res.ok) throw new Error((data as unknown as { error: string }).error);
      setGame(data.game);
      setTurns(data.turns);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to advance turn");
    }
    setAdvancing(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: "var(--accent-blue)", borderTopColor: "transparent" }}
          />
          <p style={{ color: "var(--text-secondary)" }}>Loading your startup...</p>
        </div>
      </div>
    );
  }

  // No active game — show start screen
  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1
          className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981)",
          }}
        >
          CleanStart
        </h1>
        <p className="mb-8 text-center max-w-md" style={{ color: "var(--text-secondary)" }}>
          You&apos;re the CEO of a brand-new startup. You have $1M in funding,
          4 engineers, 2 sales staff, and product quality 50/100. Make it to
          Year 10 with cash remaining to win.
        </p>
        {error && (
          <p className="mb-4 text-sm" style={{ color: "var(--accent-red)" }}>
            {error}
          </p>
        )}
        <button
          onClick={startNewGame}
          className="px-8 py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-105 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
          }}
        >
          Launch Startup
        </button>
        <button
          onClick={handleLogout}
          className="mt-4 text-sm hover:underline"
          style={{ color: "var(--text-secondary)" }}
        >
          Sign out
        </button>
      </div>
    );
  }

  const isGameOver = game.status === "won" || game.status === "lost";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between backdrop-blur-md"
        style={{
          background: "rgba(10, 15, 28, 0.85)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <h1
          className="text-xl font-extrabold bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          }}
        >
          CleanStart
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
            Year {Math.ceil(game.quarter / 4)} of 10
          </span>
          <div
            className="h-2 w-24 rounded-full overflow-hidden"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(game.quarter / 40) * 100}%`,
                background: "linear-gradient(90deg, var(--accent-blue), var(--accent-green))",
              }}
            />
          </div>
          <button
            onClick={handleLogout}
            className="text-xs hover:underline"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Decision Panel + Office */}
        <div className="lg:col-span-4 space-y-4">
          {!isGameOver && (
            <DecisionPanel
              onSubmit={advanceTurn}
              loading={advancing}
              quarter={game.quarter}
              cash={game.cash}
            />
          )}
          <OfficeVisualization
            engineers={game.engineers}
            salesStaff={game.sales_staff}
          />
        </div>

        {/* Right: Dashboard */}
        <div className="lg:col-span-8">
          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm"
              style={{ background: "rgba(239,68,68,0.1)", color: "var(--accent-red)" }}
            >
              {error}
            </div>
          )}
          <Dashboard game={game} turns={turns} />
        </div>
      </main>

      {/* Game Over Modal */}
      {isGameOver && <GameOverModal game={game} onNewGame={startNewGame} />}
    </div>
  );
}
