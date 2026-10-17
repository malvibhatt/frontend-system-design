import { Page, Figure, Callout, Table } from "../components/Doc.jsx";
import CacheLifecycle from "../diagrams/CacheLifecycle.jsx";
import Optimistic from "../diagrams/Optimistic.jsx";

export default function Caching() {
  return (
    <Page
      eyebrow="Deep dive 03"
      title="Caching and stale data"
      lede="A cache is a deliberate decision to accept a possibly-wrong answer in exchange for a much faster one. Designing a cache is deciding exactly how wrong you are willing to be, and for how long."
    >
      <p>
        Which means the first question is never &ldquo;should I cache this?&rdquo;. It is
        &ldquo;how out of date is this allowed to be before it does harm?&rdquo; That number is a
        product decision, not a technical one, and once you have it the technical choices mostly
        fall out.
      </p>

      <Table
        strongFirst
        head={["Kind of data", "Acceptable staleness", "In practice"]}
        rows={[
          ["Account balance, stock level, seat availability", "Zero: show the truth or show nothing", "No cache, or cache plus a live channel. Being wrong here costs money."],
          ["Live telemetry, vehicle positions", "A few seconds", "Push transport; cache only to survive reconnects"],
          ["A social feed", "Seconds to a minute", "Stale-while-revalidate. Nobody is harmed by a 20-second-old post."],
          ["Search suggestions", "Minutes", "Cache hard and locally: the same prefix gives the same answers"],
          ["User profile, settings, permissions", "Until the user changes them", "Cache indefinitely, invalidate on mutation"],
          ["Country list, currency codes, icons", "Days", "Cache aggressively; version it in the URL"],
        ]}
      />

      <h2>The life of a cache entry</h2>
      <p>
        Modern server-state libraries all work the same way, and the pair of settings people
        confuse hardest is <code>staleTime</code> and <code>gcTime</code> (older versions called
        it <code>cacheTime</code>). They answer completely different questions.
      </p>

      <Figure caption={
        <>
          <b>The middle zone is the whole trick.</b> Stale does not mean unusable. It means
          &ldquo;show it immediately, and go check.&rdquo;
        </>
      }>
        <CacheLifecycle />
      </Figure>

      <p>
        The default <code>staleTime</code> in most libraries is <b>zero</b>, which means every
        mount triggers a background refetch. That is a safe default and rarely the right one. If
        the country list cannot change during a session, a <code>staleTime</code> of{" "}
        <code>Infinity</code> removes every one of those requests and changes nothing the user
        can perceive.
      </p>

      <h2>Stale-while-revalidate</h2>
      <p>
        This is the dominant caching pattern on the frontend, and it is worth naming precisely:
        <b> serve the cached copy immediately, fetch a fresh one in the background, swap it in
        when it arrives.</b> The user gets a zero-latency first paint and self-correcting data,
        and the cost is a brief window where the screen shows something slightly old.
      </p>
      <p>
        It exists at two layers, which is a nice thing to point out in an interview because
        people usually only know one:
      </p>
      <ul>
        <li>
          <b>In HTTP</b>, as a response header, <code>Cache-Control: max-age=60,
          stale-while-revalidate=600</code>. For ten minutes after expiry, the browser or CDN
          serves the stale copy instantly and revalidates behind the scenes. No JavaScript involved.
        </li>
        <li>
          <b>In your query cache</b>, as the stale state in the diagram above. Same idea, but it
          can be invalidated by application events, which HTTP cannot.
        </li>
      </ul>

      <h2>Invalidation: three triggers, not one</h2>
      <p>
        &ldquo;Cache invalidation is hard&rdquo; is usually quoted as a joke. It is hard because
        people only implement the first of these three:
      </p>
      <ol>
        <li>
          <b>Time.</b> It has been N seconds, assume it moved on. Weakest signal, and the only one
          most people configure.
        </li>
        <li>
          <b>Interaction.</b> The window regained focus, the network came back, the component
          remounted. The user is looking again. This is the moment to check, and it is free.
        </li>
        <li>
          <b>Mutation.</b> You just changed something, so you <em>know</em> which cached entries
          are now wrong. Invalidate those keys precisely. This is the strongest signal and the
          one that keeps a UI coherent, delete a post and the feed that contained it must be
          invalidated too, or the user deletes something that stays on screen.
        </li>
      </ol>

      <Callout kind="warn" title="Where this goes wrong in practice">
        <p>
          A mutation that updates one entry but forgets a second view of the same data. The
          sidebar counter still says 12 after you deleted an item. Fixing it after the fact is
          whack-a-mole; the structural fix is to make cache keys describe the data
          (<code>['posts', userId]</code>) so you can invalidate a whole family at once rather
          than hunting down each screen.
        </p>
      </Callout>

      <h2>Optimistic updates</h2>
      <p>
        The strongest version of &ldquo;answer from closer to the user&rdquo; is not to ask at all,
        write the answer you expect straight into the cache, then reconcile.
      </p>

      <Figure caption={
        <>
          <b>Step 1 is the one that gets skipped.</b> Without the snapshot there is nothing to
          roll back to, and the failure path quietly becomes &ldquo;leave the wrong value on
          screen.&rdquo;
        </>
      }>
        <Optimistic />
      </Figure>

      <p>
        Use it where success is overwhelmingly likely and the action is reversible. Avoid it
        where being wrong is expensive or public, payments, deletions, anything another person
        sees immediately. And be careful with rapid repeated actions: a user double-tapping a
        like button can produce two in-flight mutations whose responses arrive out of order, so
        cancel any outgoing refetch for that key before applying the optimistic write.
      </p>

      <h2>HTTP caching you still need</h2>
      <p>
        Your query cache handles data. Your <em>assets</em> are cached by rules you set at build
        and deploy time, and the modern setup is simple enough to state in two lines:
      </p>
      <Table
        strongFirst
        head={["What", "Header", "Why"]}
        rows={[
          ["Hashed build assets (app.4f2a9.js)", "Cache-Control: public, max-age=31536000, immutable", "The filename changes when the content changes, so it can never be wrong. Cache it for a year."],
          ["index.html", "Cache-Control: no-cache", "Must be revalidated every time. It is what points at the hashed assets."],
          ["API responses", "max-age, often with stale-while-revalidate", "Per-endpoint decision, driven by the staleness table above."],
        ]}
      />
      <p>
        <code>no-cache</code> does not mean &ldquo;do not cache&rdquo;; it means &ldquo;cache it,
        but revalidate before using it.&rdquo; The one that means do not store anything is{" "}
        <code>no-store</code>. Mixing these up is a classic interview stumble.
      </p>

      <h2>Surviving a reload</h2>
      <p>
        Everything above lives in memory and dies on refresh. Persisting it is a separate decision
        with three realistic options:
      </p>
      <Table
        strongFirst
        head={["", "Good for", "Watch out"]}
        rows={[
          ["localStorage", "Small, simple values: theme, last-used filter, a draft", "Synchronous: it blocks the main thread. ~5 MB. Strings only. Never put tokens here."],
          ["IndexedDB", "Real datasets: cached lists, offline queues, attachments", "Asynchronous and awkward by hand; use a wrapper. This is where a persisted query cache belongs."],
          ["Service worker + Cache API", "Making the app shell and assets work offline", "A deployment concern: a badly scoped service worker can serve a stale app for days."],
        ]}
      />
      <p>
        Persisting a query cache to IndexedDB is what makes an app open instantly on a second
        visit: the shell renders from cache with real data already in it, and revalidation happens
        behind the scenes. It is the same stale-while-revalidate idea, extended across sessions.
      </p>

      <Callout kind="why" title="Why this matters in an interview">
        <p>
          Caching questions are rarely &ldquo;name a cache.&rdquo; They are &ldquo;the user edits
          this, what happens to every other screen showing it?&rdquo; A strong answer names the
          key, says which entries become invalid, and admits what the user briefly sees in between.
        </p>
      </Callout>
    </Page>
  );
}
