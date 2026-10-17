import { Link } from "react-router-dom";
import { Phase, InOut, Decision, Eg, Traps, Artifact, Code } from "../../components/Method.jsx";
import { Figure, Callout } from "../../components/Doc.jsx";
import RouteMap from "../../diagrams/RouteMap.jsx";
import BlastRadius from "../../diagrams/BlastRadius.jsx";

export default function Shape() {
  return (
    <Phase n={2}>
      <InOut
        inputs={[
          "The scope boundary from phase 1",
          "The four numbers",
          "The audience split, if there is one",
        ]}
        outputs={[
          "A route map, with a rendering strategy per route",
          "Component boundaries drawn by blast radius",
          "Where the loading and error boundaries sit",
        ]}
      />

      <p>
        Shape is where most people start, and starting here is why so many designs drift. With
        phase 1 done you are not inventing structure. You are reading it off the constraints. The
        audience split tells you the rendering strategy; the volume number tells you which lists
        need pagination; the correctness classes tell you which screens cannot show stale data.
      </p>

      <h2>The decisions</h2>

      <Decision id="2.1" title="Write the URLs before you write a component">
        <p>
          A route map is the cheapest possible architecture document. It forces you to name every
          screen, it exposes screens nobody thought about, and it makes you decide, early, what
          belongs in the URL.
        </p>
        <p>
          That last part matters more than it looks. Anything in the URL is shareable, survives a
          refresh, and gets the back button for free. On a B2B tool where people send each other
          links all day, a filtered list that cannot be linked to is a missing feature, not a
          missing nicety.
        </p>
      </Decision>

      <Figure caption={
        <>
          <b>Two audiences, two strategies.</b> This split is not a technical preference. It
          falls directly out of the phase 1 observation that the payment page has a wider audience
          than the app.
        </>
      }>
        <RouteMap />
      </Figure>

      <Eg>
        <p>
          The <code>/pay/:token</code> route is the interesting one. It is opened by someone who
          has never used Ledgerline, possibly on a bad connection, possibly on a locked-down
          device, and it is a legal document about money. It must render correctly with no
          JavaScript at all, so it is server-rendered, and the interactive pay button is the only
          thing that hydrates.
        </p>
        <p>
          Everything behind the login is the opposite: repeat users, known devices, long sessions,
          no crawler. Client rendering is the right default there, and the first paint cost is
          paid once per session rather than once per visit.
        </p>
      </Eg>

      <Decision id="2.2" title="Pick the rendering strategy per route, not per app"
        options={[
          { k: "SSG", v: "Same for everyone, changes rarely. Marketing, docs, terms. Rebuild to change." },
          { k: "SSR", pick: true, v: "Public, personalised or legal content that must be correct before JavaScript runs. The payment page." },
          { k: "CSR", v: "Behind a login, no crawler, long session. The whole app shell. The blank-screen cost is paid once." },
          { k: "Streaming / RSC", v: "A page where one slow query would otherwise hold up everything else. Worth it when you can name the slow query." },
        ]}
      >
        <p>
          &ldquo;Are we an SSR app or a CSR app?&rdquo; is the wrong question, and answering it
          app-wide is how teams end up server-rendering a settings page nobody can reach without
          logging in.
        </p>
      </Decision>

      <Decision id="2.3" title="Draw component boundaries by blast radius">
        <p>
          The instinct is to split components the way the design looks. A box in the mockup
          becomes a component. That produces a tree that matches the picture and fights the
          behaviour. The better question is: <b>when this changes, what must change with it?</b>
        </p>
      </Decision>

      <Figure caption={
        <>
          <b>Same component tree, different state placement.</b> The boundary that matters is not
          where the visual box is. It is where the state is held.
        </>
      }>
        <BlastRadius />
      </Figure>

      <p>
        Two rules fall out of this, and they cover most cases. <b>Push state down</b> until it
        lives as close as possible to what actually uses it. And <b>pass rendered children
        through</b> rather than re-rendering them: a component that receives
        <code> children</code> does not re-render those children when its own state changes,
        which is the cheapest optimisation in React and requires no memoisation at all.
      </p>

      <Eg>
        <p>
          The Ledgerline editor has a real version of this problem. An invoice with forty line
          items, a user tabbing through amount fields, and an activity log fetched from a separate
          endpoint. With draft state at the top, every keystroke re-renders the activity log.
        </p>
        <Code>{`<InvoiceEditor>                 // holds: invoice id, saved snapshot
  <Toolbar />                   // status + actions
  <ClientPicker />              // changes maybe once
  <LineItemsProvider>           // holds: the editable draft
    <LineItems />               // re-renders on keystroke
    <Totals />                  // derived, re-renders too, correctly
  </LineItemsProvider>
  <ActivityLog />               // never re-renders from typing
</InvoiceEditor>`}</Code>
        <p>
          Notice that <code>Totals</code> deliberately sits <em>inside</em> the boundary. It must
          re-render. It depends on the thing that changed. Blast radius is not about minimising
          re-renders, it is about making them match the data.
        </p>
      </Eg>

      <Decision id="2.4" title="Decide where failure and waiting are allowed to show">
        <p>
          A loading or error boundary is a decision about how much of the screen is affected when
          one region is slow or broken. Put one around each region that can fail independently,
          and the test for &ldquo;independently&rdquo; is simple: does it have its own data source?
        </p>
        <p>
          On the Ledgerline editor the activity log is fetched separately, so if that endpoint is
          down the correct outcome is an activity panel showing a retry button, and an invoice the
          user can still edit and send. One boundary, drawn in the right place, is the difference
          between a degraded feature and a blank page.
        </p>
      </Decision>

      <Decision id="2.5" title="Decide what ships on the first load"
        options={[
          { k: "Always loaded", pick: true, v: "The shell, routing, auth, design-system primitives. Everything every session needs." },
          { k: "Route-level lazy", v: "Settings, reports, admin, real screens that most sessions never open." },
          { k: "Interaction-lazy", v: "The PDF preview, the rich-text editor, a date-range picker. Heavy and conditional." },
          { k: "Never on the client", v: "PDF generation, tax calculation rules, anything the server should own." },
        ]}
      >
        <p>
          Your bundle is your import graph, not your page, naming a component in your route file
          is enough to pull it into the first download. Deciding the tiers now, while the route
          map is in front of you, is far easier than reverse-engineering it from a bundle analyser
          in six months.
        </p>
      </Decision>

      <Callout kind="why" title="In an interview">
        <p>
          Sketch the screen first and talk while you draw. It gives the interviewer something to
          correct, which is the fastest way to find out what they actually want to discuss. Then
          name the component boundaries <em>and the reason for each one</em>. &ldquo;I would split
          here because the draft changes on every keystroke and the activity log should not care&rdquo;
          is a far stronger sentence than any list of component names.
        </p>
      </Callout>

      <h2>Traps in this phase</h2>
      <Traps items={[
        <>Choosing one rendering strategy for the whole application, then defending it per route.</>,
        <>Keeping filters, tabs and pagination in component state. The link becomes unshareable and the back button starts lying.</>,
        <>Splitting components to match the visual design, then reaching for <code>memo</code> to undo the damage.</>,
        <>One error boundary at the root. Any failure anywhere blanks the whole application.</>,
        <>Designing the happy screen only. Every route needs a loading, empty, error and no-permission state, and empty is the one that is always forgotten.</>,
      ]} />

      <Artifact items={[
        "A route map: every URL, with its rendering strategy and what lives in its query string",
        "A component tree for the two or three most complex screens, with state placement marked",
        "Boundary placement: which regions fail and load independently",
        "A loading tier for every part of the app: always, on route, on interaction, never",
      ]} />

      <p>
        You now know what the screens are. Phase 3 asks the question that decides how they
        behave: <Link to="/method/data">what data is on them, and who owns it?</Link>
      </p>
    </Phase>
  );
}
