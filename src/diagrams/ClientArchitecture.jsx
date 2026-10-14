import { Defs, Arrow } from "./svg.jsx";

/* The modern replacement for the MVC picture. The load-bearing idea is the
   middle row: server state and client state are different materials. */
const BX = 32, BW = 516;

const NOTES = [
  { y: 77,  lines: ["The view is deliberately dumb. It renders what it is", "given and raises events. Swap the data layer and", "not one component changes."] },
  { y: 172, lines: ["This split is the one MVC never made, and it is where", "most \"state management is hard\" pain comes from.", "Different materials, different tools."] },
  { y: 287, lines: ["One choke point. Auth header, retry policy, error", "shape and trace ID are written once and apply to", "every call in the app."] },
];

export default function ClientArchitecture() {
  return (
    <svg viewBox="0 0 886 424" width="886" role="img"
         aria-label="Layers of a modern frontend: components, server state and client state, transport layer, network">
      <Defs />

      {/* browser boundary */}
      <rect x={14} y={30} width={552} height={300} rx="12"
            fill="none" stroke="var(--d-box-line)" strokeDasharray="5 4" />
      <text className="d-mono" x={22} y={24}>the browser</text>

      {/* 1 — view */}
      <rect x={BX} y={50} width={BW} height={54} rx="8"
            fill="var(--d-fill-1)" stroke="var(--d-box-line)" />
      <text className="d-title" x={BX + BW / 2} y={72} textAnchor="middle">Components</text>
      <text className="d-small" x={BX + BW / 2} y={89} textAnchor="middle">
        layout, markup, events — no fetching, no business rules
      </text>

      {/* 2 — the two kinds of state */}
      <Arrow x1={140} y1={106} x2={140} y2={138} />
      <text className="d-mono" x={148} y={126}>events</text>
      <Arrow x1={450} y1={138} x2={450} y2={106} />
      <text className="d-mono" x={388} y={126}>data</text>

      <rect x={BX} y={140} width={250} height={84} rx="8"
            fill="var(--d-fill-2)" stroke="var(--d-box-line)" />
      <text className="d-title" x={BX + 125} y={163} textAnchor="middle">Server state</text>
      <text className="d-small" x={BX + 125} y={181} textAnchor="middle">
        a borrowed copy of data
      </text>
      <text className="d-small" x={BX + 125} y={193} textAnchor="middle">
        you do not own
      </text>
      <text className="d-mono" x={BX + 125} y={213} textAnchor="middle">
        TanStack Query · RSC
      </text>

      <rect x={298} y={140} width={250} height={84} rx="8"
            fill="var(--d-fill-3)" stroke="var(--d-box-line)" />
      <text className="d-title" x={423} y={163} textAnchor="middle">Client state</text>
      <text className="d-small" x={423} y={181} textAnchor="middle">
        yours alone — nobody
      </text>
      <text className="d-small" x={423} y={193} textAnchor="middle">
        else has a copy
      </text>
      <text className="d-mono" x={423} y={213} textAnchor="middle">
        useState · Zustand · XState
      </text>

      {/* only server state talks to the network */}
      <Arrow x1={157} y1={226} x2={157} y2={256} />
      <text className="d-mono" x={330} y={245} textAnchor="middle"
            style={{ fill: "var(--d-text)" }}>
        client state never touches the network
      </text>

      {/* 3 — transport */}
      <rect x={BX} y={258} width={BW} height={58} rx="8"
            fill="var(--d-fill-4)" stroke="var(--d-box-line)" />
      <text className="d-title" x={BX + BW / 2} y={281} textAnchor="middle">Transport layer</text>
      <text className="d-small" x={BX + BW / 2} y={299} textAnchor="middle">
        fetch wrapper · GraphQL client · WebSocket client
      </text>

      {/* 4 — network */}
      <Arrow x1={290} y1={332} x2={290} y2={350} />
      <rect x={BX} y={352} width={BW} height={46} rx="8"
            fill="var(--d-box)" stroke="var(--d-box-line)" />
      <text className="d-title" x={BX + BW / 2} y={379} textAnchor="middle">
        Network → API, GraphQL, or socket
      </text>

      {/* right-hand annotations */}
      {NOTES.map((n) => (
        <g key={n.y}>
          <line x1={585} y1={n.y - 14} x2={585} y2={n.y + n.lines.length * 13 - 4}
                stroke="var(--d-box-line)" strokeWidth="2" />
          {n.lines.map((ln, k) => (
            <text className="d-small" key={ln} x={597} y={n.y + k * 13}>{ln}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}
