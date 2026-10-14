import { Link } from "react-router-dom";
import { Page, Figure, Callout, Table } from "../components/Doc.jsx";
import PageLoad from "../diagrams/PageLoad.jsx";
import BootSequence from "../diagrams/BootSequence.jsx";
import RequestPath from "../diagrams/RequestPath.jsx";
import ClientArchitecture from "../diagrams/ClientArchitecture.jsx";
import Radio from "../diagrams/Radio.jsx";

const NEXT = [
  { to: "/patterns", num: "01", title: "Design patterns",
    desc: "Which problem each pattern exists to solve, and how to pick one without cargo-culting." },
  { to: "/apis", num: "02", title: "APIs & transports",
    desc: "REST, GraphQL, polling, SSE and WebSockets — a decision tree, not a feature list." },
  { to: "/caching", num: "03", title: "Caching & stale data",
    desc: "The four places data can hide, and what to do when the copy you are holding is wrong." },
  { to: "/observability", num: "04", title: "Observability",
    desc: "Finding out what it is actually like to be your user, right now, in production." },
  { to: "/case/news-feed", num: "05", title: "Case: news feed",
    desc: "Read-heavy and public. Rendering strategy and pagination carry the design." },
  { to: "/case/realtime", num: "06", title: "Case: fleet dashboard",
    desc: "Live telemetry. Transport choice and reconnection logic carry the design." },
  { to: "/case/typeahead", num: "07", title: "Case: typeahead",
    desc: "Tiny surface, brutal latency budget. Request lifecycle carries the design." },
];

export default function Overview() {
  return (
    <Page
      eyebrow="Start here"
      title="Frontend system design, without the hand-waving"
      lede="Designing a frontend system is deciding where data lives, how it gets there, and what the user sees while it is on its way. Everything else is detail hanging off those three questions."
    >
      <p>
        This guide is built for someone who has shipped a lot of frontend but has never had
        to stand at a whiteboard and <em>defend</em> a design. Each page takes one concept,
        shows the problem it exists to solve, and then says plainly when to reach for it and
        when not to.
      </p>

      <h2>How a page actually loads</h2>
      <p>
        Almost every performance decision you will ever argue about is an argument about
        this one timeline — about moving a box to the left, or deleting it.
      </p>

      <Figure caption={
        <>
          <b>Read it left to right.</b> The user stares at a blank screen for the whole grey
          stretch. Everything we do in frontend performance is an attempt to shrink that grey
          part, or to move work out of it.
        </>
      }>
        <PageLoad />
      </Figure>

      <Callout kind="why" title="Why this matters in an interview">
        <p>
          When someone asks &ldquo;how would you make this faster?&rdquo;, they are asking you to
          point at a box on this timeline and say which one you are attacking and at what cost.
          A vague answer lists techniques. A strong answer names the stage.
        </p>
      </Callout>

      <h2>Zooming into the last box: what your own code does</h2>
      <p>
        The diagram above stops at &ldquo;JS runs&rdquo;, which is where most explanations stop too.
        But that box is where every decision you control actually lives. Here is the same moment
        expanded, using an ordinary Vite + React project — the structure of this very site.
      </p>

      <Figure caption={
        <>
          <b>Step 2 is the one people miss.</b> JavaScript modules are resolved depth-first
          <em> before</em> the importing file&rsquo;s own body runs, so naming a component in
          <code>routes.jsx</code> is enough to pull it into the first download — even on a route
          the user never visits.
        </>
      }>
        <BootSequence />
      </Figure>

      <p>Two facts from this diagram do most of the work in a design discussion:</p>
      <ul>
        <li>
          <b>Your bundle is your import graph, not your page.</b> Step 2 downloads and evaluates
          everything reachable from the entry file. This is the single reason route-level code
          splitting exists: <code>lazy()</code> cuts an edge in that graph so the branch is
          fetched on demand instead of up front.
        </li>
        <li>
          <b>Data fetching starts after the first paint, not before it.</b> Step 7 runs after
          step 6. In a pure client-rendered app the server does not even know what data the page
          needs until the JavaScript has downloaded, parsed, and run — which is the waterfall
          that server-side rendering, loaders, and React Server Components each attack differently.
        </li>
      </ul>

      <Callout kind="warn" title="The trap this sets up">
        <p>
          Everything between step 1 and step 6 is time the user spends looking at nothing. Add a
          component library, a date library and an analytics SDK to the import graph and you have
          not changed a single pixel — you have just made the grey band longer. We come back to
          this when we talk about rendering strategies.
        </p>
      </Callout>

      <h2>Where the data comes from</h2>
      <p>
        A request is not one hop. It is a chain of things that could answer it, ordered from
        nearest to furthest. Each layer either answers — quickly, from a copy that might be out
        of date — or forwards the request one step further away from the user.
      </p>

      <Figure caption={
        <>
          <b>Latency and truth point in opposite directions.</b> The further right you go, the
          slower the answer and the more certainly correct it is.
        </>
      }>
        <RequestPath />
      </Figure>

      <p>
        Read that trade-off carefully, because it is the whole of caching in one sentence:
        <b> a cache is a deliberate decision to accept a possibly-wrong answer in exchange for
        a much faster one.</b> Every caching question — how long to keep it, when to revalidate,
        what to do when the user edits something — is a question about how wrong you are willing
        to be, and for how long.
      </p>

      <Callout kind="why" title="Why this matters in an interview">
        <p>
          &ldquo;How do you make this feel instant?&rdquo; has one general answer:{" "}
          <em>answer from further left.</em> Serve from the memory cache while revalidating,
          prefetch on hover so the answer is already local, render on the server so the first
          response carries data with it. Naming the layer you are moving the answer to is a far
          stronger response than listing cache types.
        </p>
      </Callout>

      <h2>The shape of a modern frontend</h2>
      <p>
        Older material — including the talk this guide started from — draws this as MVC: model,
        view, controller. That is not wrong so much as it is answering a question nobody asks
        anymore. React, Vue and Angular all handle the view-updates-when-model-changes part for
        you now, which was the problem MVC existed to solve.
      </p>
      <p>
        The split that actually matters today runs somewhere MVC never drew a line: between data
        you <em>own</em> and data you are <em>borrowing</em>.
      </p>

      <Figure caption={
        <>
          <b>The middle row is the load-bearing idea.</b> Server state and client state look
          alike in code and behave nothing alike in production.
        </>
      }>
        <ClientArchitecture />
      </Figure>

      <Table
        head={["", "Server state", "Client state"]}
        rows={[
          ["What it is", "A copy of data that lives somewhere else", "Data that exists only in this tab"],
          ["Examples", "Feed posts, user profile, vehicle positions", "Is the modal open, form draft, selected tab"],
          ["Source of truth", "The server. You hold a copy.", "The browser. You are the truth."],
          ["Can it go stale?", "Yes — the moment you receive it", "No. It cannot disagree with anything."],
          ["Hard part", "Freshness, refetching, invalidation, retries", "Keeping it from sprawling"],
          ["Reach for", <>TanStack Query, RTK Query, Apollo, RSC</>, <>useState, useReducer, Zustand, XState</>],
        ]}
      />

      <Callout kind="stale" title="The most common mistake">
        <p>
          Fetching server data, copying it into <code>useState</code> or a Redux slice, and then
          hand-writing the freshness logic — refetch on focus, retry on failure, dedupe
          in-flight requests, invalidate after a mutation. That is several hundred lines of
          bug-prone code reimplementing a cache badly. Most of what people mean by
          &ldquo;state management is hard&rdquo; is this one category error.
        </p>
      </Callout>

      <p>
        Notice too that <b>client state never touches the network</b>. That single line in the
        diagram is what makes the architecture testable: components take props and raise events,
        client state is pure, and everything uncertain — latency, failure, retries, auth — is
        confined to the transport layer at the bottom.
      </p>

      <h2>A framework for the conversation: RADIO</h2>
      <p>
        In an interview the hard part is not knowing things, it is sequencing them under
        pressure. RADIO is a running order: requirements, architecture, data model, interface,
        optimisations. Its real value is that it stops you doing the thing everybody does under
        stress, which is to start designing before anyone has said what is being built.
      </p>

      <Figure caption={
        <>
          <b>The bar at the bottom is the part people get wrong.</b> Nearly half the
          conversation belongs in O. The first four phases exist to earn the right to have that
          discussion.
        </>
      }>
        <Radio />
      </Figure>

      <p>
        One change worth making to the original framework: treat a{" "}
        <b>performance budget and an observability plan as requirements</b>, named in R, not as
        optimisations discovered in O. &ldquo;LCP under 2.5 seconds on a mid-range Android on
        4G&rdquo; is a requirement — it constrains your rendering strategy before you have drawn
        a single box. Saved for the end, it becomes a wish.
      </p>

      <Callout kind="good" title="How to use R well">
        <p>
          Spending ten percent of the time on requirements feels like stalling. It is the
          opposite: every question you ask narrows the design and makes the next forty minutes
          cheaper. <em>Does this need to work offline? Is it indexed by Google? How many items in
          the list — fifty or fifty thousand?</em> Each answer eliminates whole branches of the
          design space.
        </p>
      </Callout>

      <h2>Where to go next</h2>
      <p>
        The four deep dives cover the decisions that come up in almost every design. The three
        worked examples then show the same framework producing three very different systems.
      </p>

      <div className="cards">
        {NEXT.map((c) => (
          <Link className="card" to={c.to} key={c.to}>
            <div className="card-num">{c.num}</div>
            <div className="card-title">{c.title}</div>
            <div className="card-desc">{c.desc}</div>
          </Link>
        ))}
      </div>
    </Page>
  );
}
