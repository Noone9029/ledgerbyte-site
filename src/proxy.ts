import { NextResponse, type NextRequest } from "next/server";
import { availableArabicPairs, isSeoReview } from "@/lib/localization";

const retiredHostPage = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Page not found | LedgerByte</title>
<style>html{color-scheme:light dark;font:1rem/1.5 system-ui,sans-serif}main{max-width:60rem;margin:20vh 8vw}h1{font-size:clamp(3rem,8vw,7rem);line-height:1;margin:.5rem 0 2rem}a{display:inline-block;margin:0 1.5rem 1rem 0}</style>
</head><body><main><p>404</p><h1>Page not found</h1>
<a href="https://ledgerbyte.io/">Back to home</a><a href="https://ledgerbyte.io/finance/services">Browse services ↗</a>
</main></body></html>`;

// Return the static 404 HTML before Next starts streaming a layout.
export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  const pathname = request.nextUrl.pathname.replace(/\/$/, "");
  if (host === "tech.ledgerbyte.io") {
    return new NextResponse(retiredHostPage, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
  if (pathname === "/review-notes" && process.env.VERCEL_ENV !== "production") return NextResponse.next();
  if (pathname === "/seo-review" && isSeoReview) return NextResponse.next();
  if (pathname.startsWith("/ar") && availableArabicPairs().some(({ ar }) => ar === pathname)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
}

export const config = {
  matcher: [
    "/ar/:path*",
    "/review-notes",
    "/seo-review",
    {
      source: "/((?!_next/static/).*)",
      has: [{ type: "host", value: "tech\\.ledgerbyte\\.io" }],
    },
  ],
};
