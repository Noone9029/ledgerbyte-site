import { NextResponse, type NextRequest } from "next/server";
import { availableArabicPairs, isSeoReview } from "@/lib/localization";

// Unpublished routes need the static 404 HTML before Next starts streaming a layout.
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "");
  if (pathname === "/review-notes" && process.env.VERCEL_ENV !== "production") return NextResponse.next();
  if (pathname === "/seo-review" && isSeoReview) return NextResponse.next();
  if (pathname.startsWith("/ar") && availableArabicPairs().some(({ ar }) => ar === pathname)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
}

export const config = { matcher: ["/ar/:path*", "/review-notes", "/seo-review"] };
