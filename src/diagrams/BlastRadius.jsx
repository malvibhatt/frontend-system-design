import { Defs } from "./svg.jsx";

/* Component boundaries are a decision about blast radius: when this
   changes, what has to re-render with it? */
const PW = 420, GAP = 20, PY = 50, PH = 230;
const px = (i) => 20 + i * (PW + GAP);

const RAW = [
  { k: "Toolbar",      h: 26, note: "save, send, status" },
  { k: "ClientPicker", h: 26, note: "rarely changes" },
  { k: "LineItems",    h: 60, note: "the user is typing here" },
  { k: "Totals",       h: 26, note: "derived from line items" },
  { k: "ActivityLog",  h: 26, note: "fetched separately" },
];

/* Stack them once, at module level, so nothing is mutated mid-render. */
const NODES = RAW.reduce((acc, n, i) => {
  acc.push({ ...n, y: i === 0 ? PY + 56 : acc[i - 1].y + acc[i - 1].h + 7 });
  return acc;
}, []);

function Panel({ i, title, hot, verdict, bad }) {
  const X = px(i);
  return (
    <g>
      <rect x={X} y={PY} width={PW} height={PH} rx="9"
            fill="var(--d-box)" stroke="var(--d-box-line)" />
      <text className="d-title" x={X + 14} y={PY + 23}>{title}</text>
      <text className="d-small" x={X + 14} y={PY + 40}>InvoiceEditor</text>

      {NODES.map((n) => {
        const on = hot.includes(n.k);
        const y = n.y;
        return (
          <g key={n.k}>
            <rect x={X + 24} y={y} width={PW - 48} height={n.h} rx="5"
                  fill={on ? "var(--d-fill-3)" : "var(--d-lane)"}
                  stroke={on ? "var(--d-line)" : "var(--d-box-line)"}
                  strokeWidth={on ? 1.5 : 1} />
            <text className="d-mono" x={X + 36} y={y + 17}
                  style={{ fill: "var(--d-text)" }}>{n.k}</text>
            <text className="d-small" x={X + 160} y={y + 17}>{n.note}</text>
            {on && (
              <text className="d-mono" x={X + PW - 36} y={y + 17} textAnchor="end"
                    style={{ fill: "var(--d-text)" }}>re-renders</text>
            )}
          </g>
        );
      })}

      <text className="d-small" x={X + 14} y={PY + PH - 10}
            style={{ fill: bad ? "var(--bad)" : "var(--good)" }}>{verdict}</text>
    </g>
  );
}

export default function BlastRadius() {
  return (
    <svg viewBox="0 0 890 300" width="890" role="img"
         aria-label="Comparing re-render blast radius when draft state is held at the top versus pushed down">
      <Defs />
      <text className="d-small" x={20} y={28}>
        The user types one character into a line item. What re-renders?
      </text>

      <Panel i={0} bad
        title="Draft state held at the top"
        hot={["Toolbar", "ClientPicker", "LineItems", "Totals", "ActivityLog"]}
        verdict="Everything. On every keystroke, including a list you fetched separately."
      />
      <Panel i={1}
        title="Draft state pushed down"
        hot={["LineItems", "Totals"]}
        verdict="Only what genuinely depends on the change."
      />
    </svg>
  );
}
