import { describe, expect, it, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { BookSearch, normalizeText } from "../assets/bigbook/bookSearch.js";

/**
 * Ported from the app's client/src/utils/bookSearch.test.ts. Runs against the
 * REAL realigned search index shipped on the site (/bigbook/search-index.json),
 * so it doubles as a regression check on the printed-label -> sheet mapping.
 */
let engine;

beforeAll(() => {
  const p = fileURLToPath(new URL("../bigbook/search-index.json", import.meta.url));
  const entries = JSON.parse(readFileSync(p, "utf8"));
  engine = new BookSearch(entries);
});

describe("normalizeText", () => {
  it("folds print ligatures and curly quotes", () => {
    expect(normalizeText("ﬁnd Him now! It’s “ﬂing”")).toBe("find Him now! It's \"fling\"");
  });
});

describe("pageJump", () => {
  it("jumps to arabic pages through the verified label map", () => {
    expect(engine.pageJump("417")).toEqual({ label: "417", sheetIndex: 442 });
    expect(engine.pageJump("59")).toEqual({ label: "59", sheetIndex: 87 });
    expect(engine.pageJump("page 83")).toEqual({ label: "83", sheetIndex: 111 });
    expect(engine.pageJump("p. 1")).toEqual({ label: "1", sheetIndex: 29 });
  });

  it("jumps to roman-numeral front matter", () => {
    expect(engine.pageJump("xxv")).toEqual({ label: "xxv", sheetIndex: 21 });
  });

  it("resolves blank pages to the nearest scanned neighbour", () => {
    const jump = engine.pageJump("166"); // printed 166 is a blank verso
    expect(jump).not.toBeNull();
    expect(["165", "167"]).toContain(jump.label);
    expect(jump.sheetIndex).toBeGreaterThanOrEqual(0);
  });

  it("rejects non-page queries", () => {
    expect(engine.pageJump("resentment")).toBeNull();
    expect(engine.pageJump("page")).toBeNull();
  });

  it("rejects page numbers the book doesn't have", () => {
    expect(engine.pageJump("0")).toBeNull();
    expect(engine.pageJump("page 0")).toBeNull();
    expect(engine.pageJump("577")).toBeNull();
    expect(engine.pageJump("600")).toBeNull();
  });
});

describe("search", () => {
  it("exact phrase ranks its page first: half measures (p.59)", () => {
    const hits = engine.search("half measures availed us nothing");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].label).toBe("59");
    expect(hits[0].exactPhrase).toBe(true);
    expect(hits[0].sheetIndex).toBe(87);
  });

  it("finds the Acceptance passage on printed 417 (was mislabeled 414 before realignment)", () => {
    const hits = engine.search("acceptance is the answer to all my problems");
    expect(hits[0].label).toBe("417");
    expect(hits[0].sheetIndex).toBe(442);
  });

  it("tolerates typos: 'resentement' still finds resentment pages", () => {
    const hits = engine.search("resentement");
    expect(hits.length).toBeGreaterThan(0);
    const labels = hits.slice(0, 10).map((h) => h.label);
    // p.64: "Resentment is the 'number one' offender"
    expect(labels).toContain("64");
  });

  it("ranks chapter-title matches above body mentions: 'how it works'", () => {
    const hits = engine.search("how it works");
    const top = hits.slice(0, 5).map((h) => h.section);
    expect(top.some((s) => s.includes("How It Works"))).toBe(true);
  });

  it("matches across OCR ligatures: 'find him now' hits p.59", () => {
    const hits = engine.search("may you find him now");
    expect(hits[0].label).toBe("59");
  });

  it("returns highlighted snippet segments", () => {
    const hits = engine.search("daily reprieve");
    const p85 = hits.find((h) => h.label === "85");
    expect(p85).toBeDefined();
    const highlighted = p85.snippet.filter((s) => s.highlight).map((s) => s.text.toLowerCase());
    expect(highlighted.join(" ")).toContain("daily");
  });

  it("filters by chapter", () => {
    const chapter = engine.chapters().find((c) => c.includes("We Agnostics"));
    expect(chapter).toBeDefined();
    const hits = engine.search("God", { chapter });
    expect(hits.length).toBeGreaterThan(0);
    for (const h of hits) expect(h.section).toBe(chapter);
  });

  it("multi-word AND matching finds pages where words are not contiguous", () => {
    const hits = engine.search("fear inventory");
    expect(hits.length).toBeGreaterThan(0);
    // p.67 carries the fear-inventory instructions ("We reviewed our fears
    // thoroughly… put them on paper"); the old contiguous-substring search
    // returned nothing for this query.
    expect(hits.slice(0, 10).map((h) => h.label)).toContain("67");
  });

  it("quoted queries return only exact-phrase pages", () => {
    const hits = engine.search('"lack of power, that was our dilemma"');
    expect(hits.length).toBeGreaterThan(0);
    for (const h of hits) expect(h.exactPhrase).toBe(true);
    expect(hits[0].label).toBe("45");
  });

  it("exact phrase tolerates punctuation between words", () => {
    // printed text reads "Lack of power, that was our dilemma."
    const hits = engine.search("lack of power that was our dilemma");
    expect(hits[0].label).toBe("45");
    expect(hits[0].exactPhrase).toBe(true);
  });

  it('quoted short words still search, whole-word anchored: "god"', () => {
    const hits = engine.search('"god"');
    expect(hits.length).toBeGreaterThan(0);
    for (const h of hits) expect(h.exactPhrase).toBe(true);
    // whole-word: pages matching only "godliness"-style words don't count —
    // spot-check the top hit's snippet highlights the bare word
    const top = hits[0].snippet.filter((s) => s.highlight).map((s) => s.text.toLowerCase());
    expect(top).toContain("god");
  });

  it("quoted queries are relevance-ranked, not book-order-truncated", () => {
    const hits = engine.search('"fear"');
    expect(hits.length).toBeGreaterThan(0);
    const scores = hits.map((h) => h.score);
    // more than one distinct score means token relevance flowed in
    expect(new Set(scores).size).toBeGreaterThan(1);
    // the fear-inventory doctrine pages should surface near the top
    expect(hits.slice(0, 5).map((h) => h.label)).toContain("68");
  });

  it("search results carry the corrected section for chapter openers", () => {
    const hits = engine.search("rarely have we seen a person fail");
    const p58 = hits.find((h) => h.label === "58");
    expect(p58?.section).toBe("Chapter 5 – How It Works");
  });
});
