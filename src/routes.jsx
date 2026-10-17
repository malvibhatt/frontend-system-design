import Overview from "./pages/Overview.jsx";
import Frame from "./pages/method/Frame.jsx";
import Shape from "./pages/method/Shape.jsx";
import Data from "./pages/method/Data.jsx";
import Flow from "./pages/method/Flow.jsx";
import Experience from "./pages/method/Experience.jsx";
import Operate from "./pages/method/Operate.jsx";
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
   is a standalone document rather than a route. It is rendered by the
   sidebar as an ordinary link and skipped by the router. */
export const nav = [
  {
    group: "Start here",
    items: [{ path: "/", num: "00", label: "Overview & the map", el: <Overview /> }],
  },
  {
    group: "The method",
    items: [
      { path: "/method/frame",      num: "01", label: "Frame",      el: <Frame /> },
      { path: "/method/shape",      num: "02", label: "Shape",      el: <Shape /> },
      { path: "/method/data",       num: "03", label: "Data",       el: <Data /> },
      { path: "/method/flow",       num: "04", label: "Flow",       el: <Flow /> },
      { path: "/method/experience", num: "05", label: "Experience", el: <Experience /> },
      { path: "/method/operate",    num: "06", label: "Operate",    el: <Operate /> },
    ],
  },
  {
    group: "Go deeper",
    items: [
      { path: "/patterns",      num: "D1", label: "Design patterns",      el: <Patterns /> },
      { path: "/apis",          num: "D2", label: "APIs & transports",    el: <Apis /> },
      { path: "/caching",       num: "D3", label: "Caching & stale data", el: <Caching /> },
      { path: "/observability", num: "D4", label: "Observability",        el: <Observability /> },
    ],
  },
  {
    group: "The method applied",
    items: [
      { path: "/case/news-feed", num: "E1", label: "News feed",            el: <NewsFeed /> },
      { path: "/case/realtime",  num: "E2", label: "Real-time dashboard",  el: <Realtime /> },
      { path: "/case/typeahead", num: "E3", label: "Typeahead search",     el: <Typeahead /> },
    ],
  },
  {
    group: "Toolkit",
    items: [
      { path: "/cheatsheet", num: "T1", label: "Cheatsheet", el: <Cheatsheet /> },
      { path: "/practice",   num: "T2", label: "Practice",   el: <Practice /> },
    ],
  },
  {
    group: "Release engineering",
    items: [
      { href: "./git-visual-guide.html", num: "↗", label: "Branch, Tag, Ship", external: true },
    ],
  },
];

/* Only real routes reach the router; standalone documents are link-only. */
export const allRoutes = nav.flatMap((g) => g.items).filter((i) => i.path);
