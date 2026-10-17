import { Link } from "react-router-dom";
import { Page, Figure, Callout, Table } from "../../components/Doc.jsx";
import WorkFunnel from "../../diagrams/WorkFunnel.jsx";
import RaceCondition from "../../diagrams/RaceCondition.jsx";

export default function Typeahead() {
  return (
    <Page
      eyebrow="Worked example 07"
      title="Design a typeahead search"
      lede="A search box that suggests results as you type. The smallest system in this guide and the one with the least room for error, the entire design is about doing as little work as possible, as correctly as possible."
    >
      <h2>R, Requirements</h2>
      <Table
        strongFirst
        head={["Question", "Answer here", "What it decides"]}
        rows={[
          ["How fast must a suggestion appear?", "Under ~100ms after the user stops typing", "Caching and prefetching stop being optimisations and become the design"],
          ["How many users are typing at once?", "Every user, on every keystroke", "Request volume is the dominant backend cost, gating it is a product requirement"],
          ["Do results change often?", "Rarely: same prefix, same answers", "Cache hard and locally, with a long staleTime"],
          ["Keyboard and screen reader support?", "Mandatory", "This is a combobox, with a specific ARIA contract, not a div with a list"],
        ]}
      />
      <p>
        Notice how different this requirements table looks from the previous two, despite asking
        the same kind of questions. Nothing here is about SEO, rendering strategy or connection
        state.
      </p>

      <h2>A, Architecture</h2>
      <p>
        There is barely any architecture: an input, a controlled query string, a cache, and a
        results list. The design lives in the <em>gates</em> between a keystroke and a network
        request.
      </p>

      <Figure caption={
        <>
          <b>Drawn to scale, because the proportions are the point.</b> Each gate is one line of
          code and removes more work than the one before it.
        </>
      }>
        <WorkFunnel />
      </Figure>

      <p>In order, and each solving a specific problem:</p>
      <ol>
        <li>
          <b>Minimum length.</b> A single character matches nearly everything, so the query is
          expensive and the results useless. Skip it.
        </li>
        <li>
          <b>Debounce, roughly 150ms.</b> Debounce, not throttle. Throttling fires at a steady
          rate <em>during</em> typing; debouncing waits for the pause that means the user has
          finished a word. For a search box you want the pause. 150ms is short enough to feel
          instant and long enough to skip most intermediate states.
        </li>
        <li>
          <b>Cache by query string.</b> Users backspace constantly. Going from{" "}
          <code>react</code> back to <code>reac</code> is a question you answered 400ms ago, and
          it should render from memory with no request at all.
        </li>
        <li>
          <b>Cancel whatever is in flight.</b> Which is the subject of the next section, and the
          bug that makes typeaheads feel broken.
        </li>
      </ol>

      <h2>The bug this system is famous for</h2>
      <p>
        Responses do not arrive in the order you sent them. A request for a shorter prefix matches
        more rows, so it is often the <em>slower</em> one, which means the stale answer tends to
        land last precisely when it is most wrong.
      </p>

      <Figure caption={
        <>
          <b>This is not rare.</b> It is the default behaviour of a typeahead with no
          cancellation, and it shows up as results that flicker back to something you typed two
          words ago.
        </>
      }>
        <RaceCondition />
      </Figure>

      <p>
        Two defences, and you want both. <b>Abort the in-flight request</b> with{" "}
        <code>AbortController</code> when a new one starts. This also saves the backend work.
        And <b>ignore any response that is not for the current query</b>, by comparing the
        response&rsquo;s query to the current input before rendering. Abort alone is not quite
        enough, because a response can already be in flight on the wire when you abort. Any decent
        query library does both for you, keyed on the query string, which is a perfectly good
        answer to give.
      </p>

      <h2>D, Data model</h2>
      <p>
        Almost all of it is ephemeral, and that is worth saying explicitly, because the instinct
        to persist things is strong:
      </p>
      <Table
        strongFirst
        head={["State", "Lives in", "Why"]}
        rows={[
          ["Input value", "Local component state", "Nobody else needs it; it dies with the component"],
          ["Active option index", "Local state", "Keyboard navigation only: this is what aria-activedescendant points at"],
          ["Results per query", "Query cache, keyed by the query string", "The cache key is the query. That one choice gives you deduping, cancellation and backspace-for-free."],
          ["Recent searches", "localStorage", "The only thing here worth surviving a reload"],
          ["The submitted search", "The URL", "A results page must be shareable; the suggestions box must not be"],
        ]}
      />

      <h2>I, Interface</h2>
      <p>
        <code>GET /suggest?q=rea&amp;limit=8</code>. A plain, cacheable GET, which matters here
        more than anywhere else in this guide, because it means a CDN can answer popular prefixes
        without ever reaching your origin. Keep the response tiny: an id, the display text, and a
        type. Anything else is bytes on the critical path of something that must feel instant.
      </p>
      <p>
        Set a <code>Cache-Control</code> with a long <code>max-age</code> and{" "}
        <code>stale-while-revalidate</code>. Popular prefixes are enormously repetitive across
        users. This is the rare case where the HTTP cache does more for you than the client
        cache. See <Link to="/caching">Caching &amp; stale data</Link>.
      </p>

      <h2>O, Optimisations that actually matter here</h2>

      <h3>Accessibility is not an optimisation here, it is the component</h3>
      <p>
        A typeahead is a <b>combobox</b>, and it has a specific contract: the input carries{" "}
        <code>role=&quot;combobox&quot;</code> with <code>aria-expanded</code> and{" "}
        <code>aria-controls</code>; the list is a <code>listbox</code>; focus stays in the input
        while <code>aria-activedescendant</code> points at the highlighted option. Arrow keys
        move, Enter selects, Escape closes, Tab leaves. Results arriving must be announced via a
        live region, or a screen-reader user has no idea anything appeared.
      </p>
      <p>
        Building this yourself is genuinely difficult to get right. This is the strongest case in
        the whole guide for a <b>headless component library</b>. The behaviour and ARIA wiring
        are hard and identical everywhere, while the markup is yours. That is the pattern from{" "}
        <Link to="/patterns">Design patterns</Link>, with a concrete reason attached.
      </p>

      <h3>Prefetch on intent</h3>
      <p>
        When a suggestion is highlighted, the user is telling you what they are about to pick.
        Prefetching that result page on hover or arrow-key focus moves the fetch out of the
        critical path entirely, by the time they press Enter, the data is local. This is the
        cheapest perceived-performance win available on almost any interface.
      </p>

      <h3>Handle empty and error states deliberately</h3>
      <p>
        No results is a normal outcome, not an error, and it needs its own message. A failed
        request should leave the last good results on screen rather than blanking the list,
        showing something slightly old beats showing nothing. And never show a spinner for a
        150ms request; it reads as flicker. Only show loading if the request exceeds roughly
        300ms.
      </p>

      <Callout kind="why" title="What makes this system different">
        <p>
          It is <b>tiny, latency-bound and interaction-dense</b>. There is no architecture to
          speak of, no transport decision, and no rendering strategy. All the difficulty sits in
          the request lifecycle and the keyboard contract, which is exactly why it is such a
          common interview question. It is small enough to design completely in thirty minutes,
          so there is nowhere to hide.
        </p>
      </Callout>

      <h2>The three systems side by side</h2>
      <p>
        Same framework, three genuinely different answers. This comparison is the point of the
        worked examples.
      </p>
      <Table
        strongFirst
        head={["", "News feed", "Fleet dashboard", "Typeahead"]}
        rows={[
          ["Dominant constraint", "First paint and SEO", "Message rate and connection state", "Latency per keystroke"],
          ["Transport", "REST, cursor-paginated, polled", "REST snapshot + SSE deltas", "Plain cacheable GET"],
          ["Rendering", "Server-rendered first page, then client", "Canvas map, decoupled from message rate", "Client only; nothing to render until typed"],
          ["Hardest part", "Image strategy and DOM size", "Coalescing, reconnection, memory", "Race conditions and the ARIA contract"],
          ["Caching serves", "Avoiding requests", "Surviving disconnects", "Making backspace free"],
          ["Barely matters", "Connection state", "SEO and first paint", "Architecture"],
        ]}
      />
    </Page>
  );
}
