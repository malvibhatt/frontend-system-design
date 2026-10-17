import { Page, Figure, Callout, Table } from "../components/Doc.jsx";
import StateDecision from "../diagrams/StateDecision.jsx";
import Composition from "../diagrams/Composition.jsx";

export default function Patterns() {
  return (
    <Page
      eyebrow="Deep dive 01"
      title="Design patterns, and how to pick one"
      lede="A pattern is an answer to a question about change: what is likely to change here, and what should not have to change with it. If you cannot name the change you are protecting against, you do not need the pattern yet."
    >
      <p>
        That test is worth keeping, because most pattern misuse is enthusiasm rather than
        ignorance. A headless component library built for one dropdown, a Redux store holding
        three booleans, a micro-frontend split across a team of four. Each is a sensible pattern
        applied to a change that was never going to happen.
      </p>

      <h2>Where state lives</h2>
      <p>
        This is the decision you make most often and the one that goes wrong most expensively.
        The useful thing is not the list of options but the <em>order</em> you consider them in,
        which runs cheapest-first.
      </p>

      <Figure caption={
        <>
          <b>Stop at the first yes.</b> Most state never gets past the first three questions,
          and that is the correct outcome, not a sign you are under-engineering.
        </>
      }>
        <StateDecision />
      </Figure>

      <p>Two of these deserve more than a line:</p>

      <h3>The URL is a state container</h3>
      <p>
        Filters, the active tab, the sort order, the page number, the selected row, all of this
        is state, and putting it in <code>useSearchParams</code> rather than
        <code> useState</code> buys you four things for free: the page survives a refresh, it can
        be bookmarked, it can be sent to a colleague, and the browser back button does the right
        thing. On a data-heavy dashboard this is the difference between a tool people can share
        links to and one they cannot.
      </p>

      <h3>Context is not a state manager</h3>
      <p>
        Context is a <em>transport</em> mechanism. It moves a value down the tree without prop
        drilling. It has no subscription model: when the value changes, every consumer re-renders,
        whether or not it cares about the part that changed. That is perfectly fine for a theme or
        the current user, and quietly disastrous for a value that updates at 30 Hz. An external
        store solves exactly this, by letting a component subscribe to one slice.
      </p>

      <Callout kind="why" title="Why this matters in an interview">
        <p>
          &ldquo;Where would you keep that?&rdquo; is a question you will get asked. Answering
          &ldquo;Redux&rdquo; or &ldquo;Context&rdquo; reflexively reads as a habit. Walking down
          two or three of these questions out loud, <em>it comes from the server, so it belongs
          in the query cache, not in component state</em>, reads as a decision.
        </p>
      </Callout>

      <h2>How components compose</h2>
      <p>
        The second recurring decision is how much freedom to hand the person using your component.
        There are three positions, and they are an escalation rather than a menu.
      </p>

      <Figure caption={
        <>
          <b>Each step right buys flexibility and spends someone else&rsquo;s effort.</b> The
          headless version is the most powerful and the easiest to get wrong, because
          accessibility moves out of your component and into every consumer.
        </>
      }>
        <Composition />
      </Figure>

      <p>
        The old presentational/container split, &ldquo;dumb&rdquo; components for markup,
        &ldquo;smart&rdquo; wrappers for data, is largely gone, and it is worth knowing why,
        because it gets mentioned in interviews. It existed so that data-fetching logic could be
        reused across components. Hooks do that directly and better. What survives is the
        underlying instinct: <b>keep components that render and components that fetch separate</b>,
        which is now expressed as a custom hook rather than a wrapper component.
      </p>

      <h2>Patterns at application scale</h2>
      <p>
        These are the ones that come up when the question is about teams and deployment rather
        than components.
      </p>

      <Table
        strongFirst
        head={["Pattern", "The problem it solves", "Use it when", "What it costs"]}
        rows={[
          [
            "Micro-frontends",
            "Independent teams blocked by a shared release train",
            "Several teams own genuinely separate product areas and need to ship on their own cadence",
            "Duplicated dependencies, cross-app version drift, harder debugging, a shared-shell contract someone must own",
          ],
          [
            "Design system / shared library",
            "The same button reinvented in nine places, inconsistently",
            "More than one app or team renders the same concepts",
            "Versioning and release discipline; a breaking change now has consumers",
          ],
          [
            "Backend-for-frontend (BFF)",
            "The client stitching together five services and over-fetching from all of them",
            "Your UI needs a shaped, aggregated view that no single service owns",
            "Another deployable to own; can become a dumping ground for business logic",
          ],
          [
            "Feature flags",
            "Risky releases and long-lived branches",
            "You want deploy and release to be separate events",
            "Flag debt: every flag is a branch in your code that someone must later delete",
          ],
        ]}
      />

      <Callout kind="warn" title="The honest answer on micro-frontends">
        <p>
          They are an <em>organisational</em> solution wearing a technical costume. They solve
          &ldquo;these teams keep blocking each other.&rdquo; If that sentence is not true of your
          organisation, a monorepo with a shared component library gives you most of the benefit
          at a fraction of the cost. Saying this in an interview, naming the condition under
          which the pattern pays for itself, is stronger than describing module federation.
        </p>
      </Callout>

      <h2>Three cross-cutting patterns worth knowing</h2>

      <h3>Optimistic UI</h3>
      <p>
        Update the screen as though the request succeeded, send it, and roll back if it fails.
        Use it when success is overwhelmingly likely and the action is reversible, likes,
        toggles, reordering, adding a comment. Do not use it where being wrong is expensive or
        embarrassing: payments, deletions, anything another person sees immediately. The pattern
        is cheap to add and easy to get subtly wrong, because the rollback path is the one nobody
        tests.
      </p>

      <h3>Error and suspense boundaries</h3>
      <p>
        A boundary is a decision about <em>blast radius</em>: when this subtree fails or is
        waiting, how much of the screen should be affected? Put a boundary around each
        independently-failing region, one per widget on a dashboard, not one around the whole
        app, so a failing chart shows a retry button instead of blanking the page.
      </p>

      <h3>An adapter at the transport boundary</h3>
      <p>
        Translate API shapes into your own types at exactly one place, as the data comes in. It
        sounds like ceremony until the backend renames a field, and the change is one file rather
        than forty components. This is the practical version of the transport layer in the
        architecture diagram.
      </p>

      <Callout kind="good" title="A rule that holds up">
        <p>
          Reach for the simplest pattern that solves the change you can actually name, and
          upgrade when a second real use case arrives. Patterns adopted in anticipation are the
          ones that calcify. You pay the cost immediately and the benefit never arrives.
        </p>
      </Callout>
    </Page>
  );
}
