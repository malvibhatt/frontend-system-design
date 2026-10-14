import { Defs } from "./svg.jsx";

/* Four transports drawn as what they actually are: a pattern of arrows
   over time between two parties. Time flows left to right in each panel. */
const PW = 420, PH = 186, GAPX = 16, GAPY = 20;
const COL = (i) => 20 + (i % 2) * (PW + GAPX);
const ROW = (i) => 44 + Math.floor(i / 2) * (PH + GAPY);

const T0 = 62, TW = 338;          // time axis inside a panel
const CY = 74, SY = 142;          // client lane, server lane (relative)

const PANELS = [
  {
    name: "Polling", tone: 1,
    sub: "ask again every N seconds",
    events: [
      { t: 0.02, dir: "d", l: "GET" }, { t: 0.10, dir: "u", l: "nothing" },
      { t: 0.33, dir: "d", l: "GET" }, { t: 0.41, dir: "u", l: "nothing" },
      { t: 0.64, dir: "d", l: "GET" }, { t: 0.72, dir: "u", l: "data!" },
      { t: 0.95, dir: "d", l: "GET" },
    ],
    note: "Three of four round trips carried no news. Latency = up to one interval.",
  },
  {
    name: "Long polling", tone: 1,
    sub: "ask, and the server waits to answer",
    events: [
      { t: 0.02, dir: "d", l: "GET" },
      { t: 0.60, dir: "u", l: "data!" },
      { t: 0.68, dir: "d", l: "GET" },
    ],
    holds: [[0.10, 0.60], [0.76, 1.0]],
    note: "No wasted trips, near-instant delivery — but a held connection per client.",
  },
  {
    name: "Server-sent events", tone: 2,
    sub: "one request, many responses",
    events: [
      { t: 0.02, dir: "d", l: "GET /stream" },
      { t: 0.20, dir: "u", l: "event" }, { t: 0.42, dir: "u", l: "event" },
      { t: 0.64, dir: "u", l: "event" }, { t: 0.86, dir: "u", l: "event" },
    ],
    note: "Plain HTTP, auto-reconnects, text only. Server talks; client cannot reply here.",
  },
  {
    name: "WebSocket", tone: 3,
    sub: "one socket, both directions",
    events: [
      { t: 0.02, dir: "d", l: "upgrade" }, { t: 0.13, dir: "u", l: "101" },
      { t: 0.33, dir: "u", l: "event" }, { t: 0.50, dir: "d", l: "send" },
      { t: 0.68, dir: "u", l: "event" }, { t: 0.86, dir: "d", l: "send" },
    ],
    note: "Either side can speak at any moment. You now own reconnect and backpressure.",
  },
];

function Panel({ p, i }) {
  const X = COL(i), Y = ROW(i);
  const tx = (t) => X + T0 + t * TW;

  return (
    <g>
      <rect x={X} y={Y} width={PW} height={PH} rx="8"
            fill="var(--d-box)" stroke="var(--d-box-line)" />
      <text className="d-title" x={X + 14} y={Y + 23}>{p.name}</text>
      <text className="d-small" x={X + 14} y={Y + 39}>{p.sub}</text>

      {/* lanes */}
      {[["client", CY], ["server", SY]].map(([label, ly]) => (
        <g key={label}>
          <text className="d-mono" x={X + 12} y={Y + ly + 4}>{label}</text>
          <line x1={X + T0 - 6} y1={Y + ly} x2={X + T0 + TW + 8} y2={Y + ly}
                stroke="var(--d-box-line)" strokeWidth="1.5" />
        </g>
      ))}

      {/* server holding the connection open */}
      {(p.holds || []).map(([a, b]) => (
        <rect key={a} x={tx(a)} y={Y + SY - 7} width={tx(b) - tx(a)} height={14} rx="4"
              fill={`var(--d-fill-${p.tone})`} stroke="var(--d-box-line)" />
      ))}

      {p.events.map((e, k) => {
        const from = e.dir === "d" ? Y + CY : Y + SY;
        const to = e.dir === "d" ? Y + SY : Y + CY;
        return (
          <g key={k}>
            <line x1={tx(e.t)} y1={from + (e.dir === "d" ? 3 : -3)}
                  x2={tx(e.t) + 16} y2={to + (e.dir === "d" ? -3 : 3)}
                  stroke="var(--d-line)" strokeWidth="1.3" markerEnd="url(#arw)" />
            <text className="d-mono" x={tx(e.t) - 2}
                  y={e.dir === "d" ? Y + CY - 9 : Y + SY + 18}>{e.l}</text>
          </g>
        );
      })}

      <text className="d-small" x={X + 14} y={Y + PH - 12}>{p.note}</text>
    </g>
  );
}

export default function TransportTimeline() {
  return (
    <svg viewBox="0 0 890 456" width="890" role="img"
         aria-label="Timelines comparing polling, long polling, server-sent events and WebSockets">
      <Defs />
      <text className="d-small" x={20} y={28}>
        Time runs left to right. Count the arrows: that is the cost.
      </text>
      {PANELS.map((p, i) => <Panel key={p.name} p={p} i={i} />)}
    </svg>
  );
}
