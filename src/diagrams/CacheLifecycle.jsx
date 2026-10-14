import { Defs } from "./svg.jsx";

/* The life of one cache entry. staleTime and gcTime answer different
   questions and get confused constantly — hence two separate boundaries. */
const X = 20, W = 840, BY = 96, BH = 38;
const tx = (t) => X + t * W;

const FRESH_END = 0.30, GC_END = 0.72;

const MARKS = [
  { t: 0,         row: 0, l: "fetched — written to cache" },
  { t: FRESH_END, row: 1, l: "staleTime ends" },
  { t: 0.55,      row: 0, l: "last component using it unmounts" },
  { t: GC_END,    row: 1, l: "gcTime ends — entry evicted" },
];

const ZONES = [
  { from: 0, to: FRESH_END, fill: "var(--d-fill-2)", name: "FRESH",
    lines: ["A component mounts now:", "served from cache.", "No request is made at all."] },
  { from: FRESH_END, to: GC_END, fill: "var(--d-fill-3)", name: "STALE",
    lines: ["A component mounts now: cached data is shown instantly,", "and a refetch starts in the background. The screen updates", "when it lands. The user never sees a spinner."] },
  { from: GC_END, to: 1, fill: "var(--d-lane)", name: "GONE",
    lines: ["A component mounts now:", "nothing cached.", "Spinner."] },
];

export default function CacheLifecycle() {
  return (
    <svg viewBox="0 0 880 262" width="880" role="img"
         aria-label="Lifecycle of a cache entry through fresh, stale and evicted states">
      <Defs />
      <text className="d-small" x={X} y={26}>One cache entry, over time</text>

      {MARKS.map((m) => (
        <g key={m.l}>
          <line x1={tx(m.t)} y1={38 + m.row * 16} x2={tx(m.t)} y2={BY}
                stroke="var(--d-line)" strokeWidth="1" strokeDasharray="3 3" />
          <text className="d-mono" x={tx(m.t) + 5} y={46 + m.row * 16}
                style={{ fill: "var(--d-text)" }}>{m.l}</text>
        </g>
      ))}

      {ZONES.map((z) => (
        <g key={z.name}>
          <rect x={tx(z.from)} y={BY} width={tx(z.to) - tx(z.from)} height={BH} rx="4"
                fill={z.fill} stroke="var(--d-box-line)" />
          <text className="d-title" x={(tx(z.from) + tx(z.to)) / 2} y={BY + 24}
                textAnchor="middle">{z.name}</text>

          <rect x={tx(z.from)} y={BY + 54} width={tx(z.to) - tx(z.from) - 2} height={62} rx="6"
                fill="var(--d-box)" stroke="var(--d-box-line)" />
          {z.lines.map((ln, k) => (
            <text className="d-small" key={ln} x={tx(z.from) + 12} y={BY + 74 + k * 13}>{ln}</text>
          ))}
        </g>
      ))}

      <text className="d-small" x={X} y={240}>
        <tspan style={{ fill: "var(--d-text)" }}>staleTime</tspan> decides when to refetch.&nbsp;
        <tspan style={{ fill: "var(--d-text)" }}>gcTime</tspan> decides when to forget. Only the
        second one frees memory — and only once nothing is using the entry.
      </text>
    </svg>
  );
}
