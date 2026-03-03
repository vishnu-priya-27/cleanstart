"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { GameTurn } from "@/lib/types";

interface Props {
  turns: GameTurn[];
}

function quarterLabel(q: number) {
  const year = Math.ceil(q / 4);
  const qInYear = ((q - 1) % 4) + 1;
  return `Q${qInYear}Y${year}`;
}

export default function HistoryChart({ turns }: Props) {
  const data = turns.map((t) => ({
    name: quarterLabel(t.quarter),
    Revenue: Number(t.revenue),
    Costs: Number(t.total_costs),
    Cash: Number(t.cash_after),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <defs>
          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradCash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" fontSize={11} />
        <YAxis
          fontSize={11}
          tickFormatter={(v: number) =>
            v >= 1_000_000
              ? `${(v / 1_000_000).toFixed(1)}M`
              : `${(v / 1_000).toFixed(0)}K`
          }
        />
        <Tooltip
          contentStyle={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="Revenue"
          stroke="#3b82f6"
          fill="url(#gradRevenue)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="Costs"
          stroke="#ef4444"
          fill="none"
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <Area
          type="monotone"
          dataKey="Cash"
          stroke="#10b981"
          fill="url(#gradCash)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
