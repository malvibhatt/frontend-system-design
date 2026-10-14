import { Defs } from "./svg.jsx";

/* A live connection will drop. The design question is not whether, but what
   the user sees during the gap and what happens to the events you missed. */
const X0 = 20, TW = 840, BY = 96, BH = 28;
const tx = (t) => X0 + t * TW;

const DROP = 0.34, RETRY = 0.52, BACK = 0.60;

export default function Reconnect() {
  return (
    <svg viewBox="0 0 880 268" width="880" role="img"
         aria-label="Timeline of a dropped live connection, automatic retry, and backfill of missed events">
      <Defs />
      <text className="d-small" x={X0} y={26}>A connection drop, start to finish</text>

      {/* events arriving */}
      {[0.03, 0.10, 0.17, 0.24, 0.30].map((t) => (
        <line key={t} x1={tx(t)} y1={44} x2={tx(t)} y2={62}
              stroke="var(--d-line)" strokeWidth="1.5" />
      ))}
      {[0.38, 0.44, 0.50, 0.56].map((t) => (
        <line key={t} x1={tx(t)} y1={44} x2={tx(t)} y2={62}
              stroke="var(--d-line)" strokeWidth="1.5" strokeDasharray="3 3" />
      ))}
      {[0.66, 0.74, 0.82, 0.90, 0.97].map((t) => (
        <line key={t} x1={tx(t)} y1={44} x2={tx(t)} y2={62}
              stroke="var(--d-line)" strokeWidth="1.5" />
      ))}
      <text className="d-mono" x={tx(0.38)} y={38}>events still happening, unseen</text>

      {/* connection state */}
      <rect x={tx(0)} y={BY} width={tx(DROP) - tx(0)} height={BH} rx="4"
            fill="var(--d-fill-2)" stroke="var(--d-box-line)" />
      <text className="d-label" x={(tx(0) + tx(DROP)) / 2} y={BY + 19} textAnchor="middle">
        connected
      </text>

      <rect x={tx(DROP)} y={BY} width={tx(BACK) - tx(DROP)} height={BH} rx="4"
            fill="var(--d-fill-3)" stroke="var(--d-box-line)" strokeDasharray="4 3" />
      <text className="d-label" x={(tx(DROP) + tx(BACK)) / 2} y={BY + 19} textAnchor="middle">
        disconnected
      </text>

      <rect x={tx(BACK)} y={BY} width={tx(1) - tx(BACK)} height={BH} rx="4"
            fill="var(--d-fill-2)" stroke="var(--d-box-line)" />
      <text className="d-label" x={(tx(BACK) + tx(1)) / 2} y={BY + 19} textAnchor="middle">
        connected
      </text>

      {[
        { t: DROP,  l: "network drops", row: 0 },
        { t: RETRY, l: "EventSource retries, with backoff", row: 1 },
        { t: BACK,  l: "reconnect sends Last-Event-ID: 8842", row: 0 },
      ].map((m) => (
        <g key={m.l}>
          <line x1={tx(m.t)} y1={BY + BH} x2={tx(m.t)} y2={BY + 46 + m.row * 15}
                stroke="var(--d-line)" strokeDasharray="3 3" />
          <text className="d-mono" x={tx(m.t) + 5} y={BY + 50 + m.row * 15}
                style={{ fill: "var(--d-text)" }}>{m.l}</text>
        </g>
      ))}

      <rect x={tx(BACK)} y={BY + 84} width={tx(0.78) - tx(BACK)} height={26} rx="4"
            fill="var(--d-fill-4)" stroke="var(--d-box-line)" />
      <text className="d-small" x={tx(BACK) + 10} y={BY + 101}>server replays 8843–8871</text>

      <text className="d-small" x={X0} y={244}>
        What the user must see during the amber stretch: a &ldquo;reconnecting, data may be out of
        date&rdquo; banner — not a frozen map that looks live.
      </text>
    </svg>
  );
}
