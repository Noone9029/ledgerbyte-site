import "server-only";
import drafts from "@/content/seo-drafts/arabic.json";
import { isSeoReview, publishedArabicPages } from "@/lib/localization";
export function getArabicPages() {
  return drafts.pages.filter((page) => isSeoReview || publishedArabicPages().some((item) => item.path === page.path));
}
export const arabicServiceCards = drafts.services;
