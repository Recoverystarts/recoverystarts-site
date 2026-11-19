/**
 * /bigbook/* — 410 Gone.
 *
 * This path used to serve `search-index.json`, the complete Big Book text. The
 * search now runs server-side (functions/api/bigbook-search.js). Functions take
 * precedence over static assets in Cloudflare Pages, so this shadows anything
 * written back into /bigbook/, and the 410 tells crawlers it is withdrawn.
 *
 * Where the book lives now:
 *   the book itself  -> /big-book/
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
