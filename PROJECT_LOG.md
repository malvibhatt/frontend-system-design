# Frontend System Design — project log

A self-study guide on frontend system design, built as a small React site.
This file records what was built, why the content choices were made, and the
conventions to follow when adding to it.

**Started:** 2026-10-14
**Repo:** https://github.com/malvibhatt/frontend-system-design

---

## Why this exists

The goal is to move from *having been in design discussions* to *being able to
design and defend a frontend system*. The gaps named at the start were:

- How a frontend loads, and how requests/responses interact with it
- Design patterns, and how to decide which to use
- GraphQL vs REST vs polling — and how to choose
- WebSocket vs server-sent events
- Client-side caching and dealing with stale data
- Observability tooling

Source material was a 2022 YouTube walkthrough of the **RADIO** framework
(Requirements → Architecture → Data model → Interface → Optimisations). The
framework was kept; much of the surrounding detail was out of date and replaced.

---

## What was modernised from the 2022 source

| Source said | This guide says | Why |
|---|---|---|
| MVC as the architecture | Server state vs client state | Frameworks already solve "view updates when model changes"; the real split today is data you own vs data you borrow |
| TTI as the headline metric | **INP** (replaced FID in March 2024), plus LCP and CLS | TTI was deprecated for being noisy; INP measures full interaction latency across a visit |
| HTTP/1 vs HTTP/2 at length | Compressed to a note; HTTP/3 and QUIC added | Not a decision you make — only a reason old advice no longer applies |
| "Apollo cache" as the caching answer | Layered model: HTTP cache → query cache → IndexedDB/SW, with stale-while-revalidate | Vendor-neutral and matches how caching is actually layered |
| webpack bundle splitting | Vite/Rollup; route-level splitting framed as cutting the import graph | Toolchain moved on; the import-graph framing explains *why* splitting works |
| SSR ≈ "use Next.js for SEO" | Full spectrum: CSR / SSG / ISR / SSR / streaming / RSC | Each is wrong in different situations |
| Observability ≈ "send to Datadog" | RUM at p75, source maps, OpenTelemetry trace propagation, sampling economics | The vendor matters far less than the practice |
| appcache, long-polling detail, localStorage for everything | Dropped or one line | Low value today; keeping them buries the important material |

---

## Stack

| Choice | Decision | Reason |
|---|---|---|
| Framework | **Vite + React 19** | Chosen over static HTML so the later practice screen can be interactive |
| Language | **JSX, not TSX** | It is prose and diagrams; types would add friction without catching anything |
| Routing | **react-router-dom, HashRouter** | Routes live after `#`, so no server rewrite rule is ever needed |
| Base path | `base: './'` in `vite.config.js` | `npm run build` output opens straight off disk |
| Styling | Plain CSS with design tokens | No build plugin, no dependency to rot; everything themeable from one block |
| Diagrams | **Hand-authored inline SVG** | No chart library. Colours are CSS variables, so diagrams follow light/dark |
| Deploy | **Vercel**, auto-detected as Vite | No `vercel.json` needed (HashRouter) |

Dependencies: `react`, `react-dom`, `react-router-dom`. That is the whole list.

---

## Structure

```
src/
├── routes.jsx          ← ONE list drives both router and sidebar
├── App.jsx             shell + routes + scroll reset
├── index.css           all design tokens, layout, light/dark, print styles
├── components/
│   ├── Sidebar.jsx     grouped, numbered nav
│   ├── ThemeToggle.jsx system / light / dark
│   └── Doc.jsx         Page, Figure, Callout, Table, Sheet, Numbers, Steps
├── diagrams/           19 diagrams + svg.jsx (shared Box/Arrow/arrowhead)
└── pages/
    ├── Overview.jsx         00  how a page loads, data path, architecture, RADIO
    ├── Patterns.jsx         01  state decision tree, composition, app-scale patterns
    ├── Apis.jsx             02  REST/GraphQL shape + four transports as timelines
    ├── Caching.jsx          03  staleTime vs gcTime, SWR, invalidation, optimistic
    ├── Observability.jsx    04  field vs lab, Core Web Vitals, tracing, sampling
    ├── cases/NewsFeed.jsx   05  read-heavy, public, content-first
    ├── cases/Realtime.jsx   06  push-heavy, private, long-lived
    ├── cases/Typeahead.jsx  07  latency-bound, interaction-dense
    ├── Cheatsheet.jsx       08  decision tables, numbers, build checklist
    └── Practice.jsx         09  STUB — not yet written
```

To add a page: create it under `pages/`, add one entry to `routes.jsx`. The
sidebar updates itself.

---

## Conventions

**Content**

- Every concept states the problem it solves and when *not* to use it
- Depth over breadth — skip legacy material so the important parts are not buried
- No "you'll be able to answer these questions" lists; the practice screen links
  back to concepts instead
- Plain prose, short paragraphs, no bullet dumps
- Recurring callout kinds: `why` (interview framing), `warn`, `good`, `stale`

**Diagrams**

- Max width **890px** — the figure frame's inner width is 896px, so anything
  wider scrolls
- Diagrams scroll **inside** the figure frame (`width: fit-content; max-width: 100%`),
  never horizontally on the page
- All colours via CSS variables (`--d-fill-1..4`, `--d-line`, `--d-text`)
- Reuse `Defs`, `Box`, `Arrow` from `diagrams/svg.jsx`
- Every diagram has a `role="img"` and an `aria-label`

**Layout**

- `--measure: 740px` caps prose for readable line length
- `--wide: 1020px` is the column; figures, tables and card grids span it

---

## Build history

Each step was its own branch, reviewed as a PR, and **squash-merged**.

| Step | Branch | What landed |
|---|---|---|
| 1 | *(initial commit)* | Vite scaffold, design system, Sidebar/ThemeToggle/Doc, `PageLoad` + `BootSequence` |
| 2 | `step-2-overview` (#1) | `RequestPath`, `ClientArchitecture`, `Radio`; full Overview + index cards |
| 3 | `step-3-deep-dives` (#2) | All four deep dives, 8 diagrams, `Table` gains `strongFirst` |
| 4 | `step-4-worked-examples` (#3) | Three case studies, 6 diagrams, side-by-side comparison table |
| 5 | `step-5-cheatsheet` (#4) | Cheatsheet + `Sheet`/`Numbers`/`Steps` primitives, print styles |

---

## Git + Vercel workflow

Repo settings: squash-merge only, auto-delete head branches.

```bash
git checkout -b <branch>
# ...work...
git add -A
git commit -m "..."
git push -u origin <branch>
# open PR, squash and merge
git checkout main && git pull && git branch -D <branch>
```

`git branch -d` fails after a squash merge because the SHAs differ — `-D` is
correct there, not dangerous.

Vercel rebuilds on every push to `main`; branches get preview URLs on the PR.

---

## Open items

1. **Practice screen** (`pages/Practice.jsx`) — still a stub. Intended as
   questions to work through alone, linking back to the relevant concept pages.
2. **Lazy-load the routes.** `routes.jsx` imports all ten pages eagerly, so the
   bundle is ~387 KB (123 KB gzipped) and every page loads on first visit. The
   Overview page specifically teaches that "your bundle is your import graph" —
   so the site currently contradicts its own lesson. Converting to `lazy()` is a
   short change and would make the guide demonstrate what it teaches.
