import { describe, it, expect } from "vitest";
import { searchPhraseIndex } from "../assets/bigbook/phraseSearch.js";

/** Ported from the app's client/src/utils/phraseSearch.test.ts. */
describe("searchPhraseIndex quick matches", () => {
  it("ranks Step 10 first for 'step 10' — exact token match beats prefix", () => {
    // The classic bug: "step 10".includes("step 1") is true, so Step 1 used
    // to score an exact match and win the tie by array order.
    const results = searchPhraseIndex("step 10");
    expect(results).toHaveLength(1); // exact alias match → exactly one card
    expect(results[0].snippet).toContain("Step 10:");
    expect(results[0].snippet).not.toContain("Step 1:");
  });

  it("returns exactly one quick match for every exact step query", () => {
    for (let n = 1; n <= 12; n++) {
      const results = searchPhraseIndex(`step ${n}`);
      expect(results).toHaveLength(1);
      expect(results[0].snippet).toContain(`Step ${n}:`);
    }
  });

  it("caps loose queries at 2 quick matches", () => {
    for (const q of ["fear", "resentment", "god", "acceptance was the answer"]) {
      expect(searchPhraseIndex(q).length).toBeLessThanOrEqual(2);
    }
  });
});

/** Site-specific regression: the index must be an exact mirror of the app's. */
describe("phrase index mirrors the app", () => {
  it("has the app's 112 entries — no site-only additions", async () => {
    const { BIG_BOOK_PHRASE_INDEX } = await import("../assets/bigbook/bigBookPhraseIndex.js");
    expect(BIG_BOOK_PHRASE_INDEX).toHaveLength(112);
    // The reverted port added invented Long-Form cards that hijacked
    // "12 traditions" from the app's behavior — they must stay gone.
    expect(
      BIG_BOOK_PHRASE_INDEX.find((e) => e.phrase === "the twelve traditions long form")
    ).toBeUndefined();
    // No entry carries site-only fields
    for (const e of BIG_BOOK_PHRASE_INDEX) {
      expect(Object.keys(e).every((k) => ["phrase", "aliases", "chapter", "page", "snippet", "topics"].includes(k))).toBe(true);
    }
  });

  it("short-form Traditions sit on p.562 (matches the app after its 561→562 fix)", async () => {
    const { BIG_BOOK_PHRASE_INDEX } = await import("../assets/bigbook/bigBookPhraseIndex.js");
    const trads = BIG_BOOK_PHRASE_INDEX.filter((e) => e.chapter === "Appendix I - Traditions");
    expect(trads).toHaveLength(12);
    for (const t of trads) expect(t.page).toBe(562);
  });
});
