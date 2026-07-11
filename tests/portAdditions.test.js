import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { BookSearch } from "../assets/bigbook/bookSearch.js";
import { searchPhraseIndex } from "../assets/bigbook/phraseSearch.js";
import { BIG_BOOK_PHRASE_INDEX, STEP_PRACTICE_REFS } from "../assets/bigbook/bigBookPhraseIndex.js";

/**
 * Locks the recoverystarts.com additions (WO-bigbook-search-port): the 12
 * Traditions Long Form curated cards, the step→practice references, and the
 * manual VERIFY query expectations — so a future edit that breaks them fails
 * loudly. These are ON TOP of the two ported app test files.
 */
let engine;
beforeAll(() => {
  const p = fileURLToPath(new URL("../bigbook/search-index.json", import.meta.url));
  engine = new BookSearch(JSON.parse(readFileSync(p, "utf8")));
});

describe("12 Traditions (Long Form) additions", () => {
  it("'12 traditions' quick-card resolves to page 563", () => {
    const cards = searchPhraseIndex("12 traditions");
    expect(cards.length).toBeGreaterThan(0);
    expect(String(cards[0].page)).toBe("563");
  });

  it("'twelve traditions' also lands on 563", () => {
    const cards = searchPhraseIndex("twelve traditions");
    expect(String(cards[0].page)).toBe("563");
  });

  it("the long-form Tradition card links the Traditions pamphlets on aa.org", () => {
    const card = BIG_BOOK_PHRASE_INDEX.find(
      (c) => (c.aliases ?? []).includes("12 traditions")
    );
    expect(card).toBeDefined();
    // Pamphlets are linked to aa.org's own hosted pages (not self-hosted PDFs).
    expect(card.links?.some((l) => /SMF-187/.test(l.label) && /^https:\/\/www\.aa\.org\//.test(l.href))).toBe(true);
    expect(card.links?.every((l) => /^https:\/\/www\.aa\.org\//.test(l.href))).toBe(true);
  });

  it("page 563 exists in the index and is the Long Form opener", () => {
    const jump = engine.pageJump("563");
    expect(jump).not.toBeNull();
    const hits = engine.search("twelve traditions long form");
    // page 563's text begins the Long Form
    expect(hits.some((h) => h.label === "563")).toBe(true);
  });
});

describe("step → practice references (VERIFY 2)", () => {
  it("step 12 practice reference points to Working With Others p.89", () => {
    expect(STEP_PRACTICE_REFS[12]).toEqual({ label: "Working With Others", page: 89 });
    const jump = engine.pageJump("89");
    expect(jump?.label).toBe("89");
  });

  it("'step 12' quick-card is the Step 12 text (not the practice page)", () => {
    // The card stays byte-faithful; the practice ref is a UI layer on top.
    const cards = searchPhraseIndex("step 12");
    expect(cards).toHaveLength(1);
    expect(cards[0].snippet).toContain("Step 12:");
  });

  it("every step 1..12 has a practice reference", () => {
    for (let n = 1; n <= 12; n++) {
      expect(STEP_PRACTICE_REFS[n]).toBeTruthy();
      expect(typeof STEP_PRACTICE_REFS[n].page).toBe("number");
    }
  });
});

describe("VERIFY 2 — manual query expectations", () => {
  it("'step 10' quick-card leads with Step 10, not Step 1", () => {
    const cards = searchPhraseIndex("step 10");
    expect(cards[0].snippet).toContain("Step 10:");
    expect(cards[0].snippet).not.toContain("Step 1:");
  });

  it("'417' and 'page 83' resolve to direct page jumps", () => {
    expect(engine.pageJump("417")).toEqual({ label: "417", sheetIndex: 442 });
    expect(engine.pageJump("page 83")).toEqual({ label: "83", sheetIndex: 111 });
  });

  it("'resentement' (typo) still finds resentment via fuzzy", () => {
    const labels = engine.search("resentement").slice(0, 10).map((h) => h.label);
    expect(labels).toContain("64");
  });
});
