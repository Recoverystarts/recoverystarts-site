# Daily Traditions — Writing Direction

This is direction, not law. Every point below carries its reasoning, because the
reasoning is the actual instruction — if a future context makes the letter of a
point work against its reason, follow the reason. If the reason itself seems
wrong for the situation, that's a conversation with Derick, not a judgment call
to make alone. (Settled the hard way, Aug 2026: a "rule" about quotation marks
got enforced without its context and blocked the exact thing Derick wanted.)

## Who the reader is

Someone three weeks sober who has been told the Traditions are rules for a club
they're not in — and who has likely been lied to about recovery by people with
a financial interest in the lie. Write so that person can follow every sentence
cold. Plain modern words. Jargon gets its meaning in the same breath ("the
local A.A. office — the place that answers the phone when a stranger calls").
One idea per reading, said once. If a line needs re-reading to land, say it
plainer — cleverness that costs clarity is a bad trade here.

## Quotes and sources

Quotation marks work like normal writing: they mean someone is talking. That
includes people in imagined scenes. The hard commitment is narrower and it is
the spine of the site: any quotation OF A.A. LITERATURE is the source's exact
words, character for character. The build gate (audit-readings.js) enforces
this; quoted lines that are ours (scene dialogue) get registered in
data/scene-dialogue.json so an unmatched quote is always either declared
fiction or a build-stopping fabrication — never silently either.

Name the source in the body, compactly, right before the quote:
Bill W. wrote (A.A. Comes of Age): "..."  ·  (A.A. pamphlet P-17): "..."
Why: a named source turns the quote into a dare — go look it up. That is how a
reader who trusts nobody gets convinced. Once per source per reading is plenty;
small repeat fragments from the same source don't need a second receipt.
Prefer quotes voiced by a person ("Bill W. wrote") over floating book-narration.

## The month's teeth (Tradition 8, and the fights behind it)

Twelfth Step work means carrying the message TO the drunk still drinking — a
rescue, outward. It is not "members helping each other stay sober"; that
softening is exactly the internet's favorite distortion. Related word care:
the alcoholic who "suffers" is the one still drinking; someone newly sober but
shaky is "struggling." Blurring those feeds the confusion we exist to fix.

A.A.'s paid work is basic labor in A.A.'s OWN offices — typing, phones,
sweeping, books — so the message can stay free. Say that bluntly every time
the paid side comes up, because treatment centres quote the permission half of
Tradition 8 as if it licenses selling recovery. Never hand them a sentence
they could read aloud to justify an invoice. The test for any reading: could
a treatment centre quote this to a client as evidence that selling recovery is
fine? If yes, it's wrong, no matter how good the sources are.

Name today's practices plainly — meetings bundled into treatment invoices,
staff paid to be the newcomer's friend, recovery-story-as-credential, billing
codes on the free hour. Name mechanisms and practices, never a company or
organisation.

THE READINGS DEFEND THE TRADITION — they never give its exceptions light
(Derick's ruling, Aug 2026, learned the hard way: a month built by mining the
literature's most quotable passages came out arguing the permission side,
because Bill's vivid writing was his defense of paid janitors — quotability
is not importance). A reading is information on how to understand the
Tradition, never a catalog of when it bends. If the paid-office fact must
appear at all, it gets one blunt line — basic labor, A.A.'s own office, so the
message stays free — and it is never a day's anchor. Edge cases, oddball
situations, and "it's more nuanced" framing are what the manipulators feed on.

Per-day procedure: before writing a day, reread the LONG FORM of the month's
Tradition; then search the books for stories that BACK it up — never material
that argues against its plain meaning. For extra grounding on Tradition 8,
read it in P-43 (The Twelve Traditions Illustrated). Keep it short. No other
structure.

Avoid the word "sponsor" in new readings. It isn't in the Steps or the
Traditions, and it's the most-used lever of manipulation in the rooms — no
fuel. Describe the real thing instead: one drunk, free, wanting nothing.
Exception worth keeping: an existing reading that uses the word to expose the
selfishness, or to make clear sponsorship is no substitute for Twelfth Step
work, may stay — emphasized, not multiplied.

## Shape of a reading

There is no formula. (There was one — a five-question rotation with per-slot
recipes — and it produced readings that fought their own point. Erased Aug 2026.)
What remains is only this: start from the point Derick wants made, say it
plainly and early, keep it short — punchy beats complete, and most days land
well under 200 words. One exact quote with its source can carry a whole day.
Scenes are welcome when they serve the point, never required. End on the
reader: *Sit with:* is a plain statement, then a question about their own life.
The slot names on published pages are labels for the reader, not molds for the
writer. When a reading is fighting its shape, the shape is what's wrong.

## Order of work: read the truth, then write (Sept 5, 2026 — the thing that fixed September)

The same instance wrote Sept 6 twice in one day. The morning version was 330
words with the point at the end and Derick said it was more confusing than
the original. The afternoon version he called awesome. Nothing about ability
changed between them. The order did.

Morning: wrote from what the instance already "knew" about Tradition 9, then
went looking for quotes to hang on it. That is how the July 28 auto-generate
worked too, and it is why it leaned toward the internet's version — the
training data is the distortion the Traditions were written against, so
anything written before reading the source drifts toward it.

Afternoon: read the LONG FORM of the Tradition (pp. 563–566) and the source
pages in `recovery-einstein\historian-sources` first, pulled the exact lines
with their page numbers, THEN chose the day's one point from what the text
actually says, then wrote — point in sentence one, the quote already in hand,
today's mechanism named, under 200 words. The reading defends the Tradition
because the sources do; there is nothing to soften.

So, per day: source pages open first (P-17/P-43/P-44 are now in the corpus,
Einstein's DB, and the quote gate); point chosen from the text; draft;
`apply-tradition-batch.js` → `parse-traditions.js --verify` →
`audit-readings.js` (0 fabricated or it does not ship); reader test through
Einstein's Historian prompt (`recovery-einstein\scripts\review-readings-with-
historian.mjs` — the POINT line must come back as one plain sentence, and its
UNCLEAR words get glossed in the same breath); Derick reads the live pages.
Batches of five. Whole-reading rewrites, never sentence fights.

"Going hard on the defensive" is not a tone problem. It is what the material
is: the Traditions were written after the damage, by people who had lived it.

## Anonymity is not secrecy (for Traditions 11 and 12 especially)

A.A. is the opposite of secret. The Big Book is published to the world, the
Grapevine is a worldwide journal, A.A. advertises and always has, documentaries
about A.A. exist and are fine — Bill W.'s own anonymity was released after his
death, for the good of A.A., which is why a film can show his name and face.
The Tradition's ask is one narrow thing: a member speaking FOR A.A. at the
public level (press, radio, film, and their modern equivalents) keeps the face
hidden and uses a first name, last initial at most. Not because membership is
shameful or hidden — because of what fame does: the member on TV becomes a
rockstar in the rooms; members start using A.A. for profit in the media; a
world-famous face who relapses teaches the public "I guess A.A. doesn't work";
and a World Service office that picks which members appear is a governing body
playing favorites, which is how a dictatorship creeps into a fellowship built
as an upside-down pyramid — the board answers to the groups, the groups answer
to their members, never the reverse (that inversion is the basis of the Twelve
Concepts). Write anonymity readings from those reasons. Any framing that makes
A.A. sound like a secret society repeats the distortion we exist to correct.

## Handoffs

A handoff records the state of the work: what is live, where files are, what
is unresolved, which commit is the way back. It does not record rules of
engagement, process rituals, or descriptions of how Derick works — he is in
the room and speaks for himself. Saved context is evidence, not law: every
note is a record of one moment, and one-offs stay one-offs unless Derick says
otherwise.
