import { Defs } from "./svg.jsx";

/* One trace id, propagated across the boundary, turns "the save button is
   slow" into "the database query is slow". */
const LX = 20, LW = 210, T0 = 240, TW = 610, TOTAL = 1200;
const ROW_H = 24, Y0 = 56;
const w = (ms) => (ms / TOTAL) * TW;
const x = (ms) => T0 + w(ms);

const SPANS = [
  { l: "click → screen updated", at: 0,    ms: 1200, tone: 0, depth: 0, side: "browser" },
  { l: "event handler + render", at: 10,   ms: 110,  tone: 1, depth: 1, side: "browser" },
  { l: "request in flight",      at: 120,  ms: 980,  tone: 4, depth: 1, side: "network" },
  { l: "BFF handler",            at: 160,  ms: 900,  tone: 2, depth: 2, side: "server" },
  { l: "auth check",             at: 175,  ms: 60,   tone: 2, depth: 3, side: "server" },
  { l: "database query",         at: 240,  ms: 700,  tone: 3, depth: 3, side: "server" },
  { l: "serialise response",     at: 945,  ms: 110,  tone: 2, depth: 3, side: "server" },
  { l: "re-render with data",    at: 1105, ms: 95,   tone: 1, depth: 1, side: "browser" },
];

export default function Trace() {
  return (
    <svg viewBox="0 0 880 290" width="880" role="img"
         aria-label="A distributed trace waterfall from a browser click through a BFF to the database">
      <Defs />
      <text className="d-small" x={LX} y={26}>
        One trace, joined by a <tspan style={{ fill: "var(--d-text)" }}>traceparent</tspan> header
        the browser sends with the request
      </text>

      {[0, 300, 600, 900, 1200].map((ms) => (
        <g key={ms}>
          <line x1={x(ms)} y1={40} x2={x(ms)} y2={Y0 + SPANS.length * ROW_H}
                stroke="var(--d-box-line)" strokeDasharray="2 4" />
          <text className="d-mono" x={x(ms)} y={36} textAnchor="middle">{ms}ms</text>
        </g>
      ))}

      {SPANS.map((s, i) => {
        const y = Y0 + i * ROW_H;
        return (
          <g key={s.l}>
            <text className="d-small" x={LX + s.depth * 10} y={y + 14}
                  style={{ fill: s.depth === 0 ? "var(--d-text)" : "var(--d-text-dim)" }}>
              {s.l}
            </text>
            <text className="d-mono" x={LX + LW} y={y + 14} textAnchor="end">{s.side}</text>
            <rect x={x(s.at)} y={y + 3} width={w(s.ms)} height={ROW_H - 10} rx="3"
                  fill={s.tone === 0 ? "var(--d-box)" : `var(--d-fill-${s.tone})`}
                  stroke="var(--d-box-line)" />
            <text className="d-mono" x={x(s.at) + w(s.ms) + 5} y={y + 15}>{s.ms}ms</text>
          </g>
        );
      })}

      <text className="d-small" x={LX} y={274}>
        Without propagation you know the click took 1.2s. With it you know 700ms of that was one
        database query — and which one.
      </text>
    </svg>
  );
}
