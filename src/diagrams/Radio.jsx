import { Defs } from "./svg.jsx";

/* Columns are sized by how much they actually deserve, and the bar at the
   bottom shows where the time really goes. */
const COLS = [
  { k: "R", w: 130, tone: 1, name: "Requirements", pct: 10, bullets: [
      "Core features only", "Who the users are", "Devices + offline",
      "a11y, i18n, perf", "Rough traffic volume"] },
  { k: "A", w: 145, tone: 2, name: "Architecture", pct: 15, bullets: [
      "Sketch the UI first", "Component boundaries", "Where state lives",
      "Render strategy", "What ships to client"] },
  { k: "D", w: 145, tone: 3, name: "Data model", pct: 15, bullets: [
      "Client-side types", "Server vs client state", "Normalised vs nested",
      "What survives reload"] },
  { k: "I", w: 145, tone: 4, name: "Interface / API", pct: 15, bullets: [
      "REST · GraphQL · RPC", "Pull or push?", "Pagination: cursor",
      "Errors, retries, auth"] },
  { k: "O", w: 245, tone: 1, name: "Optimisations", pct: 45, bullets: [
      "Loading: splitting, prefetch, streaming",
      "Rendering: virtualise, cut re-renders",
      "Network: cache, dedupe, debounce",
      "Resilience: retry, offline, error states",
      "Accessibility: keyboard, contrast, ARIA",
      "Security: XSS, CSP, token storage",
      "Observability: Web Vitals, errors"] },
];

const GAP = 10, X0 = 20;
const xs = COLS.reduce((acc, c, i) => {
  acc.push(i === 0 ? X0 : acc[i - 1] + COLS[i - 1].w + GAP);
  return acc;
}, []);

const BAR_X = 20, BAR_W = 840, BAR_Y = 234, BAR_H = 14;

/* Pre-compute each segment's x/width once, so nothing is mutated mid-render. */
const SEGS = COLS.reduce((acc, c, i) => {
  const w = (BAR_W * c.pct) / 100;
  acc.push({ ...c, x: i === 0 ? BAR_X : acc[i - 1].x + acc[i - 1].segW, segW: w });
  return acc;
}, []);

export default function Radio() {
  return (
    <svg viewBox="0 0 880 282" width="880" role="img"
         aria-label="The RADIO framework: requirements, architecture, data model, interface, optimisations">
      <Defs />

      {COLS.map((c, i) => (
        <g key={c.k}>
          <rect x={xs[i]} y={36} width={c.w} height={64} rx="8"
                fill={`var(--d-fill-${c.tone})`} stroke="var(--d-box-line)" />
          <text x={xs[i] + 20} y={78} textAnchor="middle"
                style={{ font: "700 26px var(--font)", fill: "var(--d-text)" }}>{c.k}</text>
          <text className="d-title" x={xs[i] + 40} y={64}>{c.name}</text>
          <text className="d-mono" x={xs[i] + 40} y={81}>{c.pct}% of your time</text>

          {c.bullets.map((b, k) => (
            <text className="d-small" key={b} x={xs[i] + 4} y={120 + k * 13}>• {b}</text>
          ))}
        </g>
      ))}

      <text className="d-small" x={BAR_X} y={226}>Where the time actually goes</text>
      {SEGS.map((c) => (
        <g key={c.k}>
          <rect x={c.x} y={BAR_Y} width={c.segW} height={BAR_H} rx="3"
                fill={`var(--d-fill-${c.tone})`} stroke="var(--d-box-line)" />
          <text className="d-mono" x={c.x + c.segW / 2} y={BAR_Y + 11} textAnchor="middle"
                style={{ fill: "var(--d-text)" }}>{c.k}</text>
          <text className="d-mono" x={c.x + c.segW / 2} y={BAR_Y + 30} textAnchor="middle">
            {c.pct}%
          </text>
        </g>
      ))}
    </svg>
  );
}
