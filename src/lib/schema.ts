import { buildPersonId, buildPersonPath } from "@/lib/person-identity";
export { buildPersonId, buildPersonPath } from "@/lib/person-identity";
import { contactDetails, team } from "@/content";
import { getPageSeo, type SeoPagePath } from "@/content/seo";
import { homeUpdate } from "@/content/home-update";
import { absoluteUrl, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

export type JsonLdNode = Record<string, unknown>;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const serviceAreas = [
  "United Arab Emirates",
  "Saudi Arabia",
  "United States",
  "Pakistan",
].map((name) => ({ "@type": "Country", name }));

const sameAs = [
  "https://www.linkedin.com/company/ledger-byte/",
  "https://www.facebook.com/p/LedgerByte-61565427584875",
  "https://www.instagram.com/ledger_byte",
];

const postalAddress = {
  "@type": "PostalAddress",
  ...contactDetails.address,
};

export function buildSchemaGraph(...nodes: JsonLdNode[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function buildGlobalSchema(): JsonLdNode {
  return buildSchemaGraph(
    {
      "@type": ["Organization", "AccountingService"],
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/brand/ledgerbyte-mark.png"),
        width: 512,
        height: 512,
      },
      image: absoluteUrl("/art/finance-editorial-v3.webp"),
      email: contactDetails.email,
      telephone: contactDetails.phoneHref,
      address: postalAddress,
      areaServed: serviceAreas,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: contactDetails.email,
        telephone: contactDetails.phoneHref,
        availableLanguage: ["English"],
      },
      sameAs,
      employee: team.map((member) => ({
        "@id": buildPersonId(member.name),
      })),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: SITE_LANGUAGE,
      publisher: { "@id": ORGANIZATION_ID },
    },
  );
}

export function buildWebPageSchema({
  path,
  name,
  description,
  type = "WebPage",
  reviewedBy,
  dateModified,
}: {
  path: string;
  name: string;
  description: string;
  type?:
    | "WebPage"
    | "AboutPage"
    | "ContactPage"
    | "CollectionPage"
    | "ProfilePage";
  reviewedBy?: string;
  dateModified?: string;
}): JsonLdNode {
  const url = absoluteUrl(path);

  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: SITE_LANGUAGE,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    ...(dateModified ? { dateModified } : {}),
    ...(reviewedBy
      ? {
          reviewedBy: { "@id": reviewedBy },
        }
      : {}),
  };
}



export function buildPersonSchema({
  name,
  jobTitle,
  description,
  credentials,
  image,
  path,
}: {
  name: string;
  jobTitle: string;
  description: string;
  credentials: string;
  image?: string;
  path?: string;
}): JsonLdNode {
  const profilePath = path ?? buildPersonPath(name);

  return {
    "@type": "Person",
    "@id": buildPersonId(name),
    name,
    jobTitle,
    description,
    url: absoluteUrl(profilePath),
    mainEntityOfPage: {
      "@id": `${absoluteUrl(profilePath)}#webpage`,
    },
    ...(image ? { image: absoluteUrl(image) } : {}),
    worksFor: { "@id": ORGANIZATION_ID },
    hasCredential: credentials.split("|")[0].split(/[,;]/).map((entry) => ({
      "@type": "EducationalOccupationalCredential",
      name: entry.trim(),
    })),
  };
}

export function buildItemListSchema({
  name,
  items,
}: {
  name: string;
  items: Array<{ name: string; path: string }>;
}): JsonLdNode {
  return {
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildCollectionSchema(path: SeoPagePath, items: Array<{ name: string; path: string }>) {
  const { title: name, description, lastModified } = getPageSeo(path);
  const listId = absoluteUrl(path) + "#items";
  return buildSchemaGraph(
    { ...buildWebPageSchema({ path, name, description, dateModified: lastModified, type: "CollectionPage" }), mainEntity: { "@id": listId } },
    { ...buildItemListSchema({ name, items }), "@id": listId, numberOfItems: items.length },
  );
}

type UaeOffer = (typeof homeUpdate.offers)[number];

export function buildUaeOffer(offer: UaeOffer): JsonLdNode {
  return {
    "@type": "Offer",
    "@id": absoluteUrl(offer.href) + "#uae-offer",
    name: offer.name,
    description: [offer.fit, offer.description].join(" "),
    url: absoluteUrl(offer.href),
    seller: { "@id": ORGANIZATION_ID },
    eligibleRegion: { "@type": "Country", name: "United Arab Emirates" },
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      minPrice: offer.price,
      priceCurrency: "AED",
      ...(offer.unit ? { unitText: offer.unit.replace(/^\/\s*/, "") } : {}),
    },
  };
}

export function buildServiceSchema({
  path,
  name,
  description,
  serviceType,
  jurisdiction,
  offer,
}: {
  path: string;
  name: string;
  description: string;
  serviceType?: string | string[];
  jurisdiction?: string;
  offer?: UaeOffer;
}): JsonLdNode {
  const url = absoluteUrl(path);

  return {
    "@type": "Service",
    "@id": `${url}#service`,
    url,
    name,
    description,
    serviceType: serviceType ?? name,
    provider: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: { "@id": url + "#webpage" },
    ...(offer ? { offers: buildUaeOffer(offer) } : {}),
    areaServed: jurisdiction ? [{ "@type": "Country", name: jurisdiction }] : serviceAreas,
  };
}

export function buildFaqSchema(
  faqs: Array<{ question: string; answer: string }>,
): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/\[([^\]]+)\]\((?:https?:\/\/|\/)[^\s)]+\)/g, "$1"),
      },
    })),
  };
}

export function buildAboutSchema(description: string): JsonLdNode {
  return buildSchemaGraph(
    buildWebPageSchema({
      path: "/about",
      name: "About LedgerByte",
      description,
      type: "AboutPage",
    }),
    {
      "@type": "ItemList",
      name: "LedgerByte Team",
      itemListElement: team.map((member, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: buildPersonSchema({
          name: member.name,
          jobTitle: member.role,
          description: member.description,
          credentials: member.credentials,
          image: member.image,
          path: buildPersonPath(member.name),
        }),
      })),
    },
  );
}
