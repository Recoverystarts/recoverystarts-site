# recoverystarts.com

The static website for **Recovery Starts** — a free recovery-meeting directory and
the home of the Recovery Einstein AI Big Book companion.

This repo is the GitHub-backed source for the site, deployed through the
**Cloudflare Pages ↔ GitHub integration**. It was migrated off `wrangler deploy`
(which replaces the whole site on every deploy) so that publishing is additive and
safe: **write a file → `git push` → Cloudflare auto-deploys.**

## The one rule

> **Never run `wrangler deploy` against this site.** Deploys happen only through the
> Cloudflare Pages GitHub integration. Every push to `main` auto-builds.

## Structure

```
/
├── index.html              # Home
├── aa-info/index.html      # AA info & traditions
├── about/index.html        # About
├── download/index.html     # Download / app
├── meetings/index.html     # Meetings directory
├── style.css               # Shared styles (dark / gold theme)
├── app.js                  # Site script
├── robots.txt
├── sitemap.xml
└── assets/
    ├── einstein-character.png
    └── logos/              # Fellowship logos (AA, NA, CA, CMA, GA, SAA, …)
```

Clean URLs: Cloudflare Pages serves `aa-info/index.html` at `/aa-info/`. There is
intentionally **no** `_redirects` SPA catch-all (the old site served `index.html`
for every path, which made unknown URLs silently resolve to the homepage). Static
files are served at their own URLs; anything unmatched returns a normal 404.

## Do NOT touch

- **`app.recoverystarts.com`** is a separate `CNAME → Railway` (the Recovery
  Einstein chat app). It is NOT part of this repo or this Cloudflare Pages project.
  Leave its DNS record alone.

## Deploy (Cloudflare Pages ↔ GitHub)

This repo is connected to the Cloudflare Pages project for recoverystarts.com.
Pushing to `main` triggers a build with no build step (plain static files, output
directory = repo root). The custom domains `recoverystarts.com` and
`www.recoverystarts.com` point at the project.
