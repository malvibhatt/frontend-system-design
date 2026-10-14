import { Defs, Box, Arrow } from "./svg.jsx";

/* Stage pipeline: 5 boxes of 118 wide, 20 apart, starting at x=20. */
const W = 118, GAP = 20, Y = 72, H = 64;
const x = (i) => 20 + i * (W + GAP);

const STAGES = [
  { where: "network", tone: 2, title: "Find & connect",  sub: "DNS · TCP · TLS",      note: "~50–200ms" },
  { where: "network", tone: 2, title: "Fetch HTML",      sub: "CDN edge or origin",   note: "TTFB" },
  { where: "browser", tone: 3, title: "Parse & fetch",   sub: "CSS + JS discovered",  note: "render-blocking" },
  { where: "browser", tone: 1, title: "First paint",     sub: "pixels on screen",     note: "FCP → LCP" },
  { where: "browser", tone: 3, title: "JS runs",         sub: "hydrate · fetch data", note: "now clickable" },
];

/* Timeline geometry */
const T0 = 20, T1 = x(4) + W;          // 20 → 690
const FCP = 404, INTERACTIVE = x(4);   // segment boundaries
const BAR_Y = 206, BAR_H = 11;

export default function PageLoad() {
  return (
    <svg viewBox="0 0 710 290" width="710" role="img"
         aria-label="Timeline of a page load from DNS lookup to interactive">
      <Defs />

      {STAGES.map((s, i) => (
        <g key={s.title}>
          <text className="d-mono" x={x(i) + W / 2} y={Y - 12} textAnchor="middle">
            {s.where}
          </text>
          <Box x={x(i)} y={Y} w={W} h={H} tone={s.tone}
               title={s.title} sub={s.sub} note={s.note} />
          {i < STAGES.length - 1 && (
            <Arrow x1={x(i) + W + 3} y1={Y + H / 2} x2={x(i + 1) - 3} y2={Y + H / 2} />
          )}
        </g>
      ))}

      {/* ---- what the user actually experiences ---- */}
      <text className="d-small" x={T0} y={BAR_Y - 12}>What the user sees</text>

      <rect x={T0} y={BAR_Y} width={FCP - T0} height={BAR_H} rx="3"
            fill="var(--d-lane)" stroke="var(--d-box-line)" />
      <rect x={FCP} y={BAR_Y} width={INTERACTIVE - FCP} height={BAR_H} rx="3"
            fill="var(--d-fill-3)" stroke="var(--d-box-line)" />
      <rect x={INTERACTIVE} y={BAR_Y} width={T1 - INTERACTIVE} height={BAR_H} rx="3"
            fill="var(--d-fill-2)" stroke="var(--d-box-line)" />

      <text className="d-label" x={(T0 + FCP) / 2} y={BAR_Y + 30} textAnchor="middle">
        Blank screen
      </text>
      <text className="d-label" x={(FCP + INTERACTIVE) / 2} y={BAR_Y + 30} textAnchor="middle">
        Visible, not clickable
      </text>
      <text className="d-label" x={(INTERACTIVE + T1) / 2} y={BAR_Y + 30} textAnchor="middle">
        Interactive
      </text>

      {/* ---- metric markers ---- */}
      {[
        { at: FCP, label: "FCP", row: 0 },
        { at: 505, label: "LCP", row: 1 },
        { at: INTERACTIVE, label: "INP measured from here", row: 0 },
      ].map((m) => (
        <g key={m.label}>
          <line x1={m.at} y1={Y + H} x2={m.at} y2={BAR_Y} stroke="var(--d-line)"
                strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={m.at} cy={BAR_Y} r="3" fill="var(--d-line)" />
          <text className="d-mono" x={m.at + 5} y={BAR_Y + 54 + m.row * 14}>{m.label}</text>
          <line x1={m.at} y1={BAR_Y + BAR_H} x2={m.at} y2={BAR_Y + 46 + m.row * 14}
                stroke="var(--d-line)" strokeWidth="1" strokeDasharray="3 3" />
        </g>
      ))}

      <text className="d-mono" x={T1} y={BAR_Y + 54} textAnchor="end">time →</text>
    </svg>
  );
}
