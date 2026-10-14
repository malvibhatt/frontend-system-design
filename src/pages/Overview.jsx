import { Page, Figure, Callout } from "../components/Doc.jsx";
import PageLoad from "../diagrams/PageLoad.jsx";
import BootSequence from "../diagrams/BootSequence.jsx";

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

      <p>
        Two facts from this diagram do most of the work in a design discussion:
      </p>
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

      <div className="placeholder">
        The rest of this page — the request/response lifecycle, the client architecture diagram,
        and the RADIO framework — is written in step 2 of the build.
      </div>
    </Page>
  );
}
