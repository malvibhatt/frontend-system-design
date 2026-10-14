import { Defs } from "./svg.jsx";

/* The same <Select> built three ways. Read it as an escalation:
   each panel buys flexibility and costs the consumer more work. */
const PW = 280, GAP = 15, Y = 44, H = 196;
const px = (i) => 20 + i * (PW + GAP);

const PANELS = [
  {
    tone: 1,
    name: "Config props",
    code: ["<Select", "  options={opts}", "  renderOption={fn}", "  labelKey=\"name\"", "  onSearch={fn}", "  ...11 more", "/>"],
    when: "Fine while the prop list is short.",
    cost: "Every new variation adds a prop.",
  },
  {
    tone: 2,
    name: "Compound components",
    code: ["<Select>", "  <Select.Trigger />", "  <Select.List>", "    <Option v=\"a\">A</Option>", "  </Select.List>", "</Select>"],
    when: "Parts are coupled but layout varies.",
    cost: "Shared state hides in context.",
  },
  {
    tone: 3,
    name: "Headless hook",
    code: ["const s = useSelect(opts)", "", "return (", "  <div {...s.menuProps}>", "    /* your markup */", "  </div>", ")"],
    when: "One behaviour, many skins.",
    cost: "Consumer writes all markup + a11y risk.",
  },
];

export default function Composition() {
  return (
    <svg viewBox="0 0 880 300" width="880" role="img"
         aria-label="Three ways to build a Select component: config props, compound components, headless hook">
      <Defs />

      <text className="d-small" x={20} y={26}>
        More flexible →&nbsp;&nbsp;&nbsp;more work for whoever uses it →
      </text>

      {PANELS.map((p, i) => (
        <g key={p.name}>
          <rect x={px(i)} y={Y} width={PW} height={H} rx="8"
                fill={`var(--d-fill-${p.tone})`} stroke="var(--d-box-line)" />
          <text className="d-title" x={px(i) + 14} y={Y + 24}>{p.name}</text>

          <rect x={px(i) + 12} y={Y + 36} width={PW - 24} height={p.code.length * 15 + 16}
                rx="6" fill="var(--d-box)" stroke="var(--d-box-line)" />
          {p.code.map((ln, k) => (
            <text className="d-mono" key={k} x={px(i) + 24} y={Y + 56 + k * 15}
                  style={{ fill: "var(--d-text)" }}>{ln}</text>
          ))}

          <text className="d-small" x={px(i) + 14} y={Y + H - 26}
                style={{ fill: "var(--d-text)" }}>{p.when}</text>
          <text className="d-small" x={px(i) + 14} y={Y + H - 11}>{p.cost}</text>
        </g>
      ))}

      <text className="d-small" x={20} y={268}>
        Start at the left. Move right only when a real second use case arrives — not in anticipation of one.
      </text>
    </svg>
  );
}
