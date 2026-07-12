/**
 * Big Book "hardcoded knowledge" — vanilla-JS mirror of the app's
 * client/src/lib/big-book-knowledge.ts (CHAPTERS, STEP_REFERENCES,
 * SPECIAL_REFERENCES, searchKnowledge).
 *
 * This is the layer the first port was missing: it answers structural queries
 * the full-text engine can't — "step 12" → Step 12 spanning pp.89–103 (the
 * whole Working With Others chapter), "12 traditions" → the Long Form on
 * p.563, chapter names, the prayers, The Promises. Matching rules are the
 * app's exactly, including the digit-boundary step regex ("step 1" must not
 * fire on a "step 10"/"step 12" query).
 */

export const CHAPTERS = [
  { number: 0, title: "The Doctor's Opinion", startPage: -8, endPage: -1, romanStart: "xxv", romanEnd: "xxxii" },
  { number: 1, title: "Bill's Story", startPage: 1, endPage: 16 },
  { number: 2, title: "There Is a Solution", startPage: 17, endPage: 29 },
  { number: 3, title: "More About Alcoholism", startPage: 30, endPage: 43 },
  { number: 4, title: "We Agnostics", startPage: 44, endPage: 57 },
  { number: 5, title: "How It Works", startPage: 58, endPage: 71 },
  { number: 6, title: "Into Action", startPage: 72, endPage: 88 },
  { number: 7, title: "Working With Others", startPage: 89, endPage: 103 },
  { number: 8, title: "To Wives", startPage: 104, endPage: 121 },
  { number: 9, title: "The Family Afterward", startPage: 122, endPage: 135 },
  { number: 10, title: "To Employers", startPage: 136, endPage: 150 },
  { number: 11, title: "A Vision For You", startPage: 151, endPage: 164 },
];

export const STEP_REFERENCES = [
  {
    step: 1,
    description: "Admitted we were powerless over alcohol—that our lives had become unmanageable.",
    chapters: ["The Doctor's Opinion", "Bill's Story", "There Is a Solution", "More About Alcoholism"],
    pages: "xxv-43",
  },
  {
    step: 2,
    description: "Came to believe that a Power greater than ourselves could restore us to sanity.",
    chapters: ["We Agnostics"],
    pages: "44-57",
  },
  {
    step: 3,
    description: "Made a decision to turn our will and our lives over to the care of God as we understood Him.",
    chapters: ["How It Works"],
    pages: "58-71",
    specialReferences: [{ name: "Third Step Prayer", page: "63" }],
  },
  {
    step: 4,
    description: "Made a searching and fearless moral inventory of ourselves.",
    chapters: ["How It Works"],
    pages: "58-71",
  },
  {
    step: 5,
    description: "Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.",
    chapters: ["Into Action"],
    pages: "72-88",
  },
  {
    step: 6,
    description: "Were entirely ready to have God remove all these defects of character.",
    chapters: ["Into Action"],
    pages: "72-88",
  },
  {
    step: 7,
    description: "Humbly asked Him to remove our shortcomings.",
    chapters: ["Into Action"],
    pages: "72-88",
    specialReferences: [{ name: "Seventh Step Prayer", page: "76" }],
  },
  {
    step: 8,
    description: "Made a list of all persons we had harmed, and became willing to make amends to them all.",
    chapters: ["Into Action"],
    pages: "72-88",
  },
  {
    step: 9,
    description: "Made direct amends to such people wherever possible, except when to do so would injure them or others.",
    chapters: ["Into Action"],
    pages: "72-88",
  },
  {
    step: 10,
    description: "Continued to take personal inventory and when we were wrong promptly admitted it.",
    chapters: ["Into Action"],
    pages: "72-88",
  },
  {
    step: 11,
    description: "Sought through prayer and meditation to improve our conscious contact with God as we understood Him, praying only for knowledge of His will for us and the power to carry that out.",
    chapters: ["Into Action"],
    pages: "72-88",
  },
  {
    step: 12,
    description: "Having had a spiritual awakening as the result of these Steps, we tried to carry this message to alcoholics, and to practice these principles in all our affairs.",
    chapters: ["Working With Others"],
    pages: "89-103",
  },
];

export const SPECIAL_REFERENCES = [
  { name: "How It Works", page: "59-60", chapter: "How It Works" },
  { name: "Third Step Prayer", page: "63", chapter: "How It Works" },
  { name: "Seventh Step Prayer", page: "76", chapter: "Into Action" },
  { name: "The Promises", page: "83-84", chapter: "Into Action" },
  { name: "Twelve Traditions", page: "563", chapter: "Appendix" },
  { name: "Spiritual Experience", page: "567-568", chapter: "Appendix" },
];

export function getChapterForPage(pageNum) {
  for (const ch of CHAPTERS) {
    if (pageNum >= ch.startPage && pageNum <= ch.endPage) return ch;
  }
  return null;
}

export function searchKnowledge(query) {
  const q = query?.toLowerCase?.() ?? "";
  const results = [];

  // Search steps. Digit-boundary matching: "step 1" must not fire on a
  // "step 10"/"step 11"/"step 12" query (substring includes() had that bug).
  for (const step of STEP_REFERENCES) {
    const stepRx = new RegExp(`step\\s*${step.step}(?![0-9])`);
    if (stepRx.test(q) || q.includes(step?.description?.toLowerCase?.() ?? "")) {
      results.push({
        type: "Step",
        title: `Step ${step.step}`,
        page: step.pages ?? "",
        description: step.description,
      });
      for (const ref of (step.specialReferences ?? [])) {
        results.push({
          type: "Reference",
          title: ref.name,
          page: ref.page,
          description: `Found in ${step?.chapters?.join?.(', ') ?? ''}`,
        });
      }
    }
  }

  // Search chapters
  for (const ch of CHAPTERS) {
    if ((ch?.title?.toLowerCase?.() ?? "").includes(q) || q.includes((ch?.title?.toLowerCase?.() ?? ""))) {
      results.push({
        type: "Chapter",
        title: ch.number === 0 ? ch.title : `Chapter ${ch.number} – ${ch.title}`,
        page: ch.startPage < 0 ? (ch.romanStart ?? "") : String(ch.startPage),
        description: `Pages ${ch.startPage < 0 ? ch.romanStart : ch.startPage} to ${ch.startPage < 0 ? ch.romanEnd : ch.endPage}`,
      });
    }
  }

  // Search special references
  for (const ref of SPECIAL_REFERENCES) {
    if ((ref?.name?.toLowerCase?.() ?? "").includes(q) || q.includes((ref?.name?.toLowerCase?.() ?? ""))) {
      results.push({
        type: "Reference",
        title: ref.name,
        page: ref.page,
        description: `Found in ${ref.chapter}`,
      });
    }
  }

  // Check for promises specifically
  if (q.includes("promise")) {
    const existing = results.find((r) => r?.title === "The Promises");
    if (!existing) {
      results.push({
        type: "Reference",
        title: "The Promises",
        page: "83-84",
        description: "Found in Into Action",
      });
    }
  }

  // Check for prayer
  if (q.includes("prayer")) {
    if (!results.find((r) => r?.title?.includes?.("Prayer"))) {
      results.push(
        { type: "Reference", title: "Third Step Prayer", page: "63", description: "Found in How It Works" },
        { type: "Reference", title: "Seventh Step Prayer", page: "76", description: "Found in Into Action" }
      );
    }
  }

  // Check for traditions
  if (q.includes("tradition")) {
    if (!results.find((r) => r?.title?.includes?.("Tradition"))) {
      results.push({ type: "Reference", title: "Twelve Traditions", page: "563", description: "Appendix" });
    }
  }

  return results;
}
