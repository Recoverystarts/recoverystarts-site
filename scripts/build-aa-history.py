#!/usr/bin/env python3
"""/aa-history/ — the story of A.A. from 1934 to 1950 (and what came after, dated), told by linking the cold-read
question pages in order. claude-home #444 (the truth source), goal #439.

Each chapter's lines are the first "In short" sentence of the question page it links to (our own words, already
checked against the books by that page's writer and cold reader), so this page says nothing those pages don't.
The chrome (menu, footer, ads, app bar) comes from a stamped A.A. question page in git HEAD, the same way
aa-library/tools/transplant-into-site.py does it.

  python3 scripts/build-aa-history.py /path/to/aa-library     (run from the site root)
Written 2026-10-28 by CEO: reach, 4th window (Opus 5.5); 20:2x added Anne Smith, Lois W., Father Ed, the Grapevine, St. Louis 1955. Way back: delete this file and /aa-history/.
"""
import re, sys, json, html, subprocess, pathlib, datetime

LIB = pathlib.Path(sys.argv[1]) / "drafts"
SITE = pathlib.Path(".")
TODAY = datetime.date.today().isoformat()
URL = "https://recoverystarts.com/aa-history/"

CHAPTERS = [
    ("1934–1935: how it started", None, ["bill-w", "ebby", "towns-hospital", "oxford-group", "how-bill-and-bob-met", "henrietta-seiberling", "who-was-dr-bob", "anne-smith", "lois-w"]),
    ("1935–1939: two groups, then a book", None, ["how-aa-grew-from-two", "akron-and-new-york", "alcoholic-foundation", "rockefeller-money",
                                                 "big-book-draft", "who-wrote-the-chapters", "works-publishing", "why-the-big-book-was-written", "members-in-1939"]),
    ("1939–1950: growth, trouble, and the Traditions", "/12-traditions/history/", ["cleveland-first-aa-group", "sister-ignatia", "jack-alexander-article", "father-ed-dowling", "grapevine",
                                                 "aa-1939-to-1950", "traditions-why-written", "cleveland-1950", "dr-bob-death-last-words"]),
    ("After 1950 (later sources, dated and read with care)", None, ["st-louis-1955", "three-legacies", "concepts-what-and-why"]),
]

def first_short(slug):
    t = (LIB / f"{slug}.md").read_text()
    title = re.match(r"#\s+(.+)", t).group(1).strip()
    m = re.search(r"\*\*In short:\*\*\s*\n- (.+)", t)
    line = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", html.escape(m.group(1).strip(), quote=False))
    return title, line

body = []
for head, extra, slugs in CHAPTERS:
    body.append(f"<h2>{html.escape(head)}</h2>")
    for s in slugs:
        if not (SITE / "aa-questions" / s / "index.html").exists():
            raise SystemExit(f"{s}: no page on the site yet")
        title, line = first_short(s)
        body.append(f'<p>{line} <a href="/aa-questions/{s}/">{html.escape(title, quote=False)}</a></p>')
    if extra:
        body.append(f'<p>The Traditions year by year, 1937–1950, with every source: <a href="{extra}">How the Twelve Traditions came about</a>.</p>')

lead = ("A.A. began in Akron, Ohio, in 1935, when Bill W., a New York stockbroker trying to stay sober, went looking for another "
        "alcoholic to help and was put in touch with Dr. Bob, a surgeon who was still drinking. Dr. Bob's last drink, on June 10, 1935, "
        "is the date A.A. counts from. From those two, members found more one at a time; by the Big Book in April 1939 there were about a "
        "hundred, and by 1950 tens of thousands, held together by the Twelve Traditions, which came out of the groups' troubles in the 1940s.")
main = f"""<main id="main"><section class="aq-wrap"><div class="container"><article class="aq">
  <div class="aq-crumb"><a href="/">Home</a> › <a href="/aa-questions/">A.A. questions, from the books</a> › A.A.'s history</div>
  <h1>The story of A.A., from the books</h1>
<div class="aq-short">
<p><strong>In short:</strong></p>
<p>{html.escape(lead, quote=False)}</p>
</div>
<p>Each line below is the short answer of one page, in order. Every page answers from A.A.'s own books with page numbers: the Big Book (1939; the Long Form of the Traditions, 1946), Bill W.'s 1946–47 Grapevine essays (P-17), and <em>A.A. Comes of Age</em> (1957), with later books dated where they're used. <em>Twelve Steps and Twelve Traditions</em> is not one of the sources.</p>
{chr(10).join(body)}
<h2>Read it yourself</h2>
<ul>
<li>The Big Book's own account: "Bill's Story" (pp. 1–16): https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt1.pdf, and "A Vision for You" (pp. 151–164): https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt11.pdf</li>
<li>Appendix I, "The A.A. Tradition" (pp. 561–566): https://www.aa.org/sites/default/files/2021-11/en_bigbook_appendicei.pdf</li>
<li>A.A.'s books: https://onlineliterature.aa.org</li>
</ul>
<p class="aq-note">Sources: the question pages linked above, each with its own sources table. This page last changed {TODAY}. <em>Recovery Starts is independent and not affiliated with Alcoholics Anonymous. Quotations are brief and cited; the Big Book is © A.A. World Services, Inc.</em></p>
</article></div></section></main>"""

def git_show(rel):
    return subprocess.run(["git", "show", f"HEAD:{rel}"], capture_output=True, text=True, check=True).stdout
tmpl = git_show("aa-questions/tradition-5-primary-purpose/index.html")
desc = "How A.A. began and grew, 1934 to 1950, in order: Bill W. and Dr. Bob, Akron and New York, the Big Book, the Traditions. Each step links to a page answered from A.A.'s own books."
ld = [
    {"@context": "https://schema.org", "@type": "Article", "headline": "The story of A.A., from the books", "description": desc,
     "author": {"@type": "Organization", "name": "Recovery Starts"}, "publisher": {"@type": "Organization", "name": "Recovery Starts"},
     "datePublished": "2026-10-28", "dateModified": TODAY, "mainEntityOfPage": URL, "isAccessibleForFree": True,
     "about": {"@type": "Organization", "name": "Alcoholics Anonymous", "foundingDate": "1935"}},
    {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://recoverystarts.com/"},
        {"@type": "ListItem", "position": 2, "name": "A.A. questions, from the books", "item": "https://recoverystarts.com/aa-questions/"},
        {"@type": "ListItem", "position": 3, "name": "The story of A.A., from the books", "item": URL}]},
]
head_end = tmpl.index("</style>") + len("</style>")
head = tmpl[:head_end]
head = re.sub(r"<title>.*?</title>", "<title>The story of A.A., from the books: 1934–1950 | Recovery Starts</title>", head, flags=re.S)
head = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + html.escape(desc), head)
head = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + "The story of A.A., from the books", head)
head = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + html.escape(desc), head)
head = re.sub(r'(<meta property="og:url" content=")[^"]*', lambda m: m.group(1) + URL, head)
head = re.sub(r'(<link rel="canonical" href=")[^"]*', lambda m: m.group(1) + URL, head)
head = re.sub(r'\s*<link rel="alternate" type="text/markdown"[^>]*>', "", head)
head = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', "", head, flags=re.S)
head = head.replace('<link rel="stylesheet"', "\n".join(f'<script type="application/ld+json">\n  {json.dumps(x, ensure_ascii=False)}\n  </script>' for x in ld) + '\n  <link rel="stylesheet"', 1)
rest_head = re.sub(r'\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+" data-i18n>', "", tmpl[head_end:tmpl.index("</head>")])
top = tmpl[tmpl.index("</head>"):tmpl.index('<main id="main">')]
tail = tmpl[tmpl.index("</main>") + len("</main>"):]
out = (head + rest_head + top + main + tail).replace("tradition-5-primary-purpose-bar", "aa-history-bar")
# English-only page: no globe (as scripts/i18n/globe.mjs stampGlobe() leaves a one-language page)
out = re.sub(r"\n[ \t]*<details class=\"rs-globe\">[\s\S]*?</details>", "", out, count=1)
out = re.sub(r"<style id=\"rs-globe-css\">[\s\S]*?</style>\n", "", out, count=1)
out = re.sub(r"\n?<script>/\*rs-globe\*/[\s\S]*?</script>", "", out, count=1)
(SITE / "aa-history").mkdir(exist_ok=True)
(SITE / "aa-history" / "index.html").write_text(out)
print("wrote aa-history/index.html")
