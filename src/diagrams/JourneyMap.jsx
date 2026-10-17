import { Defs } from "./svg.jsx";

/* The whole method on one picture: six phases, what each answers,
   and the artifact each one hands to the next. */
const W = 136, STEP = 146, Y = 68, H = 92;
const x = (i) => 16 + i * STEP;

const STEPS = [
  { n: 1, name: "Frame",      asks: ["What are we", "building, and", "what must be", "true?"],      out: "numbers" },
  { n: 2, name: "Shape",      asks: ["What screens,", "what seams", "between them?"],               out: "route map" },
  { n: 3, name: "Data",       asks: ["What data, who", "owns it, where", "does it live?"],          out: "data model" },
  { n: 4, name: "Flow",       asks: ["How does it", "arrive and stay", "true?"],                    out: "API + cache" },
  { n: 5, name: "Experience", asks: ["How does it", "feel, fast,", "broken, for all?"],            out: "perf plan" },
  { n: 6, name: "Operate",    asks: ["How do we know", "it works in", "production?"],               out: "a design doc" },
];

export default function JourneyMap() {
  return (
    <svg viewBox="0 0 890 232" width="890" role="img"
         aria-label="The six phases of the method, each producing an artifact for the next">
      <Defs />

      <text className="d-small" x={16} y={28}>
        A brief arrives here
      </text>
      <text className="d-small" x={874} y={28} textAnchor="end">
        …and leaves as a design you can build
      </text>

      {/* the path the work travels along */}
      <line x1={16} y1={46} x2={874} y2={46} stroke="var(--d-box-line)" strokeWidth="1.5" />

      {STEPS.map((s, i) => (
        <g key={s.n}>
          <circle cx={x(i) + W / 2} cy={46} r="5"
                  fill={`var(--p${s.n})`} stroke="var(--bg-raised)" strokeWidth="2" />

          <rect x={x(i)} y={Y} width={W} height={H} rx="9"
                fill={`var(--p${s.n}-soft)`} stroke="var(--d-box-line)" />

          <text x={x(i) + 13} y={Y + 24}
                style={{ font: "700 15px var(--font)", fill: `var(--p${s.n})` }}>
            {s.n}
          </text>
          <text className="d-title" x={x(i) + 29} y={Y + 24}>{s.name}</text>

          {s.asks.map((ln, k) => (
            <text className="d-small" key={ln} x={x(i) + 13} y={Y + 42 + k * 12}>{ln}</text>
          ))}

          {/* the artifact handed forward */}
          <rect x={x(i) + 10} y={Y + H + 14} width={W - 20} height={24} rx="5"
                fill="var(--d-box)" stroke="var(--d-box-line)" />
          <text className="d-mono" x={x(i) + W / 2} y={Y + H + 30} textAnchor="middle"
                style={{ fill: "var(--d-text)" }}>{s.out}</text>

          {i < STEPS.length - 1 && (
            <path d={`M ${x(i) + W + 2} ${Y + H + 26} L ${x(i + 1) + 6} ${Y + H + 26}`}
                  stroke="var(--d-line)" strokeWidth="1.3" markerEnd="url(#arw)" />
          )}
        </g>
      ))}

      <text className="d-small" x={16} y={224}>
        Each phase hands the next one something concrete. If you cannot name what you are handing
        forward, you have not finished the phase.
      </text>
    </svg>
  );
}
