import { Defs } from "./svg.jsx";

/* One product, two audiences, two rendering strategies. The split is the
   point. It comes straight out of phase 1. */
const X = 20, W = 840, RH = 30;

const ZONES = [
  {
    label: "Public: no login, any device, any network",
    tone: 2, y: 54,
    rows: [
      { path: "/", mode: "SSG", note: "marketing page, same for everyone, rebuild on change" },
      { path: "/pay/:token", mode: "SSR", note: "the invoice a client opens. Must render without JS." },
    ],
  },
  {
    label: "Behind login: known users, known devices",
    tone: 1, y: 186,
    rows: [
      { path: "/app/invoices?status=&client=&page=", mode: "CSR", note: "list, filters live in the URL" },
      { path: "/app/invoices/:id", mode: "CSR", note: "editor, long-lived, stateful, no SEO" },
      { path: "/app/clients", mode: "CSR", note: "list + detail" },
      { path: "/app/settings/*", mode: "CSR", note: "rarely visited, lazy-loaded" },
    ],
  },
];

export default function RouteMap() {
  return (
    <svg viewBox="0 0 890 390" width="890" role="img"
         aria-label="Route map split into public server-rendered routes and authenticated client-rendered routes">
      <Defs />
      <text className="d-small" x={X} y={28}>
        Every screen is a URL. Write the URLs before you write a component.
      </text>

      {ZONES.map((z) => {
        const h = 34 + z.rows.length * (RH + 6);
        return (
          <g key={z.label}>
            <rect x={X} y={z.y} width={W} height={h} rx="10"
                  fill={`var(--d-fill-${z.tone})`} stroke="var(--d-box-line)" />
            <text className="d-mono" x={X + 14} y={z.y + 21}
                  style={{ fill: "var(--d-text)" }}>{z.label}</text>

            {z.rows.map((r, i) => {
              const ry = z.y + 30 + i * (RH + 6);
              return (
                <g key={r.path}>
                  <rect x={X + 12} y={ry} width={W - 24} height={RH} rx="6"
                        fill="var(--d-box)" stroke="var(--d-box-line)" />
                  <text className="d-mono" x={X + 24} y={ry + 19}
                        style={{ fill: "var(--d-text)" }}>{r.path}</text>
                  <rect x={X + 360} y={ry + 6} width={42} height={18} rx="4"
                        fill={`var(--d-fill-${z.tone})`} stroke="var(--d-box-line)" />
                  <text className="d-mono" x={X + 381} y={ry + 19} textAnchor="middle"
                        style={{ fill: "var(--d-text)" }}>{r.mode}</text>
                  <text className="d-small" x={X + 416} y={ry + 19}>{r.note}</text>
                </g>
              );
            })}
          </g>
        );
      })}

      <text className="d-small" x={X} y={378}>
        The rendering strategy is not an app-wide choice. It is a per-route answer to
        “who opens this, and what do they need before JavaScript arrives?”
      </text>
    </svg>
  );
}
