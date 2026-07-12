import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { BookSearch } from "../assets/bigbook/bookSearch.js";
import { searchPhraseIndex } from "../assets/bigbook/phraseSearch.js";
import { searchKnowledge } from "../assets/bigbook/bigBookKnowledge.js";
import { composeResults } from "../assets/bigbook/searchPipeline.js";

/**
 * Locks the composed result pipeline to the APP's behavior (BigBook.tsx
 * handleSearch + big-book-knowledge.ts). These are the exact queries from the
 * rebuild work order, asserted against the app's layering rules:
 *   jump → knowledge (quick-deduped) → full-text (only when no jump).
 * The reverted first port failed precisely here: no knowledge layer, an
 * invented "practice refs" line, and full-text running on jump queries.
 */
let engine;
beforeAll(() => {
  // Text now lives in functions/_lib/ (not publicly served). Engine unchanged.
  const p = fileURLToPath(new URL("../functions/_lib/big-book-text.json", import.meta.url));
  engine = new BookSearch(JSON.parse(readFileSync(p, "utf8")));
});

const compose = (q) => composeResults(q, { engine, quick: searchPhraseIndex(q) });

describe("searchKnowledge (app's big-book-knowledge.ts)", () => {
  it("'step 12' → the Step 12 card with the FULL page range 89-103", () => {
    const rs = searchKnowledge("step 12");
    const step = rs.find((r) => r.type === "Step");
    expect(step).toBeDefined();
    expect(step.title).toBe("Step 12");
    expect(step.page).toBe("89-103");
    expect(step.description).toContain("spiritual awakening");
  });

  it("digit boundary: 'step 12' does not fire Step 1 or Step 2", () => {
    const titles = searchKnowledge("step 12").map((r) => r.title);
    expect(titles).not.toContain("Step 1");
    expect(titles).not.toContain("Step 2");
  });

  it("'12 traditions' → Twelve Traditions reference on p.563", () => {
    const rs = searchKnowledge("12 traditions");
    const ref = rs.find((r) => r.title === "Twelve Traditions");
    expect(ref).toBeDefined();
    expect(ref.page).toBe("563");
  });

  it("every step query returns its app page range", () => {
    const expected = {
      1: "xxv-43", 2: "44-57", 3: "58-71", 4: "58-71", 5: "72-88", 6: "72-88",
      7: "72-88", 8: "72-88", 9: "72-88", 10: "72-88", 11: "72-88", 12: "89-103",
    };
    for (let n = 1; n <= 12; n++) {
      const step = searchKnowledge(`step ${n}`).find((r) => r.type === "Step");
      expect(step, `step ${n}`).toBeDefined();
      expect(step.page).toBe(expected[n]);
    }
  });
});

describe("composeResults — WO verification queries", () => {
  it("'step 12': Step card (pp.89-103) leads; quick-card page 60 deduped out of full text", () => {
    const rs = compose("step 12");
    expect(rs[0]).toMatchObject({ type: "Step", title: "Step 12", page: "89-103" });
    // the quick-card already shows p.60 — it must not repeat below
    expect(rs.some((r) => r.page === "60")).toBe(false);
    // no page jump for a step query
    expect(rs.some((r) => r.type === "Page")).toBe(false);
  });

  it("'step 12': full-text tail is exactly the engine's (mirror, no additions)", () => {
    const rs = compose("step 12");
    const textLabels = rs.filter((r) => r.type === "Text Match" || r.type === "Exact Match").map((r) => r.page);
    const engineLabels = engine.search("step 12", { limit: 20 }).map((h) => h.label).filter((l) => l !== "60");
    expect(textLabels).toEqual(engineLabels);
  });

  it("'step 10': Step 10 leads, Step 1 nowhere in the list", () => {
    const quick = searchPhraseIndex("step 10");
    expect(quick).toHaveLength(1);
    expect(quick[0].snippet).toContain("Step 10:");
    const rs = compose("step 10");
    expect(rs[0]).toMatchObject({ type: "Step", title: "Step 10", page: "72-88" });
    expect(rs.some((r) => r.title === "Step 1")).toBe(false);
  });

  it("'12 traditions': Twelve Traditions p.563 ranks above all text matches; quick card is Tradition Twelve p.562", () => {
    const quick = searchPhraseIndex("12 traditions");
    expect(quick.length).toBeGreaterThan(0);
    expect(String(quick[0].page)).toBe("562");
    expect(quick[0].snippet).toContain("Tradition Twelve");
    const rs = compose("12 traditions");
    const refIdx = rs.findIndex((r) => r.title === "Twelve Traditions" && r.page === "563");
    expect(refIdx).toBeGreaterThanOrEqual(0);
    const firstText = rs.findIndex((r) => r.type === "Text Match" || r.type === "Exact Match");
    expect(refIdx).toBeLessThan(firstText === -1 ? Infinity : firstText);
  });

  it("'417' and 'page 83': page jump only — full text is SKIPPED like the app", () => {
    for (const [q, label] of [["417", "417"], ["page 83", "83"]]) {
      const rs = compose(q);
      expect(rs[0]).toMatchObject({ type: "Page", page: label });
      expect(rs.filter((r) => r.type === "Text Match" || r.type === "Exact Match")).toHaveLength(0);
    }
  });

  it("'resentement' (typo): fuzzy still finds the resentment pages incl. p.64", () => {
    const rs = compose("resentement");
    const labels = rs.filter((r) => r.type === "Text Match").map((r) => r.page);
    expect(labels.length).toBeGreaterThan(0);
    expect(labels).toContain("64");
  });

  it("quick-dupe rule: 'half measures availed us nothing' — p.59 stays a quick card, not a repeat hit", () => {
    const quick = searchPhraseIndex("half measures availed us nothing");
    expect(quick.some((c) => String(c.page) === "59")).toBe(true);
    const rs = composeResults("half measures availed us nothing", { engine, quick });
    expect(rs.some((r) => r.page === "59")).toBe(false);
  });

  it("'third step prayer': quick card carries p.63; the knowledge dupe is suppressed", () => {
    const quick = searchPhraseIndex("third step prayer");
    expect(quick).toHaveLength(1);
    expect(String(quick[0].page)).toBe("63");
    const rs = composeResults("third step prayer", { engine, quick });
    // Third Step Prayer matches via SPECIAL_REFERENCES but p.63 is already the
    // quick card → deduped. And because that match exists, the app's
    // prayer-keyword fallback never fires, so Seventh Step Prayer is absent too.
    expect(rs.some((r) => r.title === "Third Step Prayer")).toBe(false);
    expect(rs.some((r) => r.title === "Seventh Step Prayer")).toBe(false);
  });

  it("'step 7': Step card plus its Seventh Step Prayer reference (app's specialReferences)", () => {
    const rs = compose("step 7");
    expect(rs[0]).toMatchObject({ type: "Step", title: "Step 7", page: "72-88" });
    expect(rs.some((r) => r.title === "Seventh Step Prayer" && r.page === "76")).toBe(true);
  });

  it("knowledge cards render even if the 1MB index never loads (engine: null)", () => {
    const q = "step 12";
    const rs = composeResults(q, { engine: null, quick: searchPhraseIndex(q) });
    expect(rs[0]).toMatchObject({ type: "Step", title: "Step 12", page: "89-103" });
  });
});
