import "server-only";
import { isSeoReview } from "@/lib/localization";
export function insightsArabicUrl() {
  const review = process.env.SEO_BLOG_REVIEW_URL;
  if (isSeoReview && review && /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(review)) return `${review}/ar`;
  return "https://blog.ledgerbyte.io";
}
