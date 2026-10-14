import { Defs, Arrow } from "./svg.jsx";

/* Ask the questions in this order and stop at the first yes.
   The order matters more than the list: it goes cheapest-first. */
const QX = 20, QW = 330, QH = 48, STEP = 62, Y0 = 46;
const AX = 430, AW = 430, AH = 42;
const y = (i) => Y0 + i * STEP;

const ROWS = [
  { q: "Does it come from the server?",
    a: "Server-state cache", s: "TanStack Query · RTK Query · RSC", tone: 2 },
  { q: "Is it already in the URL? (tab, filters, page)",
    a: "Leave it in the URL", s: "useSearchParams — shareable, survives refresh, free back button", tone: 2 },
  { q: "Is it used by exactly one component?",
    a: "useState / useReducer", s: "colocate it; this is the default, not a fallback", tone: 1 },
  { q: "Is it shared by a few nearby components?",
    a: "Lift to the nearest common parent", s: "still the cheapest correct answer", tone: 1 },
  { q: "Global, but changes rarely? (theme, locale, user)",
    a: "Context", s: "every consumer re-renders on change — fine when change is rare", tone: 3 },
  { q: "Global and changes often? (cursor, live selection)",
    a: "External store", s: "Zustand · Redux · signals — components subscribe to slices", tone: 3 },
  { q: "Are there lots of illegal in-between states?",
    a: "State machine", s: "XState — makes the impossible states unrepresentable", tone: 4 },
];

export default function StateDecision() {
  return (
    <svg viewBox="0 0 880 500" width="880" role="img"
         aria-label="Decision tree for choosing where a piece of state should live">
      <Defs />

      <text className="d-small" x={QX} y={28}>Ask in this order. Stop at the first yes.</text>

      {ROWS.map((r, i) => (
        <g key={r.q}>
          <rect x={QX} y={y(i)} width={QW} height={QH} rx="8"
                fill="var(--d-box)" stroke="var(--d-box-line)" />
          <text className="d-label" x={QX + 16} y={y(i) + QH / 2 + 4}>{r.q}</text>

          <Arrow x1={QX + QW + 3} y1={y(i) + QH / 2} x2={AX - 3} y2={y(i) + QH / 2} />
          <text className="d-mono" x={(QX + QW + AX) / 2} y={y(i) + QH / 2 - 7}
                textAnchor="middle" style={{ fill: "var(--d-text)" }}>yes</text>

          <rect x={AX} y={y(i) + (QH - AH) / 2} width={AW} height={AH} rx="8"
                fill={`var(--d-fill-${r.tone})`} stroke="var(--d-box-line)" />
          <text className="d-title" x={AX + 14} y={y(i) + QH / 2 - 3}>{r.a}</text>
          <text className="d-small" x={AX + 14} y={y(i) + QH / 2 + 12}>{r.s}</text>

          {i < ROWS.length - 1 && (
            <>
              <Arrow x1={QX + 40} y1={y(i) + QH + 2} x2={QX + 40} y2={y(i + 1) - 2} />
              <text className="d-mono" x={QX + 48} y={y(i) + QH + 16}>no</text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}
