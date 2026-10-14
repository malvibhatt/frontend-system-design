import { Defs } from "./svg.jsx";

/* Why GraphQL exists, in one picture: the same screen needs three fields. */
const PW = 272, GAP = 20, Y = 46, H = 212;
const px = (i) => 20 + i * (PW + GAP);

const NEEDED = ["name", "avatarUrl", "postCount"];

const PANELS = [
  {
    tone: 1, name: "REST", sub: "GET /users/42",
    fields: ["id", "name", "email", "avatarUrl", "bio", "createdAt", "timezone",
             "postCount", "settings {…}", "billing {…}"],
    foot: "One round trip, 10× the bytes.",
  },
  {
    tone: 3, name: "REST, under-fetching", sub: "GET /users/42 → /users/42/posts",
    fields: ["id", "name", "email", "avatarUrl", "…", "then a second request", "for postCount"],
    foot: "Two round trips in sequence — a waterfall.",
  },
  {
    tone: 2, name: "GraphQL", sub: "one query, three fields",
    fields: ["name", "avatarUrl", "postCount"],
    foot: "One round trip, exactly what the screen renders.",
  },
];

export default function OverFetch() {
  return (
    <svg viewBox="0 0 896 300" width="896" role="img"
         aria-label="Comparing over-fetching in REST, under-fetching waterfalls, and a precise GraphQL query">
      <Defs />
      <text className="d-small" x={20} y={28}>
        The screen needs three fields: <tspan style={{ fill: "var(--d-text)" }}>name, avatarUrl, postCount</tspan>
      </text>

      {PANELS.map((p, i) => (
        <g key={p.name}>
          <rect x={px(i)} y={Y} width={PW} height={H} rx="8"
                fill={`var(--d-fill-${p.tone})`} stroke="var(--d-box-line)" />
          <text className="d-title" x={px(i) + 14} y={Y + 23}>{p.name}</text>
          <text className="d-mono" x={px(i) + 14} y={Y + 39}>{p.sub}</text>

          {p.fields.map((f, k) => {
            const used = NEEDED.includes(f);
            return (
              <g key={f + k}>
                <rect x={px(i) + 14} y={Y + 50 + k * 15} width={PW - 28} height={13} rx="3"
                      fill={used ? "var(--d-box)" : "none"}
                      stroke={used ? "var(--d-box-line)" : "none"} />
                <text className="d-mono" x={px(i) + 20} y={Y + 60 + k * 15}
                      style={{ fill: used ? "var(--d-text)" : "var(--d-text-dim)" }}>
                  {used ? f : `${f}`}
                </text>
              </g>
            );
          })}

          <text className="d-small" x={px(i) + 14} y={Y + H - 12}
                style={{ fill: "var(--d-text)" }}>{p.foot}</text>
        </g>
      ))}

      <text className="d-small" x={20} y={288}>
        Boxed fields are the ones actually rendered. Everything else was paid for and thrown away.
      </text>
    </svg>
  );
}
