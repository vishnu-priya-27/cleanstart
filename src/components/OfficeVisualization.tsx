"use client";

interface Props {
  engineers: number;
  salesStaff: number;
}

function DeskIcon({ filled, type }: { filled: boolean; type: "eng" | "sales" }) {
  const color = filled
    ? type === "eng"
      ? "var(--accent-purple)"
      : "var(--accent-amber)"
    : "var(--border-color)";
  const bgColor = filled
    ? type === "eng"
      ? "rgba(139, 92, 246, 0.1)"
      : "rgba(245, 158, 11, 0.1)"
    : "rgba(55, 65, 81, 0.2)";

  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-lg transition-all duration-300"
      style={{
        width: 52,
        height: 52,
        background: bgColor,
        border: `1.5px solid ${color}`,
        opacity: filled ? 1 : 0.35,
      }}
    >
      {/* Desk */}
      <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
        {/* Monitor */}
        <rect x="8" y="0" width="12" height="9" rx="1.5" stroke={color} strokeWidth="1.5" fill={filled ? `${color}22` : "none"} />
        {/* Stand */}
        <line x1="14" y1="9" x2="14" y2="12" stroke={color} strokeWidth="1.5" />
        {/* Desk surface */}
        <rect x="2" y="13" width="24" height="2.5" rx="1" fill={color} />
        {/* Legs */}
        <line x1="5" y1="15.5" x2="5" y2="21" stroke={color} strokeWidth="1.5" />
        <line x1="23" y1="15.5" x2="23" y2="21" stroke={color} strokeWidth="1.5" />
      </svg>
      {/* Person indicator */}
      {filled && (
        <div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
      )}
    </div>
  );
}

export default function OfficeVisualization({ engineers, salesStaff }: Props) {
  const maxEngDesks = Math.max(engineers, 10);
  const maxSalesDesks = Math.max(salesStaff, 6);

  const engDesks = Array.from({ length: maxEngDesks }, (_, i) => i < engineers);
  const salesDesks = Array.from({ length: maxSalesDesks }, (_, i) => i < salesStaff);

  return (
    <div
      className="rounded-2xl p-5 shadow-lg"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <h2 className="text-lg font-bold mb-4">Office Floor</h2>

      <div className="space-y-5">
        {/* Engineering Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full" style={{ background: "var(--accent-purple)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Engineering &mdash; {engineers} / {maxEngDesks} desks
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {engDesks.map((filled, i) => (
              <DeskIcon key={`eng-${i}`} filled={filled} type="eng" />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px"
          style={{ background: "var(--border-color)" }}
        />

        {/* Sales Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full" style={{ background: "var(--accent-amber)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Sales &mdash; {salesStaff} / {maxSalesDesks} desks
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {salesDesks.map((filled, i) => (
              <DeskIcon key={`sales-${i}`} filled={filled} type="sales" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
