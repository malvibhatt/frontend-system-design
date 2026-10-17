import { Link } from "react-router-dom";
import { Figure, Callout, SheetCard } from "../components/Doc.jsx";
import { PHASES, phasePath } from "../phases.js";
import JourneyMap from "../diagrams/JourneyMap.jsx";
import PageLoad from "../diagrams/PageLoad.jsx";
import BootSequence from "../diagrams/BootSequence.jsx";
import RequestPath from "../diagrams/RequestPath.jsx";
import ClientArchitecture from "../diagrams/ClientArchitecture.jsx";

const OUT = ["numbers", "route map", "data model", "API + cache", "perf plan", "design doc"];

export default function Overview() {
  return (
    <article className="page">
      <header className="hero">
        <p className="eyebrow">Start here</p>
        <h1>Designing a frontend, one decision at a time</h1>
        <p className="lede">
          A repeatable method for turning a vague brief into a frontend design you can build,
          and defend. Six phases, each ending in something concrete you hand to the next.
        </p>
        <div className="start-row">
          <Link className="btn btn-primary" to="/method/frame">Start at phase 1 →</Link>
          <Link className="btn btn-ghost" to="/cheatsheet">I just need the cheatsheet</Link>
        </div>
      </header>

      <h2>The map</h2>
      <p>
        Read this left to right. It is the whole method, and the rest of this site is the detail
        underneath it.
      </p>

      <Figure caption={
        <>
          <b>The row of small boxes is the important part.</b> A phase is not finished when you
          have talked about it. It is finished when you can name the thing you are handing
          forward.
        </>
      }>
        <JourneyMap />
      </Figure>

      <div className="phase-grid">
        {PHASES.map((p, i) => (
          <Link
            className="phase-card"
            to={phasePath(p.slug)}
            key={p.slug}
            style={{ "--phase": `var(--p${p.n})` }}
          >
            <div className="pc-n">PHASE {p.n}</div>
            <div className="pc-t">{p.name}</div>
            <div className="pc-q">{p.q}</div>
            <div className="pc-out">→ {OUT[i]}</div>
          </Link>
        ))}
      </div>

      <h2>How to use this</h2>
      <div className="two-up">
        <SheetCard title="Designing something real">
          <p>
            Work the phases in order with your own project open beside you. Each one ends with an
            artifact, fill it in before moving on. By phase 6 you have a design document, built
            out of decisions you can each explain.
          </p>
          <p style={{ marginBottom: 0 }}>
            The phases stay thin on theory on purpose. When a decision needs more than a
            paragraph, it links into <b>Go deeper</b>, and you can come back.
          </p>
        </SheetCard>
        <SheetCard title="Preparing for an interview">
          <p>
            Same six phases. They map onto <b>RADIO</b>, the framework most frontend system
            design interviews are structured around: Requirements, Architecture, Data model,
            Interface, Optimisations.
          </p>
          <p style={{ marginBottom: 0 }}>
            Read the method once, then <Link to="/case/news-feed">the three worked examples</Link>,
            which show the same six phases producing three genuinely different systems. The{" "}
            <Link to="/cheatsheet">cheatsheet</Link> is the hour-before version.
          </p>
        </SheetCard>
      </div>

      <Callout kind="good" title="One running example, all the way through">
        <p>
          Every phase designs the same product: <b>Ledgerline</b>, an invoicing SaaS for small
          agencies. You will watch one vague sentence become a scoped brief, then screens, then a
          data model, then an API and cache policy, then a performance plan. Invoicing is a
          deliberately useful choice, because money forces the sharpest version of most
          decisions. It is the one kind of data you are never allowed to be optimistic about.
        </p>
      </Callout>

      <h2>Before the method: how the web actually works</h2>
      <p>
        Two mechanisms sit underneath every decision in the six phases. If they are already solid
        for you, skip to <Link to="/method/frame">phase 1</Link>, otherwise these twenty minutes
        pay for themselves repeatedly.
      </p>

      <h3>What happens between a URL and a usable page</h3>
      <Figure caption={
        <>
          <b>The user stares at a blank screen for the whole grey stretch.</b> Almost every
          performance decision you will ever argue about is an argument about moving one box on
          this timeline, or deleting it.
        </>
      }>
        <PageLoad />
      </Figure>

      <h3>What your own code does, in order</h3>
      <Figure caption={
        <>
          <b>Step 2 is the one people miss.</b> Modules are resolved depth-first <em>before</em>{" "}
          the importing file&rsquo;s own body runs, so naming a component in your route file pulls
          it into the first download, even for a route nobody visits.
        </>
      }>
        <BootSequence />
      </Figure>

      <p>Two facts from that diagram do a lot of work later:</p>
      <ul>
        <li>
          <b>Your bundle is your import graph, not your page.</b> This is the whole reason
          route-level code splitting exists, <code>lazy()</code> cuts an edge in the graph.
        </li>
        <li>
          <b>Data fetching starts after the first paint, not before it.</b> In a client-rendered
          app the server does not know what data the page needs until the JavaScript has
          downloaded, parsed and run. That waterfall is what SSR, route loaders and React Server
          Components each attack differently.
        </li>
      </ul>

      <h3>Where data comes from</h3>
      <Figure caption={
        <>
          <b>Latency and truth point in opposite directions.</b> The further right you go, the
          slower the answer and the more certainly correct it is.
        </>
      }>
        <RequestPath />
      </Figure>
      <p>
        That trade-off is the whole of caching in one sentence:{" "}
        <b>a cache is a deliberate decision to accept a possibly-wrong answer in exchange for a
        much faster one.</b> Phase 1 is where you decide, per piece of data, how wrong you are
        willing to be.
      </p>

      <h3>The shape of a modern frontend</h3>
      <p>
        Older material draws this as MVC. That is not wrong so much as it answers a question
        nobody asks anymore, React, Vue and Angular all handle &ldquo;view updates when model
        changes&rdquo; for you. The split that matters today is between data you <em>own</em> and
        data you are <em>borrowing</em>.
      </p>
      <Figure caption={
        <>
          <b>The middle row is the load-bearing idea.</b> Server state and client state look alike
          in code and behave nothing alike in production. Phase 3 is built on this distinction.
        </>
      }>
        <ClientArchitecture />
      </Figure>

      <div className="start-row">
        <Link className="btn btn-primary" to="/method/frame">Begin phase 1 · Frame →</Link>
      </div>
    </article>
  );
}
