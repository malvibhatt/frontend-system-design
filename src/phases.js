/* The six phases. Plain data, kept out of the component file so fast
   refresh works and so the router, rail, pager and journey map all read
   the order from one place. */
export const PHASES = [
  { n: 1, slug: "frame",      name: "Frame",      short: "Frame",
    q: "What are we building, for whom, and what has to be true?" },
  { n: 2, slug: "shape",      name: "Shape",      short: "Shape",
    q: "What are the screens, and where are the seams between them?" },
  { n: 3, slug: "data",       name: "Data",       short: "Data",
    q: "What data exists, who owns it, and where does each piece live?" },
  { n: 4, slug: "flow",       name: "Flow",       short: "Flow",
    q: "How does data get to the screen, and how does it stay true?" },
  { n: 5, slug: "experience", name: "Experience", short: "Experience",
    q: "What does this feel like: when it is fast, when it breaks, for everyone?" },
  { n: 6, slug: "operate",    name: "Operate",    short: "Operate",
    q: "How do we know it is working, and what happens when it is not?" },
];

export const phasePath = (slug) => `/method/${slug}`;
