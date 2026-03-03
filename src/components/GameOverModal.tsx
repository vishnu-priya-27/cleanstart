"use client";

import type { Game } from "@/lib/types";

interface Props {
  game: Game;
  onNewGame: () => void;
}

function formatMoney(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export default function GameOverModal({ game, onNewGame }: Props) {
  const isWin = game.status === "won";
  const cumulativeProfit =
    Number(game.cumulative_revenue) - Number(game.cumulative_costs);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl text-center"
        style={{
          background: "var(--bg-card)",
          border: `2px solid ${isWin ? "var(--accent-green)" : "var(--accent-red)"}`,
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 text-4xl"
          style={{
            background: isWin ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
          }}
        >
          {isWin ? (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 6 9 6 9zm12 0h1.5a2.5 2.5 0 000-5C17 4 18 9 18 9z" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0012 0V2z" />
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          )}
        </div>

        <h2
          className="text-3xl font-extrabold mb-2"
          style={{ color: isWin ? "var(--accent-green)" : "var(--accent-red)" }}
        >
          {isWin ? "You Won!" : "Game Over"}
        </h2>

        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          {isWin
            ? "Your startup survived 10 years! Here are your results:"
            : "Your startup ran out of cash."}
        </p>

        <div
          className="rounded-xl p-4 mb-6 space-y-3"
          style={{ background: "var(--bg-secondary)" }}
        >
          {isWin && (
            <div className="flex justify-between">
              <span style={{ color: "var(--text-secondary)" }}>Cumulative Profit</span>
              <span
                className="font-mono font-bold"
                style={{
                  color: cumulativeProfit >= 0 ? "var(--accent-green)" : "var(--accent-red)",
                }}
              >
                {formatMoney(cumulativeProfit)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span style={{ color: "var(--text-secondary)" }}>Total Revenue</span>
            <span className="font-mono font-bold" style={{ color: "var(--accent-blue)" }}>
              {formatMoney(Number(game.cumulative_revenue))}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--text-secondary)" }}>Total Costs</span>
            <span className="font-mono font-bold" style={{ color: "var(--accent-red)" }}>
              {formatMoney(Number(game.cumulative_costs))}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--text-secondary)" }}>Final Cash</span>
            <span className="font-mono font-bold">{formatMoney(game.cash)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--text-secondary)" }}>Quarters Survived</span>
            <span className="font-mono font-bold">{game.quarter}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--text-secondary)" }}>Final Team Size</span>
            <span className="font-mono font-bold">
              {game.engineers} eng + {game.sales_staff} sales
            </span>
          </div>
        </div>

        <button
          onClick={onNewGame}
          className="w-full py-3 rounded-xl font-bold text-white text-lg transition-all hover:scale-[1.02] hover:shadow-lg"
          style={{
            background: isWin
              ? "linear-gradient(135deg, var(--accent-green), #059669)"
              : "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
          }}
        >
          Start New Game
        </button>
      </div>
    </div>
  );
}
