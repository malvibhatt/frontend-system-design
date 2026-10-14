import { Page, Figure, Callout, Table } from "../components/Doc.jsx";
import FieldData from "../diagrams/FieldData.jsx";
import Trace from "../diagrams/Trace.jsx";

export default function Observability() {
  return (
    <Page
      eyebrow="Deep dive 04"
      title="Observability"
      lede="Testing tells you the code works on your machine. Observability tells you what it is actually like to be your user, right now, on their phone, on their network. These are different questions and only one of them is the product."
    >
      <h2>Lab data lies, politely</h2>
      <p>
        Lighthouse, your dev server and your laptop produce <b>lab data</b>: one synthetic run on
        fast hardware over a good connection. It is genuinely useful for catching regressions in
        CI and for comparing two implementations. It tells you almost nothing about your users.
      </p>

      <Figure caption={
        <>
          <b>The average is the least useful number here.</b> It sits in the hump and conceals the
          tail, where the people who abandon the page actually live.
        </>
      }>
        <FieldData />
      </Figure>

      <p>
        <b>Field data</b> — Real User Monitoring — is this histogram: the same metric collected
        from every real session. You read it at percentiles, and the convention is{" "}
        <b>p75</b>: the experience of the unluckiest quarter of your users. Google uses p75 for
        Core Web Vitals specifically because it is slow enough to represent genuine pain and
        stable enough not to swing on one bad session.
      </p>

      <h2>The three metrics that matter</h2>
      <Table
        strongFirst
        head={["Metric", "What it measures", "Good (p75)", "Usually caused by"]}
        rows={[
          ["LCP", "When the main content appeared", "≤ 2.5s", "Slow server response, render-blocking resources, an unoptimised hero image"],
          ["INP", "How quickly the page responds to interactions, across the whole visit", "≤ 200ms", "Long JavaScript tasks blocking the main thread; heavy re-renders"],
          ["CLS", "How much the layout jumped around", "≤ 0.1", "Images without dimensions, injected banners, late-loading fonts"],
        ]}
      />
      <p>
        If you learned this list a few years ago it contained <b>FID</b>. INP replaced it in March
        2024, and the replacement matters: FID measured only the delay before the <em>first</em>{" "}
        interaction was handled, which made almost every site look fine. INP looks at the full
        duration of interactions across the entire visit, which is much closer to what people mean
        by &ldquo;this feels sluggish.&rdquo; Sites that scored well on FID often score badly on
        INP — that is the metric working, not a regression.
      </p>
      <p>
        <b>TTI</b> (Time to Interactive) appears in older material as the headline number. It was
        deprecated for being noisy and hard to act on. If you mention it, mention that INP replaced
        its role.
      </p>

      <Callout kind="good" title="Collecting this is genuinely small">
        <p>
          The <code>web-vitals</code> library is about 2 KB and reports all three on real sessions.
          Send them to whatever you already use. The gap between &ldquo;no RUM&rdquo; and
          &ldquo;some RUM&rdquo; is enormous; the gap between competing vendors is not.
        </p>
      </Callout>

      <h2>Errors, and the one thing that makes them useful</h2>
      <p>
        Catch what reaches users: <code>window.onerror</code>, <code>unhandledrejection</code>,
        React error boundaries, and failed requests from your transport layer. Then do the step
        that decides whether any of it is worth having — <b>upload source maps at build time</b>.
        Without them, every production error is an unreadable stack through minified
        <code> a.b.c</code> frames, and your error tracker becomes a wall of noise everyone learns
        to ignore. Upload them privately; never deploy them to the public bundle.
      </p>
      <p>
        Group errors by release so you can see which deploy introduced which spike, and attach the
        user-facing consequence: an error that was caught by a boundary and showed a retry button
        is a different severity from one that blanked the page.
      </p>

      <h2>Tracing across the boundary</h2>
      <p>
        The frontend question is usually &ldquo;the Save button is slow.&rdquo; The backend answer
        is usually &ldquo;our p99 looks fine.&rdquo; Both are true, and tracing is what connects
        them.
      </p>

      <Figure caption={
        <>
          <b>The browser starts the trace, not the server.</b> That is the part teams miss — the
          first 120ms and the last 95ms exist only if the frontend is instrumented.
        </>
      }>
        <Trace />
      </Figure>

      <p>
        Mechanically this is one header. The browser generates a trace id, sends it as{" "}
        <code>traceparent</code> on the request (the W3C Trace Context standard), and the backend
        attaches its spans to the same id. OpenTelemetry has a browser SDK that does this and is
        worth preferring over a vendor-specific agent, because the instrumentation then outlives
        your choice of vendor.
      </p>
      <p>
        Add spans for the handful of interactions you actually care about — the checkout submit,
        the dashboard load, the search — not for everything. A trace on every click produces cost
        without insight.
      </p>

      <h2>Deciding what to send, and what it costs</h2>
      <p>
        This is where the old advice about estimating volume is genuinely useful, just for a
        different reason than it was given. Observability is billed by volume, and an
        instrumentation change can multiply your bill without anyone noticing until invoicing.
      </p>
      <Table
        strongFirst
        head={["Signal", "Sample rate", "Reasoning"]}
        rows={[
          ["Core Web Vitals", "100%", "One tiny payload per session; this is your baseline and you want the true distribution"],
          ["Errors", "100%, deduplicated", "Rare by nature. Group identical stacks rather than dropping them."],
          ["Traces", "1–10%, plus 100% of failures", "Expensive and highly redundant when healthy. Always keep the ones that failed."],
          ["Session replay", "A low percentage, or triggered on error", "The most expensive signal and the biggest privacy surface — mask inputs by default"],
          ["Custom product events", "100%, batched", "Send on an interval or on page hide, never one request per event"],
        ]}
      />
      <p>
        Use <code>navigator.sendBeacon()</code> or <code>fetch(&#123; keepalive: true &#125;)</code>{" "}
        for anything sent as the user leaves. A normal <code>fetch</code> in an unload handler is
        cancelled when the page goes away, which is precisely when the most interesting data is
        produced.
      </p>

      <h2>Alert on symptoms, not causes</h2>
      <p>
        An alert should describe something a user would complain about: <em>p75 LCP on the feed
        has been above 3 seconds for 15 minutes</em>, or <em>the checkout error rate tripled after
        the 14:20 release</em>. Alerting on causes — CPU, bundle size, a single slow endpoint —
        produces pages nobody can act on and fatigue that makes the real alert get ignored.
      </p>
      <p>
        The most valuable frontend alert is usually the simplest: error rate by release, with a
        link to the diff.
      </p>

      <Callout kind="why" title="Why this matters in an interview">
        <p>
          Almost nobody volunteers observability, so raising it unprompted signals that you have
          operated software rather than only shipped it. The complete answer in one sentence:{" "}
          <em>Core Web Vitals from real sessions at p75, errors with source maps grouped by
          release, traces sampled with the frontend starting the trace, and alerts on user-visible
          symptoms.</em>
        </p>
      </Callout>
    </Page>
  );
}
