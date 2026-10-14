import { Defs } from "./svg.jsx";

/* The same feed, rendered two ways. The gap between the two LCP markers
   is the entire argument for server rendering a public, content-first page. */
const T0 = 130, TW = 720, TOTAL = 2000;
const x = (ms) => T0 + (ms / TOTAL) * TW;
const w = (ms) => (ms / TOTAL) * TW;

const LANES = [
  {
    name: "Client-rendered", y: 72, lcp: 1700, note: "Nothing to show until the data arrives.",
    segs: [
      { at: 0,    ms: 150, tone: 0, l: "empty HTML" },
      { at: 150,  ms: 550, tone: 3, l: "download JS" },
      { at: 700,  ms: 200, tone: 3, l: "run JS" },
      { at: 900,  ms: 600, tone: 4, l: "fetch feed" },
      { at: 1500, ms: 200, tone: 1, l: "render" },
    ],
  },
  {
    name: "Server-rendered", y: 162, lcp: 700, note: "Posts are in the first response. Hydration only adds interactivity.",
    segs: [
      { at: 0,   ms: 400, tone: 2, l: "server fetches + renders" },
      { at: 400, ms: 250, tone: 2, l: "HTML with posts streams in" },
      { at: 650, ms: 50,  tone: 1, l: "paint" },
      { at: 700, ms: 500, tone: 3, l: "hydrate → interactive" },
    ],
  },
];

const BH = 30;

export default function FeedRender() {
  return (
    <svg viewBox="0 0 880 272" width="880" role="img"
         aria-label="Timeline comparing client-rendered and server-rendered versions of the same feed">
      <Defs />

      {[0, 500, 1000, 1500, 2000].map((ms) => (
        <g key={ms}>
          <line x1={x(ms)} y1={44} x2={x(ms)} y2={232}
                stroke="var(--d-box-line)" strokeDasharray="2 4" />
          <text className="d-mono" x={x(ms)} y={38} textAnchor="middle">{ms}ms</text>
        </g>
      ))}

      {LANES.map((lane) => (
        <g key={lane.name}>
          <text className="d-title" x={20} y={lane.y + 20}>{lane.name}</text>

          {lane.segs.map((s) => (
            <g key={s.l}>
              <rect x={x(s.at)} y={lane.y} width={w(s.ms)} height={BH} rx="4"
                    fill={s.tone === 0 ? "var(--d-box)" : `var(--d-fill-${s.tone})`}
                    stroke="var(--d-box-line)" />
              <text className="d-small" x={x(s.at) + w(s.ms) / 2} y={lane.y + 19}
                    textAnchor="middle">{w(s.ms) > 70 ? s.l : ""}</text>
            </g>
          ))}

          <line x1={x(lane.lcp)} y1={lane.y - 12} x2={x(lane.lcp)} y2={lane.y + BH + 4}
                stroke="var(--d-line)" strokeWidth="1.5" />
          <text className="d-mono" x={x(lane.lcp) + 5} y={lane.y - 4}
                style={{ fill: "var(--d-text)" }}>LCP {lane.lcp}ms</text>

          <text className="d-small" x={20} y={lane.y + 38}>{lane.note}</text>
        </g>
      ))}

      <text className="d-small" x={20} y={262}>
        Same data, same network. The difference is who does the fetching, and when.
      </text>
    </svg>
  );
}
