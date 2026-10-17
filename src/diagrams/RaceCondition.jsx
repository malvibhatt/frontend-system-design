import { Defs } from "./svg.jsx";

/* The bug that makes a typeahead show results for a query the user has
   already finished typing, and the one-line fix. */
const PW = 425, PH = 196, GAP = 20;
const px = (i) => 20 + i * (PW + GAP);
const T0 = 58, TW = 340, CY = 76, SY = 142;

function Panel({ i, title, events, note, bad }) {
  const X = px(i), Y = 40;
  const tx = (t) => X + T0 + t * TW;
  return (
    <g>
      <rect x={X} y={Y} width={PW} height={PH} rx="8"
            fill="var(--d-box)" stroke="var(--d-box-line)" />
      <text className="d-title" x={X + 14} y={Y + 23}>{title}</text>

      {[["user", CY], ["server", SY]].map(([l, ly]) => (
        <g key={l}>
          <text className="d-mono" x={X + 12} y={Y + ly + 4}>{l}</text>
          <line x1={X + T0 - 4} y1={Y + ly} x2={X + T0 + TW + 10} y2={Y + ly}
                stroke="var(--d-box-line)" strokeWidth="1.5" />
        </g>
      ))}

      {events.map((e, k) => {
        const down = e.dir === "d";
        const from = down ? Y + CY : Y + SY;
        const to = down ? Y + SY : Y + CY;
        const col = e.wrong ? "var(--bad)" : "var(--d-line)";
        return (
          <g key={k}>
            <line x1={tx(e.t)} y1={from + (down ? 3 : -3)}
                  x2={tx(e.t) + 22} y2={to + (down ? -3 : 3)}
                  stroke={col} strokeWidth={e.wrong ? 2 : 1.3}
                  strokeDasharray={e.ignored ? "4 3" : undefined}
                  markerEnd={e.ignored ? undefined : "url(#arw)"} />
            <text className="d-mono" x={tx(e.t) - 2}
                  y={down ? Y + CY - 9 : Y + SY + 18}
                  style={{ fill: e.wrong ? "var(--bad)" : "var(--d-text-dim)" }}>{e.l}</text>
          </g>
        );
      })}

      <text className="d-small" x={X + 14} y={Y + PH - 14}
            style={{ fill: bad ? "var(--bad)" : "var(--good)" }}>{note}</text>
    </g>
  );
}

export default function RaceCondition() {
  return (
    <svg viewBox="0 0 890 262" width="890" role="img"
         aria-label="A typeahead race condition where a stale response overwrites a newer one, and the fixed version">
      <Defs />
      <text className="d-small" x={20} y={26}>
        The user types &ldquo;re&rdquo;, then &ldquo;rea&rdquo;. The first request happens to be slower.
      </text>

      <Panel i={0} title="Without cancellation" bad
        events={[
          { t: 0.03, dir: "d", l: "“re”" },
          { t: 0.22, dir: "d", l: "“rea”" },
          { t: 0.50, dir: "u", l: "results: rea" },
          { t: 0.80, dir: "u", l: "results: re", wrong: true },
        ]}
        note="The older, slower response lands last and wins. The box now shows results for “re”."
      />

      <Panel i={1} title="With cancellation"
        events={[
          { t: 0.03, dir: "d", l: "“re”" },
          { t: 0.22, dir: "d", l: "“rea” + abort" },
          { t: 0.50, dir: "u", l: "results: rea" },
          { t: 0.80, dir: "u", l: "discarded", ignored: true },
        ]}
        note="AbortController cancels the old request; any late reply is discarded by sequence."
      />
    </svg>
  );
}
