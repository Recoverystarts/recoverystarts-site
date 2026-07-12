// Dev probe: print the composed results for the WO verification queries.
// Not a test — a ground-truth dump of what the site (and, because the pipeline
// mirrors BigBook.tsx, the app) produces for each query. Run: node probe.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { BookSearch } from "../assets/bigbook/bookSearch.js";
import { searchPhraseIndex } from "../assets/bigbook/phraseSearch.js";
import { composeResults } from "../assets/bigbook/searchPipeline.js";

const p = fileURLToPath(new URL("../bigbook/search-index.json", import.meta.url));
const engine = new BookSearch(JSON.parse(readFileSync(p, "utf8")));

for (const q of ["step 12", "step 10", "12 traditions", "417", "page 83", "resentement"]) {
  const quick = searchPhraseIndex(q);
  const composed = composeResults(q, { engine, quick });
  console.log(`\n=== "${q}" ===`);
  for (const c of quick) {
    console.log(`  QUICK   p.${c.page}  [${c.chapter}]  ${c.snippet.slice(0, 60)}`);
  }
  for (const r of composed) {
    const snip = r.snippetParts ? r.snippetParts.map((s) => s.text).join("").slice(0, 55) : "";
    console.log(`  ${r.type.padEnd(11)} p.${String(r.page).padEnd(8)} ${r.title.padEnd(12)} ${r.description.slice(0, 45)}${snip ? " | " + snip : ""}`);
  }
}
