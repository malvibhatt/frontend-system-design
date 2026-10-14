/* Small presentational primitives shared by every page. */

export function Page({ eyebrow, title, lede, children }) {
  return (
    <article className="page">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </article>
  );
}

/* Wraps a diagram: scrolls sideways on narrow screens instead of
   squashing, and carries a caption that says what to look at. */
export function Figure({ caption, children }) {
  return (
    <figure className="figure">
      <div className="figure-scroll">{children}</div>
      {caption && <figcaption className="figure-cap">{caption}</figcaption>}
    </figure>
  );
}

export function Callout({ kind = "why", title, children }) {
  return (
    <div className={`callout ${kind}`}>
      {title && <span className="callout-tag">{title}</span>}
      {children}
    </div>
  );
}

/* `strongFirst` emphasises the first cell of each row, so callers can pass
   plain strings instead of JSX and keep the data readable. */
export function Table({ head, rows, strongFirst }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{strongFirst && j === 0 ? <b>{cell}</b> : cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Placeholder({ step }) {
  return <div className="placeholder">Written in step {step} of the build.</div>;
}

/* ---- Cheatsheet primitives ------------------------------------------- */

export function Sheet({ children }) {
  return <div className="sheet">{children}</div>;
}

export function SheetCard({ title, kind = "", items, children }) {
  return (
    <section className={`sheet-card ${kind}`}>
      <h4>{title}</h4>
      {items ? <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul> : children}
    </section>
  );
}

export function Numbers({ items }) {
  return (
    <div className="nums">
      {items.map((n) => (
        <div className="num" key={n.label}>
          <div className="num-v">{n.value}</div>
          <div className="num-l">{n.label}</div>
        </div>
      ))}
    </div>
  );
}

export function Steps({ items }) {
  return <ol className="steps">{items.map((it, i) => <li key={i}>{it}</li>)}</ol>;
}
