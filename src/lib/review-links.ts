import "server-only";
import { isSeoReview } from "@/lib/localization";

export function insightsEnglishUrl() {
  const review = process.env.SEO_BLOG_REVIEW_URL;
  if (process.env.VERCEL_ENV !== "production" && review && /^http:\/\/(?:127\.0\.0\.1|localhost):\d{1,5}$/.test(review)) return review;
  return "https://blog.ledgerbyte.io";
}

export function insightsArabicUrl() {
  const review = process.env.SEO_BLOG_REVIEW_URL;
  if (isSeoReview && review && /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(review)) return `${review}/ar`;
  return "https://blog.ledgerbyte.io";
}
