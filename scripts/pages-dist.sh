#!/bin/sh
# Cloudflare Pages build step (wave rulang1, 2026-11-02). With no build step Pages deployed the whole repo root, including
# files no page uses (i18n/ translation sources, scripts/, tests/, grok-handoff/). On the Free plan Pages deploys at most
# 20,000 files, and with Russian the repo passed that (20,123): "Pages only supports up to 20,000 files".
# Since 2026-11-07 the limit is 100,000: recoverystarts.com is on Cloudflare Pro and the project has
# PAGES_WRANGLER_MAJOR_VERSION=4 on Production and Preview (proved by a 21,091-file preview that deployed; claude-home
# map/projects/recoverystarts-site/STATUS.md, 2026-11-07 pages-100k). Removing that variable brings 20,000 back.
# This copies everything the site serves into dist/ and leaves the working files out. Pages builds Functions from
# functions/ at the project root, so functions/ stays out of dist/ too. Project setting: build command
# `sh scripts/pages-dist.sh`, output directory `dist`. Way back: clear both settings in the Pages project (it served the
# repo root before) and delete this file.
set -e
rm -rf dist
mkdir dist
tar --exclude=./dist --exclude=./.git --exclude=./.github --exclude=./node_modules --exclude='*/node_modules' \
    --exclude=./functions --exclude=./i18n --exclude=./scripts --exclude=./tests --exclude=./grok-handoff \
    -cf - . | tar -xf - -C dist
echo "pages-dist: $(find dist -type f | wc -l) files in dist/"
