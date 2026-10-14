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

export function Table({ head, rows }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Placeholder({ step }) {
  return <div className="placeholder">Written in step {step} of the build.</div>;
}
