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
const techTextRoot = path.join(
  archiveRoot,
  "rendered-text",
  "tech.ledgerbyte.io",
);
const financeHtmlRoot = path.join(
  archiveRoot,
  "ledgerbyte.io",
  "pages",
  "services",
);
const outputRoot = path.join(projectRoot, "src", "content", "generated");

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
      relatedResources.push({
        pillar: resourceLines[index - 3],
        title: resourceLines[index - 2],
        description: resourceLines[index - 1],
        href: "https://blog.ledgerbyte.io",
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
    relatedServices,
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

const techServiceTitles = [
  "Web Development",
  "Mobile App Development",
  "Backend & APIs",
  "AI & Automation",
  "Cloud & DevOps",
  "UI/UX Design",
];

const technologySlugs = {
  "Web Development": "web-development",
  "Mobile App Development": "mobile-app-development",
  "Backend & APIs": "backend-apis",
  "AI & Automation": "ai-automation",
  "Cloud & DevOps": "cloud-devops",
  "UI/UX Design": "ui-ux-design",
};

const parseTechnologyServices = () => {
  const textPath = path.join(techTextRoot, "services.txt");
  const lines = readLines(textPath);
  const endIndex = lines.indexOf("Not Sure Which Service You Need?");

  return techServiceTitles.map((title, serviceIndex) => {
    const titleIndex = lines.indexOf(title);
    const nextTitle = techServiceTitles[serviceIndex + 1];
    const blockEnd = nextTitle ? lines.indexOf(nextTitle) : endIndex;
    const block = lines.slice(titleIndex, blockEnd);
    const featuresIndex = block.indexOf("KEY FEATURES");
    const technologiesIndex = block.indexOf("Technologies");

    return {
      division: "technology",
      slug: technologySlugs[title],
      source: path
        .relative(archiveRoot, textPath)
        .replaceAll(path.sep, "/"),
      title,
      description: block[1],
      features: block.slice(featuresIndex + 1, technologiesIndex),
      technologies: block.slice(technologiesIndex + 1),
    };
  });
};

const parseTechnologyProcess = () => {
  const textPath = path.join(techTextRoot, "process.txt");
  const lines = readLines(textPath);
  const titles = ["Discover", "Design", "Develop", "Test", "Deploy", "Support"];

  return {
    source: path.relative(archiveRoot, textPath).replaceAll(path.sep, "/"),
    title: "Our Development Process",
    description:
      "A proven methodology that delivers exceptional results, from initial concept to ongoing support",
    steps: titles.map((title) => {
      const titleIndex = lines.indexOf(title);
      return {
        title,
        description: lines[titleIndex + 1],
        step: lines[titleIndex + 2],
      };
    }),
  };
};

const financeServices = fs
  .readdirSync(financeTextRoot)
  .filter((fileName) => /^services__.*\.txt$/.test(fileName))
  .sort()
  .map(parseFinanceService);

const technologyServices = parseTechnologyServices();
const technologyProcess = parseTechnologyProcess();

fs.mkdirSync(outputRoot, { recursive: true });
fs.writeFileSync(
  path.join(outputRoot, "finance-services.json"),
  `${JSON.stringify(financeServices, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(outputRoot, "technology-services.json"),
  `${JSON.stringify(technologyServices, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(outputRoot, "technology-process.json"),
  `${JSON.stringify(technologyProcess, null, 2)}\n`,
);

console.log(
  `Extracted ${financeServices.length} finance services, ${technologyServices.length} technology services, and ${technologyProcess.steps.length} technology process steps.`,
);
