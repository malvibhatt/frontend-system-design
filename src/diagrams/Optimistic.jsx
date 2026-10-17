import { Defs, Arrow } from "./svg.jsx";

/* Optimistic update. The snapshot in step 1 is what makes the failure
   branch possible at all. It is the step people leave out. */
const LX = 20, LW = 320, LH = 52;
const STEPS = [
  { y: 46,  t: "1 · Snapshot the cache", s: "remember the current value first", tone: 4 },
  { y: 116, t: "2 · Update the UI now",  s: "0 ms, the click feels instant",   tone: 1 },
  { y: 186, t: "3 · Send the mutation",  s: "request in flight",                tone: 1 },
];

const RX = 400, RW = 440;

export default function Optimistic() {
  return (
    <svg viewBox="0 0 880 340" width="880" role="img"
         aria-label="Optimistic update flow with success and rollback branches">
      <Defs />

      {STEPS.map((s, i) => (
        <g key={s.t}>
          <rect x={LX} y={s.y} width={LW} height={LH} rx="8"
                fill={`var(--d-fill-${s.tone})`} stroke="var(--d-box-line)" />
          <text className="d-title" x={LX + 16} y={s.y + 22}>{s.t}</text>
          <text className="d-small" x={LX + 16} y={s.y + 39}>{s.s}</text>
          {i < STEPS.length - 1 && (
            <Arrow x1={LX + 40} y1={s.y + LH + 2} x2={LX + 40} y2={s.y + 68} />
          )}
        </g>
      ))}

      <Arrow x1={LX + LW + 4} y1={200} x2={RX - 4} y2={178} />
      <Arrow x1={LX + LW + 4} y1={224} x2={RX - 4} y2={272} />

      <rect x={RX} y={150} width={RW} height={62} rx="8"
            fill="var(--d-fill-2)" stroke="var(--d-box-line)" />
      <text className="d-title" x={RX + 16} y={174}>Server agrees</text>
      <text className="d-small" x={RX + 16} y={191}>
        Invalidate the query so the real value replaces your guess.
      </text>
      <text className="d-small" x={RX + 16} y={204}>
        Usually nothing visible changes. That is the point.
      </text>

      <rect x={RX} y={244} width={RW} height={62} rx="8"
            fill="var(--d-fill-3)" stroke="var(--d-box-line)" />
      <text className="d-title" x={RX + 16} y={268}>Server refuses</text>
      <text className="d-small" x={RX + 16} y={285}>
        Restore the step-1 snapshot and say so plainly.
      </text>
      <text className="d-small" x={RX + 16} y={298}>
        This is the branch nobody tests, and the only reason step 1 exists.
      </text>
    </svg>
  );
}
