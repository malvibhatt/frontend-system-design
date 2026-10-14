import { Link } from "react-router-dom";
import { Page, Figure, Callout, Table } from "../../components/Doc.jsx";
import FeedRender from "../../diagrams/FeedRender.jsx";
import FeedList from "../../diagrams/FeedList.jsx";

export default function NewsFeed() {
  return (
    <Page
      eyebrow="Worked example 05"
      title="Design a news feed"
      lede="An infinite list of posts with authors, images, likes and comments. The classic question — and the one where rendering strategy and pagination decide almost everything else."
    >
      <h2>R — Requirements</h2>
      <p>
        Four questions change this design completely. Ask them first, and say out loud what each
        answer rules out.
      </p>
      <Table
        strongFirst
        head={["Question", "Answer here", "What it decides"]}
        rows={[
          ["Is the feed public and indexed by search engines?", "Yes", "Server rendering becomes near-mandatory — a crawler will not wait for your JavaScript"],
          ["How stale may a post be?", "Up to a minute is fine", "No live transport needed. Polling through the query cache is enough."],
          ["How long is the list?", "Effectively unbounded", "Cursor pagination, and a plan for DOM size"],
          ["What can the user do to a post?", "Like, comment", "Optimistic updates, and a cache-invalidation story"],
        ]}
      />
      <p>
        Non-functional: LCP under 2.5s at p75 on a mid-range Android over 4G, works at 320px wide,
        keyboard and screen-reader navigable, images are the dominant payload.
      </p>

      <h2>A — Architecture</h2>
      <p>
        The single most consequential decision on this page is whether the first screen of posts
        arrives <em>in</em> the HTML or is fetched after the JavaScript boots.
      </p>

      <Figure caption={
        <>
          <b>A full second of difference, from one decision.</b> Client-rendered, nothing can
          paint until download → run → fetch has completed in sequence. Server-rendered, the
          first response already contains the posts.
        </>
      }>
        <FeedRender />
      </Figure>

      <p>
        So: <b>server-render the first page of the feed, client-render everything after it.</b>{" "}
        Page one is what the crawler indexes and what LCP measures. Pages two onward are behind a
        scroll, invisible to crawlers, and belong to the client.
      </p>
      <p>
        Note what hydration costs in that second lane. The page is <em>visible</em> at 700ms and
        not <em>interactive</em> until 1200ms — a window where a tap does nothing. That gap is
        what streaming SSR and React Server Components attack, by hydrating the interactive parts
        first and never shipping JavaScript for the parts that are purely presentational.
      </p>

      <h2>D — Data model</h2>
      <p>
        Two decisions matter more than the field list. First, <b>normalise by post id</b> rather
        than storing a nested array per page — the same post can appear in the feed, on a profile
        and in a search result, and three copies will disagree the moment someone likes it.
        Second, <b>keep the cursor with the page</b>, not in component state, so a remount
        resumes rather than restarts.
      </p>
      <Table
        strongFirst
        head={["Entity", "Shape", "Why"]}
        rows={[
          ["Post", "id, authorId, createdAt, body (rich text), media[], likeCount, likedByMe, commentCount", "likedByMe is per-viewer and is what optimistic updates toggle"],
          ["Author", "Stored once by id, referenced by posts", "A prolific author appears 30 times in one feed"],
          ["Feed page", "{ items: PostId[], nextCursor }", "Ids, not objects — the objects live in the normalised store"],
        ]}
      />
      <p>
        Store the body as structured rich text rather than an HTML string. Mentions, links and
        hashtags are then data you render, not markup you must sanitise — which removes an entire
        class of XSS risk rather than mitigating it.
      </p>

      <h2>I — Interface</h2>
      <p>
        <b>REST with cursor pagination</b>, polled through the query cache. The transport argument
        is short here: nothing on this screen needs to be live, so nothing justifies a held
        connection.
      </p>
      <ul>
        <li><code>GET /feed?after=&lt;cursor&gt;&amp;limit=20</code> → <code>&#123; items, nextCursor &#125;</code></li>
        <li><code>POST /posts/:id/like</code> — idempotent, so a retry cannot double-count</li>
        <li>A <code>staleTime</code> of about 60s, with refetch on window focus</li>
      </ul>
      <p>
        Cursors rather than <code>?page=2</code> is a correctness fix, not an optimisation: new
        posts arrive at the top constantly, so an offset computed a moment ago now points
        somewhere else and the user silently skips items. This is covered in{" "}
        <Link to="/apis">APIs &amp; transports</Link>.
      </p>

      <h2>O — Optimisations that actually matter here</h2>

      <h3>Keeping the DOM small</h3>
      <Figure caption={
        <>
          <b>Spacers are the trick.</b> They keep the scrollbar honest while the DOM holds only
          what is visible, so scrolling to post 9,000 costs the same as scrolling to post 20.
        </>
      }>
        <FeedList />
      </Figure>
      <p>
        One honest caveat: this is straightforward for fixed-height rows and genuinely fiddly for
        a feed, where a post with three images is far taller than a one-line text post. If
        measurement is getting complicated, <code>content-visibility: auto</code> with{" "}
        <code>contain-intrinsic-size</code> gets you most of the benefit for one line of CSS — the
        browser skips rendering work for off-screen items while keeping them in the DOM. Reach for
        full virtualisation when the item count runs to thousands, not hundreds.
      </p>

      <h3>Images are the payload</h3>
      <p>
        On a feed, images are almost always the LCP element and the bulk of the bytes. Serve
        modern formats (AVIF, WebP) with <code>srcset</code> so a phone never downloads a desktop
        image, always set <code>width</code> and <code>height</code> so nothing shifts as they
        load — that is CLS — and lazy-load everything except the first one or two.{" "}
        <b>Mark the first image <code>fetchpriority=&quot;high&quot;</code> and do not lazy-load
        it</b>: it is your LCP element, and lazy-loading it delays the exact thing being measured.
      </p>

      <h3>Likes, optimistically</h3>
      <p>
        Toggle the count on click, snapshot first, roll back on failure. The subtlety is that one
        post may be on screen in two places, which is what the normalised store is for — update
        the entity, not the list item. The full pattern is in{" "}
        <Link to="/caching">Caching &amp; stale data</Link>.
      </p>

      <h3>New posts while the user reads</h3>
      <p>
        Never prepend content to a list someone is reading — it pushes the thing they were
        halfway through off the screen. Show a <em>&ldquo;12 new posts&rdquo;</em> pill at the top
        and let them choose. This is a design decision that prevents a layout-shift problem, which
        is usually cheaper than solving it technically.
      </p>

      <Callout kind="why" title="What makes this system different">
        <p>
          It is <b>read-heavy, public and content-first</b>. Those three facts put server
          rendering, image strategy and DOM size at the centre and push transport choice to the
          margin. Compare that with the{" "}
          <Link to="/case/realtime">fleet dashboard</Link>, where the page is behind a login, SEO
          is irrelevant, and the transport is the whole design.
        </p>
      </Callout>
    </Page>
  );
}
