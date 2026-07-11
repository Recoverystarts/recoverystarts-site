/**
 * Big Book quick-cards ("phrase index") search — vanilla-JS port of the app's
 * client/src/utils/phraseSearch.ts. Token-boundary ranking so "step 1" never
 * matches inside "step 10" (the classic substring bug).
 *
 * @typedef {import("./bigBookPhraseIndex.js").BigBookPhrase} BigBookPhrase
 * @typedef {BigBookPhrase & { score: number }} PhraseSearchResult
 */
import { BIG_BOOK_PHRASE_INDEX } from "./bigBookPhraseIndex.js";

// Strip common filler phrases people use when searching
const FILLER_PHRASES = [
  "in the big book it says",
  "in the big book",
  "the big book says",
  "big book",
  "where does it say",
  "what does it say about",
  "what does the big book say about",
  "the book says",
  "aa says",
  "alcoholics anonymous says",
];

function normalizeQuery(query) {
  let normalized = query.toLowerCase().trim();
  for (const filler of FILLER_PHRASES) {
    normalized = normalized.replace(filler, "").trim();
  }
  // Remove punctuation except hyphens
  normalized = normalized.replace(/[^a-z0-9\s\-]/g, "").trim();
  return normalized;
}

// ── Token-boundary matching ──────────────────────────────────────────────────
// All containment checks compare whole tokens, never substrings: "step 1" must
// NOT match inside "step 10" (the classic bug where searching step 10 ranked
// Step 1 first because "step 10".includes("step 1") is true).

function tokens(s) {
  return s.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

/** Does `needle` appear as a contiguous token subsequence of `hay`? */
function tokenSeqContains(hay, needle) {
  if (needle.length === 0 || needle.length > hay.length) return false;
  outer: for (let i = 0; i <= hay.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (hay[i + j] !== needle[j]) continue outer;
    }
    return true;
  }
  return false;
}

function tokensEqual(a, b) {
  return a.length === b.length && tokenSeqContains(a, b);
}

function scoreMatch(query, phrase) {
  const nq = tokens(normalizeQuery(query));
  if (nq.length === 0) return 0;

  const ph = tokens(phrase.phrase);
  const aliasTokens = (phrase.aliases ?? []).map(tokens);

  // Exact title/alias match — the query IS this entry
  if (tokensEqual(nq, ph)) return 100;
  for (const al of aliasTokens) {
    if (tokensEqual(nq, al)) return 98;
  }

  // Whole-token containment (either direction)
  if (tokenSeqContains(ph, nq) || tokenSeqContains(nq, ph)) return 90;
  for (const al of aliasTokens) {
    if (tokenSeqContains(al, nq) || tokenSeqContains(nq, al)) return 85;
  }

  // Topic match — the query mentions the topic as whole tokens
  for (const topic of phrase.topics ?? []) {
    if (tokenSeqContains(nq, tokens(topic))) return 70;
  }

  // Word overlap score (significant words only, whole-token presence)
  const queryWords = nq.filter((w) => w.length > 3);
  if (queryWords.length === 0) return 0;
  const hayTokens = new Set([...ph, ...tokens(phrase.snippet)]);
  let matchCount = 0;
  for (const word of queryWords) {
    if (hayTokens.has(word)) matchCount++;
  }

  const overlap = matchCount / queryWords.length;
  if (overlap >= 0.8) return 82;
  if (overlap >= 0.6) return 60;
  if (overlap >= 0.4) return 40;
  if (overlap >= 0.2) return 20;

  return 0;
}

/**
 * Quick-match search, mobile-first capped: exactly 1 card when the query is an
 * exact title/alias match (score >= 98 — e.g. "step 10"), at most 2 otherwise.
 * A wall of quick-match cards buries the real results below the fold on a
 * ~380px viewport.
 *
 * @param {string} query
 * @param {number} [limit]
 * @returns {PhraseSearchResult[]}
 */
export function searchPhraseIndex(query, limit = 2) {
  if (!query || query.trim().length < 2) return [];

  const results = BIG_BOOK_PHRASE_INDEX.map(
    (phrase) => ({ ...phrase, score: scoreMatch(query, phrase) })
  )
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (results.length === 0) return [];
  if (results[0].score >= 98) return [results[0]];
  return results.slice(0, Math.max(1, Math.min(limit, 2)));
}
