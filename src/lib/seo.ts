import serviceDrafts from "@/content/seo-drafts/service-map.json";
import { isSeoReview, languageAlternates } from "@/lib/localization";
import type { Metadata } from "next";
import { seoPages, type SeoPageConfig, type SeoPagePath } from "@/content/seo";

export const SITE_NAME = "LedgerByte";
export const SITE_URL = "https://ledgerbyte.io";
export const SITE_LANGUAGE = "en";

const TITLE_SUFFIX = ` | ${SITE_NAME}`;

export const isIndexableEnvironment =
  process.env.VERCEL_ENV === "production" ||
  (process.env.VERCEL_ENV !== "preview" &&
    process.env.SEO_INDEXABLE === "true");

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function formatSeoTitle(value: string) {
  const title = value
    .replace(/\s*\|\s*LedgerByte\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();

  return title.toLowerCase().includes(SITE_NAME.toLowerCase())
    ? title
    : `${title}${TITLE_SUFFIX}`;
}

export function formatMetaDescription(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

interface CreateMetadataOptions {
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function createPageMetadata(
  config: SeoPageConfig,
  overrides: Partial<CreateMetadataOptions> = {},
): Metadata {
  return createMetadata({
    path: overrides.path ?? "/",
    title: overrides.title ?? config.title,
    description: overrides.description ?? config.description,
    image: overrides.image ?? config.image,
    type: overrides.type,
    noIndex: overrides.noIndex,
  });
}

export function createMetadata({
  path,
  title,
  description,
  image = seoPages[path as SeoPagePath]?.image ?? "/art/finance-editorial-v3.webp",
  type = "website",
  noIndex = false,
}: CreateMetadataOptions): Metadata {
  const draft = isSeoReview ? serviceDrafts.services.find((item) => item.path === path) : undefined;
  title = draft?.reviewTitle ?? title;
  description = draft?.reviewDescription ?? description;
  const canonical = absoluteUrl(path);
  const formattedTitle = formatSeoTitle(title);
  const formattedDescription = formatMetaDescription(description);
  const shouldIndex = isIndexableEnvironment && !noIndex;

  return {
    title: { absolute: formattedTitle },
    description: formattedDescription,
    alternates: { canonical, languages: languageAlternates(path) },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      url: canonical,
      title: formattedTitle,
      description: formattedDescription,
      locale: path.startsWith("/ar") ? "ar_AE" : "en_AE",
      images: [
        {
          url: absoluteUrl(image),
          alt: formattedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description: formattedDescription,
      images: [absoluteUrl(image)],
    },
  };
}
