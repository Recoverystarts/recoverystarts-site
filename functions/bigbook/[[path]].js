/**
 * /bigbook/* — permanently gone. 410, and on purpose.
 *
 * This path used to serve `search-index.json`: the COMPLETE text of Alcoholics
 * Anonymous, 4th Edition — 981 KB, downloadable by anyone in one request. The
 * file is deleted and the search now runs server-side (functions/api/bigbook-search.js).
 *
 * But deleting a file is NOT the same as making it unreachable. Two reasons:
 *
 *   1. CLOUDFLARE'S EDGE CACHE. We measured this. After the file was removed
 *      from the deployment, GET /bigbook/search-index.json STILL returned 200
 *      with the entire book — `cf-cache-status: HIT, age: 1033`. A cache-busted
 *      request to the identical URL returned a clean 404. The file was gone; the
 *      CACHE was not.
 *
 *      >>> PURGE THE CLOUDFLARE CACHE AFTER MERGING THIS TO PRODUCTION. <<<
 *      Dashboard -> recoverystarts.com -> Caching -> Purge Everything.
 *      Until you do, the book is still being handed out from the edge.
 *
 *   2. A FUTURE BUILD COULD RECREATE IT. Functions take precedence over static
 *      assets in Cloudflare Pages, so this shadows anything that ever gets
 *      written back into /bigbook/. scripts/verify-seo-buildout.js also fails
 *      the build if that happens. Two locks, because one gets picked.
 *
 * 410 Gone (not 404) is the honest status: this existed, it is deliberately
 * withdrawn, it is not coming back. Crawlers drop a 410 faster and harder.
 *
 * Where the book actually lives now:
 *   the book itself  -> a real copy:  /big-book/
 *   the full text    -> the app:      app.recoverystarts.com
 *   "what page?"     -> /api/bigbook-search  ·  /big-book/pages/
 */
export async function onRequest() {
  return new Response(
    JSON.stringify({
      error: "gone",
      message:
        "This endpoint no longer exists. The Big Book belongs to A.A., who offer it free " +
        "at https://www.aa.org/the-big-book. To find a passage, use the search below; " +
        "to read the book, read it at aa.org or get your own copy.",
      search: "https://recoverystarts.com/big-book/search/",
      pages: "https://recoverystarts.com/big-book/pages/",
      getTheBook: "https://recoverystarts.com/big-book/",
    }),
    {
      status: 410,
      headers: {
        "content-type": "application/json; charset=utf-8",
        // Never let THIS response get cached into a stale 200 either.
        "cache-control": "no-store",
      },
    }
  );
}
