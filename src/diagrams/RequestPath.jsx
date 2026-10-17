import { Defs, Arrow } from "./svg.jsx";

/* A request is a chain of things that could answer it. Each layer either
   answers (fast, possibly stale) or forwards right (slow, authoritative). */
const W = 155, STEP = 170, Y = 56, H = 78;
const x = (i) => 20 + i * STEP;

const HOPS = [
  { tone: 1, title: "Component",     lines: ["useQuery() / fetch()"],                      note: "asks" },
  { tone: 4, title: "Memory cache",  lines: ["TanStack Query, SWR,", "RTK Query"],          note: "~0 ms" },
  { tone: 4, title: "Disk cache",    lines: ["Service worker +", "HTTP cache"],             note: "~1-5 ms" },
  { tone: 2, title: "CDN edge",      lines: ["nearest city to", "the user"],                note: "~20 ms" },
  { tone: 2, title: "Origin + DB",   lines: ["one region,", "one source of truth"],         note: "~100-300 ms" },
];

const END = x(4) + W;

export default function RequestPath() {
  return (
    <svg viewBox="0 0 875 212" width="875" role="img"
         aria-label="A data request passing through memory cache, disk cache, CDN and origin server">
      <Defs />

      <text className="d-small" x={20} y={30}>
        The request only moves right when the layer on the left cannot answer it
      </text>

      {HOPS.map((hop, i) => {
        const fill = hop.tone === 0 ? "var(--d-box)" : `var(--d-fill-${hop.tone})`;
        return (
          <g key={hop.title}>
            <rect x={x(i)} y={Y} width={W} height={H} rx="8"
                  fill={fill} stroke="var(--d-box-line)" />
            <text className="d-title" x={x(i) + W / 2} y={Y + 21} textAnchor="middle">
              {hop.title}
            </text>
            {hop.lines.map((ln, k) => (
              <text className="d-small" key={ln} x={x(i) + W / 2} y={Y + 38 + k * 12}
                    textAnchor="middle">{ln}</text>
            ))}
            <text className="d-mono" x={x(i) + W / 2} y={Y + H - 10} textAnchor="middle"
                  style={{ fill: "var(--d-text)" }}>{hop.note}</text>

            {i < HOPS.length - 1 && (
              <>
                <Arrow x1={x(i) + W + 3} y1={Y + H / 2} x2={x(i + 1) - 3} y2={Y + H / 2} />
                <text className="d-mono" x={x(i) + W + STEP / 2 - W / 2} y={Y + H / 2 - 7}
                      textAnchor="middle">miss</text>
              </>
            )}
          </g>
        );
      })}

      {/* the answer comes back along the same chain, whoever produced it */}
      <Arrow x1={END} y1={170} x2={20} y2={170} />
      <text className="d-small" x={END} y={192} textAnchor="end">
        whichever layer answers, the response returns along the same chain
      </text>
    </svg>
  );
}
