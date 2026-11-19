# recoverystarts.com

The static website for **Recovery Starts**: a free recovery-meeting directory and
the home of the Recovery Einstein AI Big Book companion.

Deployed by the **Cloudflare Pages ↔ GitHub integration**: every push to `main`
builds. Build command `sh scripts/pages-dist.sh`, output directory `dist`;
Pages Functions come from `functions/`. The custom domains `recoverystarts.com`
and `www.recoverystarts.com` point at the project.

## Structure

```
/
├── index.html              # Home
├── aa-info/  about/  download/  meetings/  …   # one folder per page, served at /<folder>/
├── <lang>/                 # translated pages (built by scripts/i18n/)
├── style.css  app.js       # shared styles and site script
├── functions/              # Pages Functions (/api/*, /bigbook/*)
├── scripts/                # page generators, checks, CI
├── i18n/                   # translation sources
├── data/                   # reading sources the generators read
├── robots.txt  sitemap*.xml
└── assets/
```

Clean URLs: Cloudflare Pages serves `aa-info/index.html` at `/aa-info/`. There is
no `_redirects` SPA catch-all, so an unknown URL returns a normal 404.

`app.recoverystarts.com` is a separate `CNAME → Railway` (the Recovery Einstein
chat app), not part of this repo or this Pages project.
