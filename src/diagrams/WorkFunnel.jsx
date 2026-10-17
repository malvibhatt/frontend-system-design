import { Defs } from "./svg.jsx";

/* Every gate before the network is work that never happens. Drawn to scale,
   because the proportions are the point. */
const LX = 210, BX = 230, BW = 560, Y0 = 50, ROW = 42, BH = 26;

const ROWS = [
  { l: "Keystrokes typed",        n: 100, tone: 1 },
  { l: "≥ 2 characters",          n: 60,  tone: 1, why: "one letter matches everything" },
  { l: "Survive a 150ms debounce", n: 18, tone: 3, why: "only the pause at the end of a word" },
  { l: "Not already cached",      n: 7,   tone: 2, why: "backspacing re-asks an answered question" },
];

export default function WorkFunnel() {
  return (
    <svg viewBox="0 0 880 236" width="880" role="img"
         aria-label="Funnel showing 100 keystrokes reduced to 7 network requests by gating">
      <Defs />
      <text className="d-small" x={20} y={30}>From keystrokes to requests</text>

      {ROWS.map((r, i) => {
        const y = Y0 + i * ROW;
        const w = (r.n / 100) * BW;
        return (
          <g key={r.l}>
            <text className="d-label" x={LX} y={y + 17} textAnchor="end">{r.l}</text>
            <rect x={BX} y={y} width={w} height={BH} rx="4"
                  fill={`var(--d-fill-${r.tone})`} stroke="var(--d-box-line)" />
            <text className="d-mono" x={BX + w + 8} y={y + 17}
                  style={{ fill: "var(--d-text)" }}>{r.n}</text>
            {r.why && (
              <text className="d-small" x={BX + w + 36} y={y + 17}>{r.why}</text>
            )}
          </g>
        );
      })}

      <line x1={BX} y1={220} x2={BX + (7 / 100) * BW} y2={220}
            stroke="var(--d-line)" strokeWidth="3" />
      <text className="d-small" x={BX + 60} y={224} style={{ fill: "var(--d-text)" }}>
        7 network requests out of 100 keystrokes, 93% of the work simply never happens.
      </text>
    </svg>
  );
}
