import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const bundledArchiveRoot = path.join(
  projectRoot,
  "content-source",
  "ledgerbyte-site-archive-v2",
);
const siblingArchiveRoot = path.resolve(
  projectRoot,
  "..",
  "ledgerbyte-site-archive-v2",
);
const archiveRoot = fs.existsSync(bundledArchiveRoot)
  ? bundledArchiveRoot
  : siblingArchiveRoot;
const financeTextRoot = path.join(
  archiveRoot,
  "rendered-text",
  "ledgerbyte.io",
);
const financeHtmlRoot = path.join(
  archiveRoot,
  "ledgerbyte.io",
  "pages",
  "services",
);
const outputRoot = path.join(projectRoot, "src", "content", "generated");

const blogArticleUrls = {
  "Cloud Accounting Tools Worth Standardizing":
    "https://blog.ledgerbyte.io/cloud-accounting-2025-the-tools-every-business-should-adopt-and-why",
  "The Hidden Cost of Manual Accounting":
    "https://blog.ledgerbyte.io/the-hidden-cost-of-manual-accounting-how-automation-saves-time-money-and-mistakes",
  "Finance Operations Setup for Startups":
    "https://blog.ledgerbyte.io/setting-up-finance-operations-for-startups-the-complete-playbook",
  "Why Monthly Reporting Drives Better Decisions":
    "https://blog.ledgerbyte.io/why-monthly-financial-reporting-is-the-backbone-of-smart-business-decisions",
  "When to Build an Outsourced Finance Department":
    "https://blog.ledgerbyte.io/the-rise-of-outsourced-finance-departments-when-businesses-should-make-the-switch",
  "Cash Flow Forecasting That Leaders Can Use":
    "https://blog.ledgerbyte.io/cash-flow-forecasting-why-it-matters-and-how-remote-teams-excel",
  "Why Monthly Financial Reviews Matter":
    "https://blog.ledgerbyte.io/why-monthly-financial-reviews-matter-more-than-annual-audits-for-growing-businesses",
  "The Modern CFO: Strategy Beyond Bookkeeping":
    "https://blog.ledgerbyte.io/the-modern-cfo-how-strategic-advisory-is-replacing-traditional-bookkeeping",
  "Why Cash Flow Breaks Even When Sales Grow":
    "https://blog.ledgerbyte.io/why-many-smes-struggle-with-cash-flow-even-when-sales-are-growing",
  "From Numbers to Decisions":
    "https://blog.ledgerbyte.io/from-numbers-to-decisions-how-management-reporting-drives-smarter-leadership",
  "Why Businesses Need a Finance Partner":
    "https://blog.ledgerbyte.io/advisory-over-compliance-why-businesses-need-a-finance-partner-not-just-an-accountant",
  "Financial Controls for Remote Teams":
    "https://blog.ledgerbyte.io/financial-controls-for-remote-teams-best-practices-for-a-zero-error-finance-function",
  "How to Prepare Before the Audit Notice Arrives":
    "https://blog.ledgerbyte.io/how-audit-ready-are-you-preparing-your-finance-function-before-the-audit-notice-arrives",
};

const readLines = (filePath) =>
  fs
    .readFileSync(filePath, "utf8")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const parseJsonLd = (html) => {
  const scripts = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
    ),
  ];

  return scripts.flatMap((match) => {
    try {
      return [JSON.parse(match[1])];
    } catch {
      return [];
    }
  });
};

const parseMeta = (html) => {
  const decodeEntities = (value) =>
    value
      .replaceAll("&amp;", "&")
      .replaceAll("&quot;", '"')
      .replaceAll("&#x27;", "'")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">");
  const title = decodeEntities(
    html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1] ?? "",
  );
  const description =
    html.match(/name="description" content="([^"]*)"/)?.[1] ?? "";
  const keywords =
    html
      .match(/name="keywords" content="([^"]*)"/)?.[1]
      ?.split(",")
      .map((keyword) => keyword.trim()) ?? [];

  const jsonLd = parseJsonLd(html);
  const faq =
    jsonLd.find((entry) => entry["@type"] === "FAQPage")?.mainEntity ?? [];

  return {
    title,
    description,
    keywords,
    faq: faq.map((entry) => ({
      question: entry.name,
      answer: entry.acceptedAnswer?.text ?? "",
    })),
  };
};

// The published team profiles supersede these fields in the legacy archive.
const reviewerUpdates = {
  "Haider Ali": { credentials: "CGMA, ACMA" },
  "Faisal Nawaz": { role: "Financial Controller" },
  "Sayyam Nasir": { role: "Fractional Controller" },
};

const parseFinanceService = (textFileName) => {
  const slug = textFileName
    .replace(/^services__/, "")
    .replace(/\.txt$/, "");
  const textPath = path.join(financeTextRoot, textFileName);
  const htmlPath = path.join(financeHtmlRoot, `${slug}.html`);
  const lines = readLines(textPath);
  const html = fs.readFileSync(htmlPath, "utf8");
  const meta = parseMeta(html);

  const focusIndex = lines.findIndex((line) =>
    line.startsWith("Primary focus:"),
  );
  const titleIndex = focusIndex + 1;
  const bookIndex = lines.indexOf("Book a consultation");
  const expertIndex = lines.indexOf("EXPERT REVIEWED");
  const idealIndex = lines.indexOf("IDEAL FOR");
  const overviewHeadingIndex = lines.findIndex((line) =>
    line.toLowerCase().includes("built around a dependable finance workflow"),
  );
  const deliverablesIndex = lines.indexOf("What we typically deliver");
  const platformsIndex = lines.indexOf("Platforms and workflow environments");
  const processIndex = lines.indexOf("How this engagement usually works");
  const trustIndex = lines.indexOf(
    "Why businesses trust LedgerByte on this work",
  );
  const examplesIndex = lines.indexOf("Typical engagement examples");
  const resourcesIndex = lines.indexOf(
    "Related resources from LedgerByte Insights",
  );
  const faqIndex = lines.indexOf("Frequently asked questions");
  const pairedIndex = lines.indexOf("Often paired with");
  const footerIndex = lines.indexOf("LB", pairedIndex);

  const process = [];
  for (let index = processIndex + 2; index < trustIndex; index += 1) {
    if (/^0[1-4]$/.test(lines[index])) {
      process.push({
        step: lines[index],
        title: lines[index + 1],
        description: lines[index + 2],
      });
    }
  }

  const engagementExamples = [];
  const exampleLines = lines.slice(examplesIndex + 1, resourcesIndex);
  exampleLines.forEach((line, index) => {
    if (line.startsWith("Challenge:") && exampleLines[index + 1]?.startsWith("Result:")) {
      engagementExamples.push({
        profile: exampleLines[index - 2],
        title: exampleLines[index - 1],
        challenge: line.replace(/^Challenge:\s*/, ""),
        result: exampleLines[index + 1].replace(/^Result:\s*/, ""),
      });
    }
  });

  const relatedResources = [];
  const resourceLines = lines.slice(resourcesIndex + 2, faqIndex);
  resourceLines.forEach((line, index) => {
    if (line === "Read insight") {
      const title = resourceLines[index - 2];
      relatedResources.push({
        pillar: resourceLines[index - 3],
        title,
        description: resourceLines[index - 1],
        href: blogArticleUrls[title] ?? "https://blog.ledgerbyte.io",
      });
    }
  });

  const relatedServices = [];
  const pairedLines = lines.slice(pairedIndex + 2, footerIndex);
  pairedLines.forEach((line, index) => {
    if (line === "View service") {
      relatedServices.push({
        category: pairedLines[index - 3],
        title: pairedLines[index - 2],
        description: pairedLines[index - 1],
      });
    }
  });

  const finalServiceLinkIndex = lines.lastIndexOf("View service", footerIndex);
  const faqQuestions = lines.slice(faqIndex + 2, pairedIndex);
  const faqs = faqQuestions.map((question) => ({
    question,
    answer:
      meta.faq.find((entry) => entry.question === question)?.answer ?? "",
  }));

  return {
    division: "finance",
    slug,
    source: path
      .relative(archiveRoot, textPath)
      .replaceAll(path.sep, "/"),
    sourceHtml: path
      .relative(archiveRoot, htmlPath)
      .replaceAll(path.sep, "/"),
    category: lines[focusIndex - 1],
    primaryFocus: lines[focusIndex].replace("Primary focus:", "").trim(),
    title: lines[titleIndex],
    description: lines[titleIndex + 1],
    outcomes: lines.slice(titleIndex + 2, bookIndex),
    reviewer: {
      name: lines[expertIndex + 1],
      role: lines[expertIndex + 2],
      credentials: lines[expertIndex + 3],
      summary: lines[expertIndex + 4],
      ...reviewerUpdates[lines[expertIndex + 1]],
    },
    idealFor: lines.slice(idealIndex + 1, overviewHeadingIndex),
    overviewHeading: lines[overviewHeadingIndex],
    overview: lines.slice(overviewHeadingIndex + 1, deliverablesIndex),
    deliverables: lines.slice(deliverablesIndex + 1, platformsIndex),
    platforms: lines.slice(platformsIndex + 1, processIndex),
    processIntro: lines[processIndex + 1],
    process,
    trustPoints: lines.slice(trustIndex + 1, examplesIndex),
    engagementExamples,
    relatedResources,
    faqs,
    relatedServices: relatedServices.filter((service) => service.title !== "Accounting Automation & Systems"),
    cta: {
      title: lines[finalServiceLinkIndex + 1],
      description: lines[finalServiceLinkIndex + 2],
    },
    seo: {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
    },
  };
};

const financeServices = fs
  .readdirSync(financeTextRoot)
  .filter((fileName) => /^services__.*\.txt$/.test(fileName) && fileName !== "services__accounting-automation-systems.txt")
  .sort()
  .map(parseFinanceService);

fs.mkdirSync(outputRoot, { recursive: true });
fs.writeFileSync(
  path.join(outputRoot, "finance-services.json"),
  `${JSON.stringify(financeServices, null, 2)}\n`,
);
console.log(`Extracted ${financeServices.length} archived finance services.`);
