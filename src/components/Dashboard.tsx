"use client";

import type { Game, GameTurn } from "@/lib/types";
import HistoryChart from "./HistoryChart";

interface Props {
  game: Game;
  turns: GameTurn[];
}

function quarterLabel(q: number) {
  const year = Math.ceil(q / 4);
  const qInYear = ((q - 1) % 4) + 1;
  return `Q${qInYear}Y${year}`;
}

function formatMoney(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export default function Dashboard({ game, turns }: Props) {
  const lastTurn = turns.length > 0 ? turns[turns.length - 1] : null;
  const revenue = lastTurn?.revenue ?? 0;
  const netIncome = lastTurn?.net_income ?? 0;

  const stats = [
    {
      label: "Cash on Hand",
      value: formatMoney(game.cash),
      color: game.cash > 200000 ? "var(--accent-green)" : "var(--accent-red)",
    },
    {
      label: "Product Quality",
      value: `${Math.round(Number(game.quality))} / 100`,
      color: "var(--accent-purple)",
    },
    {
      label: "Revenue",
      value: formatMoney(revenue),
      color: "var(--accent-blue)",
    },
    {
      label: "Net Income",
      value: formatMoney(netIncome),
      color: netIncome >= 0 ? "var(--accent-green)" : "var(--accent-red)",
    },
    {
      label: "Engineers",
      value: String(game.engineers),
      color: "var(--accent-purple)",
    },
    {
      label: "Sales Staff",
      value: String(game.sales_staff),
      color: "var(--accent-amber)",
    },
    {
      label: "Quarter",
      value: quarterLabel(game.quarter),
      color: "var(--text-primary)",
    },
  ];

  const recentTurns = turns.slice(-4);

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
              {stat.label}
            </p>
            <p className="text-xl font-bold font-mono" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* History Chart */}
      {turns.length > 0 && (
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
        >
          <h3 className="text-sm font-bold mb-3" style={{ color: "var(--text-secondary)" }}>
            Financial History
          </h3>
          <HistoryChart turns={turns} />
        </div>
      )}

      {/* Recent Quarters Table */}
      {recentTurns.length > 0 && (
        <div
          className="rounded-xl p-5 overflow-x-auto"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
        >
          <h3 className="text-sm font-bold mb-3" style={{ color: "var(--text-secondary)" }}>
            Last {recentTurns.length} Quarter{recentTurns.length > 1 ? "s" : ""}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: "var(--text-secondary)" }}>
                <th className="text-left py-2 pr-3 font-medium">Qtr</th>
                <th className="text-right py-2 px-3 font-medium">Price</th>
                <th className="text-right py-2 px-3 font-medium">Sold</th>
                <th className="text-right py-2 px-3 font-medium">Revenue</th>
                <th className="text-right py-2 px-3 font-medium">Costs</th>
                <th className="text-right py-2 pl-3 font-medium">Net</th>
              </tr>
            </thead>
            <tbody>
              {recentTurns.map((t) => (
                <tr key={t.id} style={{ borderTop: "1px solid var(--border-color)" }}>
                  <td className="py-2 pr-3 font-mono">{quarterLabel(t.quarter)}</td>
                  <td className="text-right py-2 px-3 font-mono">${Number(t.unit_price).toLocaleString()}</td>
                  <td className="text-right py-2 px-3 font-mono">{t.units_sold}</td>
                  <td className="text-right py-2 px-3 font-mono" style={{ color: "var(--accent-blue)" }}>
                    {formatMoney(Number(t.revenue))}
                  </td>
                  <td className="text-right py-2 px-3 font-mono" style={{ color: "var(--accent-red)" }}>
                    {formatMoney(Number(t.total_costs))}
                  </td>
                  <td
                    className="text-right py-2 pl-3 font-mono font-bold"
                    style={{ color: Number(t.net_income) >= 0 ? "var(--accent-green)" : "var(--accent-red)" }}
                  >
                    {formatMoney(Number(t.net_income))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
