"use client";

import { useState } from "react";
import type { Decisions } from "@/lib/types";

interface Props {
  onSubmit: (decisions: Decisions) => void;
  loading: boolean;
  quarter: number;
  cash: number;
}

function quarterLabel(q: number) {
  const year = Math.ceil(q / 4);
  const qInYear = ((q - 1) % 4) + 1;
  return `Q${qInYear} Year ${year}`;
}

export default function DecisionPanel({ onSubmit, loading, quarter, cash }: Props) {
  const [unitPrice, setUnitPrice] = useState(800);
  const [newEngineers, setNewEngineers] = useState(0);
  const [newSales, setNewSales] = useState(0);
  const [salaryPct, setSalaryPct] = useState(100);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      unit_price: unitPrice,
      new_engineers: newEngineers,
      new_sales: newSales,
      salary_pct: salaryPct,
    });
  }

  const hiringCost = (newEngineers + newSales) * 5000;

  return (
    <div
      className="rounded-2xl p-6 shadow-lg"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold">Quarterly Decisions</h2>
        <span
          className="text-sm font-mono px-3 py-1 rounded-full"
          style={{ background: "var(--bg-secondary)", color: "var(--accent-blue)" }}
        >
          {quarterLabel(quarter)}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Unit Price */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Unit Price
            </label>
            <span className="text-sm font-mono font-bold" style={{ color: "var(--accent-green)" }}>
              ${unitPrice.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={5000}
            step={50}
            value={unitPrice}
            onChange={(e) => setUnitPrice(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            <span>$50</span>
            <span>$5,000</span>
          </div>
        </div>

        {/* Hiring */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: "var(--text-secondary)" }}>
              Hire Engineers
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNewEngineers(Math.max(0, newEngineers - 1))}
                className="w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition hover:brightness-125"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
              >
                -
              </button>
              <span className="text-xl font-mono font-bold w-8 text-center">{newEngineers}</span>
              <button
                type="button"
                onClick={() => setNewEngineers(Math.min(20, newEngineers + 1))}
                className="w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition hover:brightness-125"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: "var(--text-secondary)" }}>
              Hire Sales Staff
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNewSales(Math.max(0, newSales - 1))}
                className="w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition hover:brightness-125"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
              >
                -
              </button>
              <span className="text-xl font-mono font-bold w-8 text-center">{newSales}</span>
              <button
                type="button"
                onClick={() => setNewSales(Math.min(20, newSales + 1))}
                className="w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition hover:brightness-125"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {hiringCost > 0 && (
          <p className="text-xs" style={{ color: "var(--accent-amber)" }}>
            Hiring cost this quarter: ${hiringCost.toLocaleString()}
          </p>
        )}

        {/* Salary */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Salary (% of industry avg)
            </label>
            <span
              className="text-sm font-mono font-bold"
              style={{
                color: salaryPct >= 100 ? "var(--accent-green)" : "var(--accent-red)",
              }}
            >
              {salaryPct}%
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={150}
            step={5}
            value={salaryPct}
            onChange={(e) => setSalaryPct(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            <span>50%</span>
            <span>100%</span>
            <span>150%</span>
          </div>
        </div>

        {/* Cash display */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg"
          style={{ background: "var(--bg-secondary)" }}
        >
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Cash on Hand
          </span>
          <span
            className="font-mono font-bold"
            style={{ color: cash > 200000 ? "var(--accent-green)" : "var(--accent-red)" }}
          >
            ${cash.toLocaleString()}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white text-lg transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
          style={{
            background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Simulating...
            </span>
          ) : (
            "Advance Quarter"
          )}
        </button>
      </form>
    </div>
  );
}
