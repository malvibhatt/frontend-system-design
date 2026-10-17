import { Link } from "react-router-dom";
import { Phase, InOut, Decision, Eg, Traps, Artifact, Code } from "../../components/Method.jsx";
import { Callout } from "../../components/Doc.jsx";

export default function Frame() {
  return (
    <Phase n={1}>
      <InOut
        inputs={[
          "A one-line brief, usually vague",
          "Someone who knows what the business wants",
          "No code, no diagrams, no opinions yet",
        ]}
        outputs={[
          "A scoped feature list, with exclusions named",
          "Four numbers",
          "A correctness class for each piece of data",
        ]}
      />

      <p>
        Nobody skips this phase deliberately. It gets skipped because it does not feel like
        work. There is nothing to draw and nothing to type, so the instinct is to get to the
        diagram. But every decision in the five phases that follow is downstream of an answer you
        either have or are about to invent. Inventing them quietly is the single most expensive
        thing you can do here.
      </p>
      <p>
        The job of this phase is to turn a sentence into constraints. You are done when you can
        say what you are <em>not</em> building and you have numbers instead of adjectives.
      </p>

      <Eg>
        <p>
          <b>The brief:</b> &ldquo;We need invoicing. Agencies send invoices to their clients and
          chase the ones that do not get paid.&rdquo;
        </p>
        <p>
          That is all you get. Everything below is the work of turning it into something you can
          design against, and we will keep building on it through all six phases until there is a
          complete design at the end.
        </p>
      </Eg>

      <h2>The decisions</h2>

      <Decision id="1.1" title="What is in the first version, and what is explicitly not">
        <p>
          Scope is not a list of features, it is a <b>boundary</b>. A list only tells you what
          someone remembered to mention. A boundary tells you what to do when something new is
          suggested in week three.
        </p>
        <p>
          Write three to five core capabilities, then, this is the part people skip, write the
          things a reasonable person would assume are included and that are not. Saying it out
          loud now costs a sentence. Discovering it later costs a rewrite.
        </p>
      </Decision>

      <Eg>
        <p><b>In:</b></p>
        <ul>
          <li>Create and edit an invoice with line items, tax and totals</li>
          <li>Send it; the client opens a public link and pays</li>
          <li>A list of invoices, filterable by status, client and date</li>
          <li>See what is outstanding and how overdue it is</li>
        </ul>
        <p><b>Explicitly not, in v1:</b> recurring invoices, multi-currency, partial payments,
        expense tracking, a mobile app, an accounting-software integration.</p>
        <p>
          Two of those exclusions will change the design if they come back,{" "}
          <b>multi-currency</b> changes every money field and every total, and{" "}
          <b>partial payments</b> turns a boolean into a ledger. Those are worth flagging now as
          &ldquo;cheap to design for, expensive to retrofit,&rdquo; even while staying out of v1.
        </p>
      </Eg>

      <Decision id="1.2" title="Who uses it, on what, and under what conditions">
        <p>
          This is not a persona exercise. You are after the four facts that constrain engineering:
          device class, network, locale, and the accessibility floor. Each one eliminates options
          later.
        </p>
        <div className="opts">
          <div className="opt"><div className="opt-k">Device</div>
            <div>Desktop-first B2B tool, or a phone in a warehouse? Decides layout strategy, touch targets, and whether 3G is a real case or a theoretical one.</div></div>
          <div className="opt"><div className="opt-k">Network</div>
            <div>Office wifi or hotel wifi? Decides how hard you work on payload size, and whether offline is a feature or a nicety.</div></div>
          <div className="opt"><div className="opt-k">Locale</div>
            <div>One country or twelve? Decides i18n, date and number formatting, and, for money, whether currency is a field or an assumption.</div></div>
          <div className="opt"><div className="opt-k">Accessibility</div>
            <div>WCAG 2.2 AA is the sane default. Public sector or enterprise procurement makes it contractual, which changes it from a goal into a test.</div></div>
        </div>
      </Decision>

      <Eg>
        <p>
          Agency owners and bookkeepers, on laptops, on reasonable connections, during working
          hours. One currency and one locale in v1, but because invoices are legal documents
          read by people outside the company, the <b>public payment page</b> has a much wider
          audience than the app does: any device, any network, any assistive technology.
        </p>
        <p>
          That split matters more than anything else in this phase. We are not designing one
          application. We are designing a <b>private tool</b> and a <b>public document</b>, and
          they will get different answers in every phase that follows.
        </p>
      </Eg>

      <Decision id="1.3" title="The four numbers">
        <p>
          Leave this phase with four numbers written down. Not ranges, not adjectives, numbers
          you can later be wrong about, which is the point. An unwritten assumption cannot be
          checked.
        </p>
        <div className="opts">
          <div className="opt"><div className="opt-k">Staleness</div>
            <div>How many seconds may this data be out of date before someone is harmed? This single number decides your entire transport choice in phase 4.</div></div>
          <div className="opt"><div className="opt-k">Volume</div>
            <div>How many rows, at the 95th-percentile customer, not the average one. Fifty and fifty thousand are different products.</div></div>
          <div className="opt"><div className="opt-k">Concurrency</div>
            <div>How many people are in here at once, and do two of them ever edit the same thing? Decides whether you need conflict handling at all.</div></div>
          <div className="opt"><div className="opt-k">Budget</div>
            <div>The performance target, as a metric at a percentile on a named device. &ldquo;LCP under 2.5s at p75 on a mid-range laptop&rdquo; is a budget. &ldquo;Fast&rdquo; is a wish.</div></div>
        </div>
      </Decision>

      <Eg>
        <Code>{`staleness   invoice list      60s is fine, nobody is harmed by a stale list
            payment status     near-zero, this is money changing hands
volume      invoices/tenant   p95 ≈ 4,000/year; biggest customer ≈ 30,000
concurrency 1-3 people per tenant; two people editing one invoice is rare
            but must not silently lose data
budget      app:    LCP ≤ 2.5s, INP ≤ 200ms at p75
            public: LCP ≤ 1.5s at p75 on a mid-range phone over 4G`}</Code>
        <p>
          Look at what two of those numbers have already decided. Four thousand rows means the
          invoice list needs real pagination, not a client-side filter over everything. And a
          near-zero staleness tolerance on payment status means that one field cannot be served
          from a cache the way the rest of the row can.
        </p>
      </Eg>

      <Decision id="1.4" title="What must never be wrong">
        <p>
          This is the decision most frontend designs never make explicitly, and it is the one that
          prevents the worst class of bug. Sort your data into three correctness classes, because
          each gets a different treatment in phases 4 and 5.
        </p>
        <div className="opts">
          <div className="opt pick"><div className="opt-k">Must be exact</div>
            <div>Money, legal identifiers, permissions. Never optimistic, never cached without a freshness check, never computed in two places. If you are unsure, show nothing rather than something.</div></div>
          <div className="opt"><div className="opt-k">Eventually right</div>
            <div>Counts, lists, dashboards, search results. Serve a cached copy immediately and correct it in the background. Being a few seconds old harms nobody.</div></div>
          <div className="opt"><div className="opt-k">Only has to look right</div>
            <div>Relative timestamps, avatars, placeholder states, animation. Approximate is fine; nobody audits &ldquo;2 minutes ago&rdquo;.</div></div>
        </div>
      </Decision>

      <Eg>
        <p>
          For Ledgerline the classification almost writes itself, and it is the reason this app
          will look different from a social feed:
        </p>
        <ul>
          <li><b>Exact</b>, line item amounts, tax, invoice total, paid/unpaid status, who may view an invoice</li>
          <li><b>Eventually right</b>, the invoice list, the outstanding-revenue figure on the dashboard, search</li>
          <li><b>Looks right</b>, &ldquo;sent 3 days ago&rdquo;, client avatars, the sparkline on the dashboard card</li>
        </ul>
        <p>
          Write this down now and phase 4 becomes almost mechanical: the first group gets no
          optimistic updates and no stale reads; the second group gets stale-while-revalidate; the
          third group gets whatever is cheapest.
        </p>
      </Eg>

      <Decision id="1.5" title="What is already decided for you">
        <p>
          Constraints are not obstacles to design around, they are inputs. Writing them down stops
          you proposing something that was never available. Ask about the team (how many people,
          for how long), the existing stack (a house component library you must use, a framework
          already chosen), the backend (does it exist yet, who owns the contract, how fast does it
          change), and the deadline that is actually real.
        </p>
        <p>
          A design that ignores a two-person team is not an ambitious design, it is a fictional one.
        </p>
      </Decision>

      <Callout kind="why" title="In an interview">
        <p>
          Spend ten percent of the time here and narrate it. &ldquo;Before I design anything I want
          four numbers&rdquo; is one of the strongest openings available, because it signals that you
          know the design is downstream of them. Then <em>use</em> them out loud later, &ldquo;we said
          thirty thousand rows, so the list cannot be client-filtered&rdquo;, which is what turns
          requirements-gathering from a ritual into a tool.
        </p>
      </Callout>

      <h2>Traps in this phase</h2>
      <Traps items={[
        <>Accepting &ldquo;it should be real-time&rdquo; without converting it into a number of seconds. Almost nobody means milliseconds; most people mean &ldquo;I should not have to refresh.&rdquo;</>,
        <>Designing for the average customer. Volume problems always arrive from the largest one, and they arrive as a support ticket, not a graph.</>,
        <>Treating failure as something to handle later. &ldquo;What happens when the payment provider is down&rdquo; is a requirement, not an edge case.</>,
        <>Letting the exclusions stay unspoken. If you did not say recurring invoices are out, someone believes they are in.</>,
        <>Collecting requirements and then not referring to them again. If a number never gets cited in a later phase, you did not need it, and if a decision cites no number, you guessed.</>,
      ]} />

      <Artifact items={[
        "A scope boundary: three to five capabilities, plus the exclusions you named out loud",
        "A user and device profile, including anything with a wider audience than the main app",
        "Four numbers: staleness, volume, concurrency, performance budget",
        "Every piece of data sorted into exact / eventually right / looks right",
        "The constraints you did not choose: team, stack, backend readiness, real deadline",
      ]} />

      <p>
        Phase 2 takes that boundary and turns it into screens. If you cannot yet say what the
        first screen is, that is fine, but if you cannot say what the four numbers are, go back,
        because <Link to="/method/shape">Shape</Link> will ask you for them immediately.
      </p>
    </Phase>
  );
}
