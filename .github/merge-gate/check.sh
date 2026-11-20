#!/usr/bin/env bash
# The merge gate's checks for recoverystarts.com. The workflow runs this file from the default branch against the pull
# request's code, with no secrets. Locally: bash .github/merge-gate/check.sh [base-branch]
#   1. syntax of every changed .js/.mjs/.cjs (node --check) and .json (JSON.parse)
#   2. the Functions security tests
#   3. the Pages build (scripts/pages-dist.sh) and scripts/ci/site-check.js: file count, pages per language, internal links
#   4. the label rule's own cases
# Site CI (.github/workflows/site-ci.yml) runs the same build plus the quote gate and the preview link check.
set -euo pipefail
base="${1:-main}"
case "$base" in origin/*) ;; *) base="origin/$base" ;; esac
git rev-parse --verify -q "$base" >/dev/null || git fetch -q origin "${base#origin/}"
fail=0; n=0
while IFS= read -r f; do
  [ -f "$f" ] || continue
  case "$f" in
    *.json) node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$f" || { echo "::error file=$f::not valid JSON"; fail=1; }; n=$((n+1)) ;;
    *.js|*.mjs|*.cjs) node --check "$f" || { echo "::error file=$f::JavaScript syntax error"; fail=1; }; n=$((n+1)) ;;
  esac
done < <(git diff --name-only --diff-filter=ACMR "$base...HEAD")
echo "checked $n changed JS/JSON file(s)"
[ "$fail" = 0 ] || { echo "::error::syntax check failed (above)"; exit 1; }
node --test tests/functions-security.test.mjs
sh scripts/pages-dist.sh
node scripts/ci/site-check.js --base "$base"
bash .github/merge-gate/test-label.sh | tail -1
