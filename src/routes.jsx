import Overview from "./pages/Overview.jsx";
import Patterns from "./pages/Patterns.jsx";
import Apis from "./pages/Apis.jsx";
import Caching from "./pages/Caching.jsx";
import Observability from "./pages/Observability.jsx";
import NewsFeed from "./pages/cases/NewsFeed.jsx";
import Realtime from "./pages/cases/Realtime.jsx";
import Typeahead from "./pages/cases/Typeahead.jsx";
import Cheatsheet from "./pages/Cheatsheet.jsx";
import Practice from "./pages/Practice.jsx";

/* One list drives both the router and the sidebar, so a new page
   is added in exactly one place. An item with `href` instead of `path`
   is a standalone document rather than a route — it is rendered by the
   sidebar as an ordinary link and skipped by the router. */
export const nav = [
  {
    group: "Start here",
    items: [{ path: "/", num: "00", label: "Overview & how a page loads", el: <Overview /> }],
  },
  {
    group: "Deep dives",
    items: [
      { path: "/patterns",      num: "01", label: "Design patterns",        el: <Patterns /> },
      { path: "/apis",          num: "02", label: "APIs & transports",      el: <Apis /> },
      { path: "/caching",       num: "03", label: "Caching & stale data",   el: <Caching /> },
      { path: "/observability", num: "04", label: "Observability",          el: <Observability /> },
    ],
  },
  {
    group: "Worked examples",
    items: [
      { path: "/case/news-feed", num: "05", label: "News feed",            el: <NewsFeed /> },
      { path: "/case/realtime",  num: "06", label: "Real-time fleet board", el: <Realtime /> },
      { path: "/case/typeahead", num: "07", label: "Typeahead search",      el: <Typeahead /> },
    ],
  },
  {
    group: "Release engineering",
    items: [
      {
        href: "./git-visual-guide.html",
        num: "10",
        label: "Branch, Tag, Ship",
        external: true,
      },
    ],
  },
  {
    group: "Reference",
    items: [
      { path: "/cheatsheet", num: "08", label: "Cheatsheet", el: <Cheatsheet /> },
      { path: "/practice",   num: "09", label: "Practice",   el: <Practice /> },
    ],
  },
];

/* Only real routes reach the router; standalone documents are link-only. */
export const allRoutes = nav.flatMap((g) => g.items).filter((i) => i.path);
