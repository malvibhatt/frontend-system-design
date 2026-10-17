import { Link } from "react-router-dom";
import { Page, Figure, Table, Callout, Sheet, SheetCard, Numbers, Steps } from "../components/Doc.jsx";
import Radio from "../diagrams/Radio.jsx";

export default function Cheatsheet() {
  return (
    <Page
      eyebrow="Reference"
      title="Cheatsheet"
      lede="The whole guide compressed into what you would actually want in front of you, an hour before an interview, or on day one of designing something real."
    >
      <p>
        Everything here is explained properly elsewhere; this page assumes you have read it once
        and need reminding, not teaching. It is laid out to print cleanly if you want it on paper.
      </p>

      <h2>The running order</h2>

      <Figure caption={<><b>Spend the time where the bar says.</b> The first four phases exist to earn the right to have the fifth conversation.</>}>
        <Radio />
      </Figure>

      <h2>The first five minutes</h2>
      <Sheet>
        <SheetCard title="Open like this" items={[
          <>Restate the problem in <b>one sentence</b> and get agreement.</>,
          <>Name <b>three to five core features</b>. Say out loud what you are excluding.</>,
          <>Ask the requirement questions on the right. Write the answers down.</>,
          <>State non-functional targets <b>as numbers</b>, not adjectives.</>,
          <>Signpost: &ldquo;I&rsquo;ll sketch the screen, then data flow, then the API, then spend most of our time on optimisations.&rdquo;</>,
        ]} />
        <SheetCard title="Questions that change the design" items={[
          <><b>Public and indexed?</b> → decides server vs client rendering.</>,
          <><b>How stale may this be?</b> → decides the transport. Get a number.</>,
          <><b>How big is the list?</b> Fifty or fifty thousand → decides pagination and DOM strategy.</>,
          <><b>Who, on what device, on what network?</b> → decides your budget.</>,
          <><b>What can the user change?</b> → decides mutations, optimistic UI, invalidation.</>,
          <><b>What happens when it fails?</b> → decides error and offline design.</>,
        ]} />
      </Sheet>

      <h2>Decision quick-reference</h2>

      <h3>Where state lives</h3>
      <Table
        strongFirst
        head={["If…", "Put it in", "Because"]}
        rows={[
          ["It comes from the server", "Query cache (TanStack, RTK Query, RSC)", "It can go stale; you need refetch, dedupe, invalidation"],
          ["It is already in the URL: tab, filters, page", "useSearchParams", "Shareable, survives refresh, back button works"],
          ["One component uses it", "useState / useReducer", "Colocation is the default, not a fallback"],
          ["A few nearby components use it", "Nearest common parent", "Cheapest correct answer"],
          ["Global, rarely changes (theme, user)", "Context", "No subscriptions: every consumer re-renders on change"],
          ["Global, changes often", "External store (Zustand, Redux, signals)", "Components subscribe to slices"],
          ["There are many illegal in-between states", "State machine (XState)", "Makes impossible states unrepresentable"],
        ]}
      />

      <h3>How the screen stays fresh</h3>
      <Table
        strongFirst
        head={["If…", "Use", "You then own"]}
        rows={[
          ["Seconds-to-minutes of staleness is fine", "Polling via the query cache", "Nothing. This is the right answer more often than it feels."],
          ["Only the server has news", "SSE", "Almost nothing: EventSource reconnects and replays via Last-Event-ID"],
          ["Both sides send, frequently", "WebSocket", "Reconnect, heartbeat, resubscribe, backfill, sticky sessions"],
          ["Updates are rare and the user can ask", "A refresh button", "Say this out loud: sometimes it is genuinely correct"],
        ]}
      />

      <h3>Where the page is rendered</h3>
      <Table
        strongFirst
        head={["Strategy", "Use when", "Cost"]}
        rows={[
          ["CSR", "Behind a login; SEO irrelevant; app-like", "Blank screen until JS downloads, parses and fetches"],
          ["SSG", "Content is the same for everyone and changes rarely", "A rebuild to change anything"],
          ["ISR / revalidated static", "Mostly static but updates periodically", "Some readers see a slightly old page"],
          ["SSR", "Public, personalised, content-first", "Server cost, and a visible-but-not-interactive hydration gap"],
          ["Streaming SSR / RSC", "Large page where one slow query blocks the rest", "More complexity; newer, sharper edges"],
        ]}
      />

      <h3>How long to cache</h3>
      <Table
        strongFirst
        head={["Data", "Staleness", "Setting"]}
        rows={[
          ["Money, stock, availability", "Zero", "No cache, or cache plus a live channel"],
          ["Feeds, lists, dashboards", "Seconds to a minute", "staleTime ~60s, refetch on focus"],
          ["Profile, settings, permissions", "Until changed", "Cache long; invalidate on mutation"],
          ["Reference data, icon sets, country lists", "Days", "staleTime: Infinity, version in the URL"],
          ["Hashed build assets", "Never wrong", "max-age=31536000, immutable"],
          ["index.html", "Always check", "no-cache (which means revalidate, not no-store)"],
        ]}
      />

      <h2>Numbers worth knowing</h2>
      <Numbers items={[
        { value: "≤ 2.5s", label: "LCP at p75: good" },
        { value: "≤ 200ms", label: "INP at p75: good (replaced FID, 2024)" },
        { value: "≤ 0.1", label: "CLS at p75: good" },
        { value: "≤ 800ms", label: "TTFB target" },
        { value: "100ms", label: "Feels instant to a human" },
        { value: "1s", label: "Upper limit before flow breaks" },
        { value: "16.7ms", label: "One frame at 60fps" },
        { value: "~150ms", label: "Typeahead debounce" },
        { value: "p75", label: "The percentile to quote, from real sessions" },
      ]} />

      <h2>What loses points, and what earns them</h2>
      <Sheet>
        <SheetCard kind="flag" title="Red flags" items={[
          "Designing before asking what is being built.",
          <>Naming tools instead of trade-offs. &ldquo;I&rsquo;d use Redux&rdquo; is not a reason.</>,
          "Reaching for WebSockets when nothing is sent upstream.",
          "No loading, empty, or error states anywhere in the design.",
          "Never mentioning accessibility or observability unprompted.",
          <>Adjectives instead of numbers, &ldquo;fast&rdquo;, &ldquo;scalable&rdquo;, &ldquo;real-time&rdquo;.</>,
          "Treating the happy path as the design and failure as an afterthought.",
        ]} />
        <SheetCard kind="say" title="Sentences that land" items={[
          <>&ldquo;How stale is this allowed to be?&rdquo;</>,
          <>&ldquo;That&rsquo;s server state, so it belongs in the query cache, not component state.&rdquo;</>,
          <>&ldquo;I&rsquo;d default to SSE and upgrade to a WebSocket only if the client needs to send.&rdquo;</>,
          <>&ldquo;Cursor pagination, offsets are incorrect for a list that grows at the top.&rdquo;</>,
          <>&ldquo;If we can&rsquo;t keep up, here is what I would degrade first.&rdquo;</>,
          <>&ldquo;I&rsquo;d measure that at p75 from real sessions, not from Lighthouse.&rdquo;</>,
          <>&ldquo;That&rsquo;s a trade. We gain X and pay Y. I&rsquo;d take it here because…&rdquo;</>,
        ]} />
      </Sheet>

      <h2>Optimisations, grouped so you can recall them</h2>
      <Sheet>
        <SheetCard title="Loading" items={[
          "Route-level code splitting, cut the import graph",
          "Server-render or stream the first screen",
          "Preload the LCP image; never lazy-load it",
          "Defer third-party scripts; they are rarely critical",
          "Modern image formats with srcset and explicit dimensions",
        ]} />
        <SheetCard title="Rendering" items={[
          "Virtualise long lists, or content-visibility: auto",
          "Coalesce high-frequency updates to one per frame",
          "Keep high-frequency state out of Context",
          "Canvas or WebGL past a few thousand elements",
          "CSS transforms for animation, not layout properties",
        ]} />
        <SheetCard title="Network" items={[
          "stale-while-revalidate at both HTTP and cache layers",
          "Debounce input; throttle scroll and resize",
          "Dedupe in-flight requests by key",
          "Batch analytics; send with sendBeacon on page hide",
          "Prefetch on hover or focus: intent is a free signal",
        ]} />
        <SheetCard title="Resilience and trust" items={[
          "Error boundary per independently-failing region",
          "Retry reads with backoff; retry writes only with an idempotency key",
          "Show connection state honestly rather than freezing",
          "Keep last-good data on screen when a refresh fails",
          "Decide what degrades first under load, before it happens",
        ]} />
        <SheetCard title="Accessibility" items={[
          "Semantic elements before ARIA: a button, not a div",
          "Keyboard path through every flow; visible focus",
          "Announce async changes in a live region",
          "rem units so browser zoom and font settings work",
          "Contrast checked in both themes, not just light",
        ]} />
        <SheetCard title="Security" items={[
          "Render text as data; never inject HTML strings",
          "Tokens in httpOnly cookies, not localStorage",
          "A Content-Security-Policy that actually blocks inline script",
          "CORS set deliberately, not copied from a tutorial",
          "Never ship source maps publicly, upload them to the error tracker",
        ]} />
      </Sheet>

      <h2>Designing something new, in order</h2>
      <p>
        The same framework, used as a to-do list rather than an interview script.
      </p>
      <Steps items={[
        <>Write the problem in one sentence. If you cannot, you are not ready to design it.</>,
        <>Write down two numbers: <b>how stale data may be</b>, and <b>how large the data gets</b>.</>,
        <>Sketch the screen. Name the components you see. This is your architecture&rsquo;s first draft.</>,
        <>Sort every piece of state into <b>server state</b> or <b>client state</b>. Decide where each lives.</>,
        <>Pick the transport from your staleness number, not from what sounds impressive.</>,
        <>Write the API contract including <b>pagination shape and error shape</b>, before building anything.</>,
        <>Pick the rendering strategy from SEO and first-paint needs.</>,
        <>List the <b>three</b> optimisations that matter for this specific system. Ignore the rest for now.</>,
        <>Decide what you will measure, and the one alert you would want paging you.</>,
        <>Write down what degrades first under load, and make that degradation visible to the user.</>,
      ]} />

      <Callout kind="good" title="If you remember one thing">
        <p>
          Every answer in frontend system design is a trade between <b>latency, freshness and
          complexity</b>. Naming which one you are spending, and what you are buying with it, is
          the difference between describing a system and designing one.
        </p>
      </Callout>

      <p>
        Next: the <Link to="/practice">practice screen</Link>, where these turn into questions to
        work through on your own.
      </p>
    </Page>
  );
}
