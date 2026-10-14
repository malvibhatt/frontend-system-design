/* Shared SVG bits: one arrowhead definition, reused by every diagram. */

export function Defs() {
  return (
    <defs>
      <marker id="arw" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--d-line)" />
      </marker>
    </defs>
  );
}

/* A labelled rounded box. `tone` picks one of the four palette fills. */
export function Box({ x, y, w, h, tone = 0, title, sub, note }) {
  const fill = tone === 0 ? "var(--d-box)" : `var(--d-fill-${tone})`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8"
            fill={fill} stroke="var(--d-box-line)" strokeWidth="1" />
      <text className="d-title" x={x + w / 2} y={y + (sub ? 24 : h / 2 + 4)} textAnchor="middle">
        {title}
      </text>
      {sub && (
        <text className="d-small" x={x + w / 2} y={y + 41} textAnchor="middle">{sub}</text>
      )}
      {note && (
        <text className="d-mono" x={x + w / 2} y={y + h - 9} textAnchor="middle">{note}</text>
      )}
    </g>
  );
}

export function Arrow({ x1, y1, x2, y2, dashed }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--d-line)" strokeWidth="1.3"
          strokeDasharray={dashed ? "4 3" : undefined}
          markerEnd="url(#arw)" />
  );
}
