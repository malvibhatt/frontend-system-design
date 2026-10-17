import { Defs, Arrow } from "./svg.jsx";

/* Vertical execution order of a plain Vite + React app.
   Geometry: rows of 52 starting at y=56, 12px apart. */
const X = 20, W = 480, H = 52, STEP = 64, Y0 = 56;
const row = (i) => Y0 + i * STEP;

const STEPS = [
  {
    file: "index.html",
    tone: 0,
    lines: ["Browser receives an almost empty shell: <div id=\"root\"></div>",
            "plus one <script type=\"module\" src=\"/src/main.jsx\">."],
  },
  {
    file: "the whole import graph",
    tone: 3,
    lines: ["main.jsx → App.jsx → routes.jsx → every page it names, plus index.css.",
            "All of it is evaluated before one line of your own code runs."],
  },
  {
    file: "main.jsx  (body)",
    tone: 1,
    lines: ["createRoot(document.getElementById(\"root\")).render(<App />)",
            "React now owns that DOM node."],
  },
  {
    file: "App.jsx",
    tone: 1,
    lines: ["Router reads the URL and decides which single route matches."],
  },
  {
    file: "Sidebar.jsx  ·  Overview.jsx",
    tone: 1,
    lines: ["Components run and return JSX. This is a description of a UI, ",
            "nothing is in the DOM yet."],
  },
  {
    file: "React commits",
    tone: 2,
    lines: ["React turns that description into real DOM nodes.",
            "This is the first moment the user sees anything."],
  },
  {
    file: "useEffect  /  data fetching",
    tone: 3,
    lines: ["Effects run after the commit, so your first network request",
            "leaves the browser after the first paint, not before it."],
  },
  {
    file: "response → setState → re-render",
    tone: 2,
    lines: ["Data arrives, state updates, React re-renders and commits again."],
  },
];

/* right-hand screen-state rail */
const RX = 528, RW = 160;
const BANDS = [
  { from: row(0), to: row(5), fill: "var(--d-lane)",   lines: ["Blank screen"] },
  { from: row(5), to: row(7), fill: "var(--d-fill-3)", lines: ["Shell painted,", "data still loading"] },
  { from: row(7), to: row(7) + H, fill: "var(--d-fill-2)", lines: ["Real content"] },
];

export default function BootSequence() {
  return (
    <svg viewBox="0 0 710 596" width="710" role="img"
         aria-label="Execution order of files in a Vite React app, from index.html to the first data render">
      <Defs />

      <text className="d-small" x={X} y={34}>Execution order</text>
      <text className="d-small" x={RX} y={34}>What the user sees</text>

      {STEPS.map((s, i) => {
        const y = row(i);
        const fill = s.tone === 0 ? "var(--d-box)" : `var(--d-fill-${s.tone})`;
        return (
          <g key={s.file}>
            <rect x={X} y={y} width={W} height={H} rx="8"
                  fill={fill} stroke="var(--d-box-line)" />
            <circle cx={X + 22} cy={y + H / 2} r="11"
                    fill="var(--d-box)" stroke="var(--d-box-line)" />
            <text className="d-mono" x={X + 22} y={y + H / 2 + 4} textAnchor="middle">
              {i + 1}
            </text>
            <text className="d-title" x={X + 44} y={y + 20}
                  style={{ fontFamily: "var(--mono)", fontSize: 11.5 }}>
              {s.file}
            </text>
            {s.lines.map((ln, k) => (
              <text className="d-small" key={k} x={X + 44} y={y + 34 + k * 12}>{ln}</text>
            ))}
            {i < STEPS.length - 1 && (
              <Arrow x1={X + 22} y1={y + H + 2} x2={X + 22} y2={y + STEP - 2} />
            )}
          </g>
        );
      })}

      {BANDS.map((b) => (
        <g key={b.lines[0]}>
          <rect x={RX} y={b.from} width={RW} height={b.to - b.from} rx="6"
                fill={b.fill} stroke="var(--d-box-line)" />
          {b.lines.map((ln, k) => (
            <text className="d-label" key={ln} x={RX + RW / 2}
                  y={(b.from + b.to) / 2 + 4 - (b.lines.length - 1) * 7 + k * 14}
                  textAnchor="middle">{ln}</text>
          ))}
        </g>
      ))}
    </svg>
  );
}
