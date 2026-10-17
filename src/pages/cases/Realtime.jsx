import { Link } from "react-router-dom";
import { Page, Figure, Callout, Table } from "../../components/Doc.jsx";
import LivePipeline from "../../diagrams/LivePipeline.jsx";
import Reconnect from "../../diagrams/Reconnect.jsx";

export default function Realtime() {
  return (
    <Page
      eyebrow="Worked example 06"
      title="Design a real-time fleet dashboard"
      lede="A map of several thousand vehicles updating live, with a filterable table beside it and alerts when something goes wrong. Here the transport and the flow control are the design; almost everything else follows from them."
    >
      <h2>R, Requirements</h2>
      <Table
        strongFirst
        head={["Question", "Answer here", "What it decides"]}
        rows={[
          ["Who uses it, and how?", "Depot operators, on a desk monitor, all day", "No SEO, no cold-start concern, but memory leaks over an 8-hour session become real"],
          ["How fresh must positions be?", "Seconds", "A live transport is genuinely justified, unlike the feed"],
          ["How many vehicles?", "Up to ~5,000, ~500 updates/sec at peak", "Rendering must be decoupled from message rate"],
          ["Does the operator send commands?", "Rarely, and through ordinary REST calls", "The live channel is one-way, which decides SSE over WebSocket"],
          ["What if the connection drops?", "Must be obvious, and must recover", "Reconnection and backfill are features, not error handling"],
        ]}
      />
      <p>
        That fourth answer is the one that saves you the most work, and it is easy to forget to
        ask. &ldquo;Real-time&rdquo; does not imply bidirectional.
      </p>

      <h2>I, Interface (first, this time)</h2>
      <p>
        RADIO is a running order, not a law. On this system the transport decision constrains the
        architecture rather than the other way round, so it is worth settling first, and saying
        why you are reordering is itself a good signal.
      </p>
      <p>
        <b>Snapshot over REST, then deltas over SSE.</b> This pairing is the pattern worth
        remembering:
      </p>
      <ul>
        <li><code>GET /vehicles</code> → the full current state, cacheable, paginated if large</li>
        <li><code>GET /vehicles/stream</code> → an SSE connection carrying only what changed, each event with a monotonic sequence id</li>
        <li><code>POST /vehicles/:id/commands</code> → ordinary requests for the rare operator action</li>
      </ul>
      <p>
        Without the snapshot, a client that connects at 09:00 sees nothing until a vehicle happens
        to move. A parked van may be invisible for an hour. Without the stream, you are polling
        5,000 records to discover that six of them changed.
      </p>

      <Callout kind="good" title="Why SSE and not a WebSocket">
        <p>
          The operator sends almost nothing on this channel, and the things they do send are
          perfectly good REST calls. Choosing a WebSocket would mean owning reconnection,
          heartbeats, resubscription and sticky-session load balancing in exchange for a direction
          of travel we do not use. SSE is plain HTTP, existing auth cookies, proxies and load
          balancers work unchanged, and <code>EventSource</code> reconnects on its own. See{" "}
          <Link to="/apis">APIs &amp; transports</Link>.
        </p>
      </Callout>

      <h2>A, Architecture</h2>
      <p>
        The hard problem is not receiving 500 messages a second. It is that a screen can only
        usefully change 60 times a second, and naively calling <code>setState</code> per message
        asks React to do roughly eight times more work than any human could perceive.
      </p>

      <Figure caption={
        <>
          <b>The buffer is a Map, not a queue.</b> Two updates for the same vehicle between
          frames are not both needed. The second overwrites the first, and only the final
          position is ever rendered.
        </>
      }>
        <LivePipeline />
      </Figure>

      <p>
        Everything else about the architecture falls out of that pipeline:
      </p>
      <ul>
        <li>
          <b>The live store sits outside React.</b> A plain module or an external store receives
          the stream; components subscribe to the slices they display. Putting a 500 Hz feed into
          Context would re-render every consumer on every message, see{" "}
          <Link to="/patterns">Design patterns</Link>.
        </li>
        <li>
          <b>The map is canvas or WebGL, not DOM markers.</b> Five thousand absolutely-positioned
          elements is a layout problem no amount of memoisation fixes. Libraries like MapLibre or
          Mapbox render to a canvas for exactly this reason.
        </li>
        <li>
          <b>The table beside the map is virtualised</b> and sorted/filtered from the same store,
          so the two views cannot disagree.
        </li>
        <li>
          <b>Parsing can move to a Web Worker</b> if the payload is heavy, JSON parsing at
          500/sec is real main-thread time, and the main thread is also drawing the map.
        </li>
      </ul>

      <h2>D, Data model</h2>
      <p>
        One <code>Map&lt;VehicleId, Vehicle&gt;</code> as the single source of truth, with
        everything else derived from it. The important modelling decision is{" "}
        <b>what you deliberately do not keep</b>.
      </p>
      <Table
        strongFirst
        head={["Data", "Kept where", "Why"]}
        rows={[
          ["Current position, speed, status", "Live store, overwritten in place", "Only the latest value has any meaning"],
          ["Recent track (last N points)", "Bounded ring buffer per vehicle", "Unbounded history is how an 8-hour session runs out of memory"],
          ["Alerts", "Append-only list, capped and ageing out", "Operators need recent history; nobody scrolls back 6 hours"],
          ["Filters, selected vehicle, map viewport", "URL search params", "The operator can bookmark and share a view, see Design patterns"],
          ["Full historical playback", "Not in the client. Fetched on demand.", "A different feature with a different access pattern"],
        ]}
      />

      <h2>O, Optimisations that actually matter here</h2>

      <h3>Reconnection is a feature</h3>
      <Figure caption={
        <>
          <b>The dashed ticks are the dangerous part.</b> Events kept happening while the client
          was deaf, and a map that silently shows 90-second-old positions is worse than one that
          admits it is stale.
        </>
      }>
        <Reconnect />
      </Figure>
      <p>
        Three things make this work. The server stamps every event with an id, so{" "}
        <code>EventSource</code> can send <code>Last-Event-ID</code> on reconnect and the server
        can replay the gap. The client shows connection state honestly: a banner, and a timestamp
        on the data. And if the gap is longer than the server&rsquo;s replay buffer, the client
        re-fetches the snapshot instead of pretending to be caught up.
      </p>

      <h3>Out-of-order and duplicate messages</h3>
      <p>
        Networks reorder and retries duplicate. Because each event carries a sequence id, the rule
        is one line, <em>ignore any event whose sequence is lower than the one already applied
        for that vehicle</em>, and it removes a whole category of flickering, teleporting-marker
        bugs that are otherwise very hard to reproduce.
      </p>

      <h3>Backpressure</h3>
      <p>
        If the client cannot keep up, something has to give, and it is better that you decide
        what. Options, roughly in order of preference: have the server send deltas only for
        vehicles in the current viewport, reduce update frequency for vehicles that are stationary,
        or drop to a lower-rate summary feed when the buffer consistently exceeds a threshold.
        Saying &ldquo;and if it still cannot keep up, here is what degrades&rdquo; is a strong
        close to this question.
      </p>

      <h3>An eight-hour session</h3>
      <p>
        This page is never reloaded, which makes ordinary leaks fatal: an event listener added per
        vehicle and never removed, a chart library accumulating points, a growing array of alerts.
        Cap every collection, remove every subscription, and watch heap over a long session rather
        than a short one. This is a case where{" "}
        <Link to="/observability">observability</Link> has to cover memory, not just latency.
      </p>

      <Callout kind="why" title="What makes this system different">
        <p>
          It is <b>write-heavy from the server, private, and long-lived</b>. SEO and first paint
          barely matter; message rate, connection state and memory are the whole game. The
          clearest contrast with the <Link to="/case/news-feed">news feed</Link> is that there,
          caching exists to avoid requests, here, the data is pushed to you and the hard part is
          deciding what to <em>throw away</em>.
        </p>
      </Callout>
    </Page>
  );
}
