import { Link } from "react-router-dom";
import { PHASES, phasePath } from "../phases.js";

/* ------------------------------------------------------------------
   Phase page shell, owns the accent colour for everything inside.
   ------------------------------------------------------------------ */
export function Phase({ n, children }) {
  const p = PHASES[n - 1];
  const style = { "--phase": `var(--p${n})`, "--phase-soft": `var(--p${n}-soft)` };
  return (
    <article className="page" style={style}>
      <Rail current={n} />
      <div className="phase-head">
        <div className="phase-num">{n}</div>
        <div>
          <p className="eyebrow" style={{ color: "var(--phase)" }}>
            The method · phase {n} of 6
          </p>
          <h1>{p.name}</h1>
        </div>
      </div>
      <p className="phase-q">{p.q}</p>
      {children}
      <Pager n={n} />
    </article>
  );
}

function Rail({ current }) {
  return (
    <nav className="rail" aria-label="Method phases">
      {PHASES.map((p) => (
        <Link
          key={p.slug}
          to={phasePath(p.slug)}
          className={
            "rail-step " + (p.n === current ? "here" : p.n < current ? "done" : "")
          }
          style={p.n === current ? undefined : { "--phase": `var(--p${p.n})` }}
        >
          <span className="n">0{p.n}</span>
          <span className="t">{p.short}</span>
        </Link>
      ))}
    </nav>
  );
}

function Pager({ n }) {
  const prev = PHASES[n - 2];
  const next = PHASES[n];
  return (
    <div className="pager">
      {prev ? (
        <Link to={phasePath(prev.slug)}>
          <span className="dir">← previous</span>
          <span className="lbl">{prev.n}. {prev.name}</span>
        </Link>
      ) : (
        <Link to="/">
          <span className="dir">← back</span>
          <span className="lbl">Overview</span>
        </Link>
      )}
      {next ? (
        <Link to={phasePath(next.slug)} className="next">
          <span className="dir">next →</span>
          <span className="lbl">{next.n}. {next.name}</span>
        </Link>
      ) : (
        <Link to="/cheatsheet" className="next">
          <span className="dir">next →</span>
          <span className="lbl">Cheatsheet</span>
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Phase building blocks
   ------------------------------------------------------------------ */

/* What you must already have, and what you leave holding. */
export function InOut({ inputs, outputs }) {
  return (
    <div className="inout">
      <div className="inout-box">
        <h5>You arrive with</h5>
        <ul>{inputs.map((i) => <li key={i}>{i}</li>)}</ul>
      </div>
      <div className="inout-arrow" aria-hidden="true">→</div>
      <div className="inout-box">
        <h5>You leave with</h5>
        <ul>{outputs.map((o) => <li key={o}>{o}</li>)}</ul>
      </div>
    </div>
  );
}

/* One decision, its options, and which one is the default. */
export function Decision({ id, title, children, options }) {
  return (
    <section className="decision">
      <span className="decision-tag">Decision {id}</span>
      <h3>{title}</h3>
      {children}
      {options && (
        <div className="opts">
          {options.map((o) => (
            <div className={"opt" + (o.pick ? " pick" : "")} key={o.k}>
              <div className="opt-k">{o.k}</div>
              <div>{o.v}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* The running example. Same component on every phase, so the thread
   is visually traceable from phase 1 to phase 6. */
export function Eg({ title = "Ledgerline", children }) {
  return (
    <div className="eg">
      <span className="eg-tag">{title}</span>
      {children}
    </div>
  );
}

/* Renders a code sample and greys anything after `//` on each line.
   Deliberately not a syntax highlighter, comments carry the teaching. */
export function Code({ children }) {
  const lines = String(children).split("\n");
  return (
    <pre className="code">
      {lines.map((line, i) => {
        const at = line.indexOf("//");
        const nl = i < lines.length - 1 ? "\n" : "";
        return at === -1 ? (
          <span key={i}>{line}{nl}</span>
        ) : (
          <span key={i}>
            {line.slice(0, at)}
            <span className="c">{line.slice(at)}</span>
            {nl}
          </span>
        );
      })}
    </pre>
  );
}

export function Traps({ items }) {
  return (
    <div className="traps">
      {items.map((t, i) => (
        <div className="trap" key={i}>
          <span className="trap-x" aria-hidden="true">✕</span>
          <span>{t}</span>
        </div>
      ))}
    </div>
  );
}

export function Artifact({ title = "What you now hold", items }) {
  return (
    <div className="artifact">
      <h4>{title}</h4>
      <ul>{items.map((i, k) => <li key={k}>{i}</li>)}</ul>
    </div>
  );
}
