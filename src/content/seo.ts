import seoManifest from "./seo.json";

export interface SeoPageConfig {
  title: string;
  description: string;
  image: string;
  lastModified: string;
  source: string;
}

export type SeoPagePath = keyof typeof seoManifest.pages;

export const seoPages = seoManifest.pages satisfies Record<
  string,
  SeoPageConfig
>;

export const financeServiceSeoTitles =
  seoManifest.financeServices satisfies Record<string, string>;

export function getPageSeo(path: SeoPagePath): SeoPageConfig {
  return seoPages[path];
}

export function getFinanceServiceSeoTitle(slug: string, fallback: string) {
  return (
    financeServiceSeoTitles[
      slug as keyof typeof financeServiceSeoTitles
    ] ?? fallback
  );
}
