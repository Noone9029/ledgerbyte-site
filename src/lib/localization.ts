import "server-only";
import { createHash } from "node:crypto";
import manifest from "@/content/localization-manifest.json";
import translations from "@/content/seo-drafts/arabic.json";
import source from "@/content/accounting.json";

export type TranslationRecord = { path: string; englishPath: string; status: string; lastModified: string; sourceKey: string; targetDigest: string; approvedBy?: string; approvedAt?: string; arabicReviewedBy?: string; sourceDigest?: string };
export const isSeoReview = process.env.VERCEL_ENV !== "production" && process.env.SEO_REVIEW_MODE === "true";
const records = manifest.pages as TranslationRecord[];
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  return value && typeof value === "object" ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, item]) => [key, canonical(item)])) : value;
}
function digest(value: unknown) { return createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex"); }
export function publishedArabicPages() {
  return records.filter((page) => {
    const original = source.pages[page.sourceKey as keyof typeof source.pages] ?? source.replacements;
    const translation = translations.pages.find((item) => item.path === page.path);
    return page.status === "approved" && page.approvedBy && page.approvedAt && page.arabicReviewedBy && translation && page.targetDigest === digest(translation) && page.sourceDigest === digest(original);
  });
}
export function availableArabicPairs() {
  return (isSeoReview ? records : publishedArabicPages()).map(({ path, englishPath }) => ({ en: englishPath, ar: path }));
}
export function languageAlternates(path: string) {
  const pair = publishedArabicPages().find((item) => item.path === path || item.englishPath === path);
  return pair ? { en: `https://ledgerbyte.io${pair.englishPath}`, ar: `https://ledgerbyte.io${pair.path}`, "x-default": `https://ledgerbyte.io${pair.englishPath}` } : undefined;
}
