import {
  contactDetails,
  financeServices,
  team,
  technologyServices,
} from "@/content";
import { absoluteUrl, SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

export type JsonLdNode = Record<string, unknown>;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PROFESSIONAL_SERVICE_ID = `${SITE_URL}/#professional-service`;

const serviceAreas = [
  "United Arab Emirates",
  "Saudi Arabia",
  "United States",
  "United Kingdom",
].map((name) => ({ "@type": "Country", name }));

const sameAs = [
  "https://www.linkedin.com/company/ledger-byte/",
  "https://www.trustpilot.com/review/ledgerbyte.io",
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
  const serviceOffers = [...financeServices, ...technologyServices].map(
    (service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        url: absoluteUrl(
          `/${service.division}/services/${service.slug}`,
        ),
      },
    }),
  );

  return buildSchemaGraph(
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/brand/ledgerbyte-logo.png"),
        },
        image: absoluteUrl("/art/corporate-editorial-v3.webp"),
        email: contactDetails.email,
        telephone: contactDetails.phoneHref,
        address: postalAddress,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: contactDetails.email,
          telephone: contactDetails.phoneHref,
          availableLanguage: ["English"],
        },
        sameAs,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "LedgerByte Services",
          itemListElement: serviceOffers,
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: SITE_LANGUAGE,
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": ["ProfessionalService", "FinancialService"],
        "@id": PROFESSIONAL_SERVICE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        email: contactDetails.email,
        telephone: contactDetails.phoneHref,
        address: postalAddress,
        areaServed: serviceAreas,
        parentOrganization: { "@id": ORGANIZATION_ID },
      },
  );
}

export function buildWebPageSchema({
  path,
  name,
  description,
  type = "WebPage",
  reviewedBy,
}: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  reviewedBy?: string;
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
    ...(reviewedBy
      ? {
          reviewedBy: { "@id": reviewedBy },
        }
      : {}),
  };
}

export function buildPersonId(name: string) {
  const slug = name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${SITE_URL}/about#person-${slug}`;
}

export function buildPersonSchema({
  name,
  jobTitle,
  description,
  credentials,
  image,
}: {
  name: string;
  jobTitle: string;
  description: string;
  credentials: string;
  image?: string;
}): JsonLdNode {
  return {
    "@type": "Person",
    "@id": buildPersonId(name),
    name,
    jobTitle,
    description,
    ...(image ? { image: absoluteUrl(image) } : {}),
    worksFor: { "@id": ORGANIZATION_ID },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: credentials,
    },
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

export function buildServiceSchema({
  path,
  name,
  description,
  serviceType,
}: {
  path: string;
  name: string;
  description: string;
  serviceType?: string | string[];
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
    areaServed: serviceAreas,
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
        text: faq.answer,
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
          }),
        })),
      },
  );
}
