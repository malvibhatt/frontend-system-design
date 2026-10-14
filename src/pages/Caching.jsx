import { Page, Placeholder } from "../components/Doc.jsx";

export default function Caching() {
  return (
    <Page eyebrow="Deep dive 03" title="Caching and stale data" lede="A cache is a promise that old data is good enough. Designing a cache is deciding exactly how old is good enough, and what happens when you are wrong.">
      <Placeholder step="3" />
    </Page>
  );
}
