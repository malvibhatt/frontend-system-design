import { Page, Figure, Callout, Table } from "../components/Doc.jsx";
import OverFetch from "../diagrams/OverFetch.jsx";
import TransportTimeline from "../diagrams/TransportTimeline.jsx";

export default function Apis() {
  return (
    <Page
      eyebrow="Deep dive 02"
      title="APIs and transports"
      lede="These are two separate questions that get discussed as one. First: what shape is the data you ask for? Second: who starts the conversation, and how often? REST and GraphQL answer the first. Polling, SSE and WebSockets answer the second."
    >
      <p>
        Keeping them apart is useful, because the answers combine freely. A GraphQL app can use
        SSE for live updates. A REST app can use WebSockets. Choosing &ldquo;GraphQL&rdquo; does
        not tell you anything about how the screen stays fresh.
      </p>

      <h2>Part one: the shape of the request</h2>
      <p>
        REST organises the API around <em>resources</em>: the server decides what a user looks
        like, and you take it. That is a sensible default and it has one failure mode, which
        shows up the moment one screen needs a little less and a different screen needs a little
        more.
      </p>

      <Figure caption={
        <>
          <b>Two different failures, same cause.</b> The server decided the payload shape, and no
          single shape suits every screen. Over-fetching wastes bytes; under-fetching costs a
          second round trip that cannot start until the first finishes.
        </>
      }>
        <OverFetch />
      </Figure>

      <Table
        strongFirst
        head={["", "Reach for it when", "Real cost"]}
        rows={[
          [
            "REST",
            "Resources map cleanly to screens; you want boring, cacheable, debuggable HTTP",
            "Payload shape is fixed by the server; new screens mean new endpoints or over-fetching",
          ],
          [
            "GraphQL",
            "Many clients with different data needs; deeply related data; a screen assembled from several services",
            "HTTP caching mostly stops working (one POST endpoint), client library weight, and a new class of expensive-query problem on the server",
          ],
          [
            "RPC / tRPC",
            "TypeScript on both ends, one team, one repo. You want end-to-end types with no codegen step",
            "Couples client and server tightly; poor fit for public or long-lived APIs",
          ],
          [
            "BFF",
            "The client is stitching together several services and over-fetching from all of them",
            "Another service to deploy, own and keep thin",
          ],
        ]}
      />

      <Callout kind="warn" title="The GraphQL trade nobody mentions">
        <p>
          GraphQL fixes over-fetching and breaks HTTP caching while doing it. Every query is a
          POST to <code>/graphql</code>, so CDNs and the browser cache have nothing to key on,
          which is why you then need a normalised client cache, and often persisted queries, to
          get back what REST gave you for free. It is a worthwhile trade for a large app with
          many clients, and a poor one for a small app with a single screen shape.
        </p>
      </Callout>

      <h2>Part two: who starts the conversation</h2>
      <p>
        Everything above assumes the client asks and the server answers. The second question is
        what happens when the <em>server</em> is the one with news. Drawn as timelines, the four
        options stop being an abstract list.
      </p>

      <Figure caption={
        <>
          <b>Count the arrows.</b> Polling spends round trips to discover nothing happened. The
          other three spend a held connection to avoid that.
        </>
      }>
        <TransportTimeline />
      </Figure>

      <h3>How to choose, in order</h3>
      <ol>
        <li>
          <b>Can the user tolerate being seconds behind?</b> Then poll, ideally through your
          query cache, which gives you refetch-on-focus and deduping for free. Simple, cacheable,
          survives any network, and no connection state to manage. This is the right answer far
          more often than it feels like.
        </li>
        <li>
          <b>Does only the server have news?</b> Use <b>SSE</b>. It is ordinary HTTP, so proxies,
          load balancers and auth cookies all just work, and <code>EventSource</code> reconnects
          automatically, resuming from <code>Last-Event-ID</code> so you do not lose the messages
          sent while you were disconnected. Live prices, notifications, progress of a long job,
          telemetry feeds.
        </li>
        <li>
          <b>Do both sides need to speak, often?</b> Use a <b>WebSocket</b>. Collaborative
          editing, multiplayer cursors, chat with typing indicators, anything where the client
          sends at high frequency too.
        </li>
      </ol>

      <h3>WebSocket vs SSE, directly</h3>
      <Table
        head={["", "Server-sent events", "WebSocket"]}
        rows={[
          ["Direction", "Server → client only", "Both directions"],
          ["Protocol", "Plain HTTP: proxies, CDNs and cookies work", "Upgraded connection; some corporate proxies block it"],
          ["Reconnect", "Built in, with Last-Event-ID replay", "You write it: backoff, heartbeat, resubscribe, backfill"],
          ["Data", "UTF-8 text (so JSON)", "Text or binary"],
          ["Connection limit", "6 per domain on HTTP/1.1, a non-issue over HTTP/2", "Not multiplexed; one connection each"],
          ["Load balancing", "Ordinary HTTP routing", "Sticky sessions or a shared pub/sub layer"],
          ["Good fit", "Dashboards, notifications, feeds, job progress", "Chat, collaboration, games, live control"],
        ]}
      />

      <Callout kind="good" title="The rule that settles most arguments">
        <p>
          If the client never needs to send anything on that channel, a WebSocket is a bidirectional
          solution to a unidirectional problem, and you have taken on reconnection, heartbeats and
          sticky-session load balancing for a capability you are not using. <b>Default to SSE;
          upgrade to WebSocket when the client genuinely needs to talk back.</b>
        </p>
      </Callout>

      <p>
        One note on protocol versions, since older material dwells on it: HTTP/2 made multiplexing
        standard, so the old trick of sharding assets across subdomains is obsolete and the six-
        connection limit no longer constrains SSE. HTTP/3 moves the whole thing onto QUIC, which
        mainly helps on flaky mobile networks, packet loss in one stream no longer stalls the
        others. Neither is a decision you make; both are a reason some old advice no longer applies.
      </p>

      <h2>The details that bite you regardless of choice</h2>

      <h3>Pagination: cursor, not offset</h3>
      <p>
        <code>?page=2&amp;size=20</code> is computed from a position in a list that is still
        changing. If three posts are added while the user reads page one, page two starts three
        items late and the user silently never sees them. A cursor,{" "}
        <code>?after=eyJpZCI6...</code>, points at an item instead of a position, so it stays
        correct. For any feed that grows at the top, cursor pagination is not an optimisation,
        it is a correctness fix.
      </p>

      <h3>Retries need idempotency</h3>
      <p>
        Retrying a failed <code>GET</code> is free. Retrying a <code>POST</code> that actually
        succeeded but whose response was lost creates a duplicate order. The fix is an
        idempotency key generated by the client and sent with the request, so the server
        recognises the retry. Retry reads automatically with backoff; retry writes only with a key.
      </p>

      <h3>Errors are part of the API design</h3>
      <p>
        Decide the shape up front, a stable machine-readable <code>code</code>, a human message,
        and a field map for validation errors, and make the transport layer translate every
        failure into it, including network failures and timeouts, which have no HTTP status at
        all. Components should never branch on a status code.
      </p>

      <h3>Where the token lives</h3>
      <p>
        A token in <code>localStorage</code> is readable by any script that gets onto your page,
        which turns one XSS into a full account takeover. An <code>httpOnly</code> cookie is not
        readable by JavaScript at all, and with <code>SameSite=Lax</code> handles CSRF for most
        cases. Prefer the cookie; if you must hold a token in JavaScript, keep it in memory, not
        in storage.
      </p>

      <Callout kind="why" title="Why this matters in an interview">
        <p>
          &ldquo;How does the UI stay up to date?&rdquo; is one of the most reliable questions in
          frontend system design, and the strongest answers are usually the least exotic. Start
          from how stale the data is allowed to be, state the number, then pick the cheapest
          transport that meets it, and say what you would have to build if you picked the fancier
          one.
        </p>
      </Callout>
    </Page>
  );
}
