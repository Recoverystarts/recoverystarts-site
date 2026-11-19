#!/bin/sh
# Cloudflare Pages build command (output directory: dist). Copies everything the site serves into dist/ and leaves the
# working files out (i18n/ sources, scripts/, tests/, functions/ — Pages builds Functions from functions/ at the root).
set -e
rm -rf dist
mkdir dist
tar --exclude=./dist --exclude=./.git --exclude=./.github --exclude=./node_modules --exclude='*/node_modules' \
    --exclude=./functions --exclude=./i18n --exclude=./scripts --exclude=./tests --exclude=./grok-handoff \
    -cf - . | tar -xf - -C dist
echo "pages-dist: $(find dist -type f | wc -l) files in dist/"
