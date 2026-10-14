import { Defs } from "./svg.jsx";

/* Real LCP distributions are right-skewed: a long tail of slow sessions
   that an average hides completely. */
const X0 = 60, BW = 36, STEP = 38, BASE = 206, BUCKET = 0.3;
const HEIGHTS = [6, 18, 40, 68, 92, 104, 98, 86, 72, 60, 50, 42, 34, 28, 22, 18, 14, 11, 8, 6];

const sx = (sec) => X0 + (sec / BUCKET) * STEP;   // seconds → x
const GOOD = 2.5;

const MARKS = [
  { sec: 0.45, l: "your laptop", row: 0, strong: true },
  { sec: 1.9,  l: "p50", row: 1 },
  { sec: 2.9,  l: "p75", row: 0 },
  { sec: 4.6,  l: "p95", row: 1 },
];

export default function FieldData() {
  return (
    <svg viewBox="0 0 880 286" width="880" role="img"
         aria-label="Distribution of real-world LCP times with p50, p75 and p95 marked">
      <Defs />
      <text className="d-small" x={X0} y={26}>
        Largest Contentful Paint across one week of real sessions
      </text>

      {HEIGHTS.map((h, i) => {
        const sec = (i + 0.5) * BUCKET;
        return (
          <rect key={i} x={X0 + i * STEP} y={BASE - h} width={BW} height={h} rx="2"
                fill={sec <= GOOD ? "var(--d-fill-2)" : "var(--d-fill-3)"}
                stroke="var(--d-box-line)" />
        );
      })}

      {/* Core Web Vitals threshold */}
      <line x1={sx(GOOD)} y1={54} x2={sx(GOOD)} y2={BASE}
            stroke="var(--d-line)" strokeWidth="1.5" />
      <text className="d-mono" x={sx(GOOD) + 6} y={50}
            style={{ fill: "var(--d-text)" }}>good ≤ 2.5s</text>

      {/* axis */}
      <line x1={X0 - 6} y1={BASE} x2={820} y2={BASE} stroke="var(--d-box-line)" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5, 6].map((s) => (
        <text className="d-mono" key={s} x={sx(s)} y={BASE + 15} textAnchor="middle">{s}s</text>
      ))}

      {MARKS.map((m) => (
        <g key={m.l}>
          <line x1={sx(m.sec)} y1={BASE} x2={sx(m.sec)} y2={BASE + 24 + m.row * 15}
                stroke="var(--d-line)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={sx(m.sec)} cy={BASE} r="3" fill="var(--d-line)" />
          <text className="d-mono" x={sx(m.sec) + 5} y={BASE + 28 + m.row * 15}
                style={{ fill: m.strong ? "var(--d-text)" : "var(--d-text-dim)" }}>{m.l}</text>
        </g>
      ))}

      <text className="d-small" x={X0} y={278}>
        Your machine is not a percentile. Everything to the right of the line is a real person
        having a worse time than you measured.
      </text>
    </svg>
  );
}
