import { Defs, Arrow } from "./svg.jsx";

/* The network delivers messages at whatever rate it likes. The screen can
   only usefully change 60 times a second. This pipeline is that mismatch. */
const W = 150, STEP = 170, Y = 74, H = 84;
const x = (i) => 20 + i * STEP;

const STAGES = [
  { tone: 2, t: "Stream",       l: ["SSE connection", "delivering deltas"],        rate: "≈500 msg/s" },
  { tone: 4, t: "Buffer",       l: ["Map keyed by", "vehicleId —", "last write wins"], rate: "no renders" },
  { tone: 3, t: "Flush on rAF", l: ["once per frame,", "whatever arrived"],        rate: "≤60/s" },
  { tone: 1, t: "Store",        l: ["one batched", "update"],                      rate: "≤60/s" },
  { tone: 1, t: "Render",       l: ["only markers that", "actually moved"],        rate: "≤60/s" },
];

export default function LivePipeline() {
  return (
    <svg viewBox="0 0 870 246" width="870" role="img"
         aria-label="Pipeline coalescing a high-rate event stream into at most one render per animation frame">
      <Defs />

      {/* message density before and after coalescing */}
      {Array.from({ length: 46 }, (_, i) => (
        <line key={i} x1={28 + i * 7} y1={38} x2={28 + i * 7} y2={52}
              stroke="var(--d-line)" strokeWidth="1" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`f${i}`} x1={530 + i * 54} y1={38} x2={530 + i * 54} y2={52}
              stroke="var(--d-line)" strokeWidth="2" />
      ))}
      <text className="d-mono" x={28} y={30}>messages in</text>
      <text className="d-mono" x={530} y={30}>renders out</text>

      {STAGES.map((s, i) => (
        <g key={s.t}>
          <rect x={x(i)} y={Y} width={W} height={H} rx="8"
                fill={`var(--d-fill-${s.tone})`} stroke="var(--d-box-line)" />
          <text className="d-title" x={x(i) + W / 2} y={Y + 24} textAnchor="middle">{s.t}</text>
          {s.l.map((ln, k) => (
            <text className="d-small" key={ln} x={x(i) + W / 2} y={Y + 42 + k * 12}
                  textAnchor="middle">{ln}</text>
          ))}
          <text className="d-mono" x={x(i) + W / 2} y={Y + H - 9} textAnchor="middle"
                style={{ fill: "var(--d-text)" }}>{s.rate}</text>
          {i < STAGES.length - 1 && (
            <Arrow x1={x(i) + W + 3} y1={Y + H / 2} x2={x(i + 1) - 3} y2={Y + H / 2} />
          )}
        </g>
      ))}

      <text className="d-small" x={20} y={190}>
        If one vehicle reports eight times between two frames, seven of those updates are states
        nobody could have seen.
      </text>
      <text className="d-small" x={20} y={206}>
        The buffer discards them by overwriting the same key — which is why it is a Map and not a queue.
      </text>
      <text className="d-small" x={20} y={230} style={{ fill: "var(--d-text)" }}>
        Without this stage, a busy depot renders itself to a standstill.
      </text>
    </svg>
  );
}
