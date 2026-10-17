import { Defs, Arrow } from "./svg.jsx";

/* Windowing: the scroll height is faked with spacers so the browser keeps a
   correct scrollbar while the DOM holds only what is on screen. */
const ROWS = 5;

export default function FeedList() {
  return (
    <svg viewBox="0 0 880 330" width="880" role="img"
         aria-label="Virtualised list: a scroll window over 10,000 items rendering only visible rows plus spacers">
      <Defs />

      {/* ---- the data ---- */}
      <text className="d-small" x={40} y={34}>What the user can scroll through</text>
      <rect x={60} y={48} width={150} height={238} rx="6"
            fill="var(--d-lane)" stroke="var(--d-box-line)" />
      {Array.from({ length: 26 }, (_, i) => (
        <line key={i} x1={70} y1={58 + i * 9} x2={200} y2={58 + i * 9}
              stroke="var(--d-box-line)" strokeWidth="1" />
      ))}
      <rect x={54} y={128} width={162} height={56} rx="5"
            fill="var(--d-fill-1)" stroke="var(--d-line)" strokeWidth="1.5" />
      <text className="d-mono" x={135} y={160} textAnchor="middle"
            style={{ fill: "var(--d-text)" }}>viewport</text>
      <text className="d-small" x={60} y={302}>10,000 posts</text>
      <text className="d-small" x={60} y={315}>scroll height ≈ 1,200,000px</text>

      <Arrow x1={228} y1={156} x2={300} y2={156} />
      <text className="d-mono" x={264} y={148} textAnchor="middle">renders as</text>

      {/* ---- the DOM ---- */}
      <text className="d-small" x={330} y={34}>What is actually in the DOM</text>

      <rect x={330} y={48} width={300} height={44} rx="6"
            fill="none" stroke="var(--d-box-line)" strokeDasharray="5 4" />
      <text className="d-small" x={480} y={68} textAnchor="middle">top spacer</text>
      <text className="d-mono" x={480} y={82} textAnchor="middle">height = rowsAbove × rowHeight</text>

      {Array.from({ length: ROWS }, (_, i) => (
        <g key={i}>
          <rect x={330} y={100 + i * 26} width={300} height={22} rx="4"
                fill="var(--d-fill-1)" stroke="var(--d-box-line)" />
          <text className="d-mono" x={342} y={115 + i * 26}>post {1247 + i}</text>
        </g>
      ))}

      <rect x={330} y={238} width={300} height={44} rx="6"
            fill="none" stroke="var(--d-box-line)" strokeDasharray="5 4" />
      <text className="d-small" x={480} y={258} textAnchor="middle">bottom spacer</text>
      <text className="d-mono" x={480} y={272} textAnchor="middle">height = rowsBelow × rowHeight</text>

      <line x1={330} y1={296} x2={630} y2={296}
            stroke="var(--d-line)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text className="d-mono" x={330} y={312} style={{ fill: "var(--d-text)" }}>
        sentinel, when it enters view, fetch ?after=cursor
      </text>

      {/* ---- the payoff ---- */}
      <rect x={660} y={100} width={200} height={100} rx="8"
            fill="var(--d-fill-2)" stroke="var(--d-box-line)" />
      <text className="d-title" x={676} y={126}>~15 nodes</text>
      <text className="d-small" x={676} y={146}>not 10,000.</text>
      <text className="d-small" x={676} y={164}>Memory, layout and paint</text>
      <text className="d-small" x={676} y={177}>stay flat no matter how</text>
      <text className="d-small" x={676} y={190}>far the user scrolls.</text>
    </svg>
  );
}
