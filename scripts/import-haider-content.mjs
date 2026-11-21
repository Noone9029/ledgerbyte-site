import fs from "node:fs";
import crypto from "node:crypto";

const inputPath = process.argv[2];
if (!inputPath)
  throw new Error("Pass the private November content handoff path.");
const raw = fs.readFileSync(inputPath, "utf8");
const handoff = JSON.parse(raw);
if (
  handoff.service_changes.length !== 22 ||
  Object.keys(handoff.page_copy).length !== 33
) {
  throw new Error("Unexpected handoff: expected 22 services and 33 pages.");
}
const pageCopy = Object.entries(handoff.page_copy);
const services = handoff.service_changes.map((service) => ({
  key: service.page_key,
  slug: service.current_url
    ? new URL(service.current_url).pathname.split("/").at(-1)
    : service.path.split("/").at(-1),
  title: service.name,
  group: service.group,
  summary: service.summary,
  output: service.typical_output,
  boundary: service.scope_boundary,
  audience: service.who_it_is_for,
}));
const paths = Object.fromEntries(
  pageCopy.map(([key, page]) => [
    key,
    services.some((s) => s.key === key)
      ? `/finance/services/${services.find((s) => s.key === key).slug}`
      : page.target.path,
  ]),
);
paths.services = "/finance/services";
paths.regions = "/regions";
paths.insights = "/insights";
paths["build-your-finance-department"] = "/build-your-finance-department";
const pages = Object.fromEntries(
  pageCopy.map(([key, page]) => [
    key,
    {
      title: page.seo_title,
      description: page.seo_description,
      path: paths[key],
      ...page.replacement_content,
    },
  ]),
);
const replacements = Object.fromEntries(
  handoff.changes
    .filter((change) => ["C01", "C06", "C08", "C10"].includes(change.id))
    .map((change) => [change.id, change.replacement]),
);
for (const page of Object.values(pages)) {
  for (const link of page.related) {
    const key = link.target?.page_key ?? link.route;
    if (!paths[key]) throw new Error(`Unmapped related content target: ${key}`);
  }
}
// The supplied payroll bibliography used a ministry attachment that no longer loads.
const payrollRegulationSource = "[UAE Cabinet Resolution No. 1 of 2022, Article 16 (Arabic PDF, p. 80)](https://assets.u.ae/api/public/content/06fd4e5b72d646c8abe247fa4ff83104?v=946ce745#page=80)";
for (const section of pages["services/payroll-wps"].sections) {
  section.paragraphs = section.paragraphs.map((paragraph) =>
    paragraph.replace(/\[MoHRE employment law and executive-regulation text, Article 16 of the Executive Regulations\]\(https:\/\/www\.mohre\.gov\.ae\/assets\/download\/[^)]+\)/, payrollRegulationSource),
  );
}
const content = {
  sourceDate: "2026-11-10",
  services,
  paths,
  pages,
  replacements,
  contact: handoff.shared_contact_and_social,
};
// The supplied handoff covers both divisions. Publish only the finance catalogue.
delete replacements.C01.technology_link_label;
delete replacements.C01.technology_url;
delete content.contact.social.technology;
delete content.contact.social.trustpilot;
if (Array.isArray(pages.home.section_order)) {
  pages.home.section_order = pages.home.section_order.map(section =>
    /trustpilot|client reviews/i.test(section) ? "Worked example" : section,
  );
}
replacements.C06.service_count = services.length;
for (const section of pages.about.sections) {
  section.paragraphs = section.paragraphs.map((paragraph) =>
    paragraph.replace(/ This website is dedicated to that finance work;[^.]+ledgerbyte[.]co[.]/, ""),
  );
}
for (const section of pages["services/accounting-automation-systems"].sections) {
  section.paragraphs = section.paragraphs.map((paragraph) =>
    paragraph.replace("Custom applications, bespoke integrations and wider technology projects belong in a separate technology scope. ", ""),
  );
}
pages.about.faqs = pages.about.faqs.filter((item) => item.question !== "Where can we explore technology services?");
for (const item of pages["regions/saudi-arabia"].faqs) {
  item.answer = item.answer.replace(" Accounting-side coordination is scoped here; wider technology work belongs at LedgerByte Tech.", "");
}
fs.writeFileSync(
  "src/content/accounting.json",
  JSON.stringify(content, null, 2) + "\n",
);
const discovery = [
  "# LedgerByte",
  "",
  "> " + pages.home.intro,
  "",
  "## Services",
  "",
  ...services.map(
    (service) =>
      `- [${service.title}](https://ledgerbyte.io${paths[service.key]})`,
  ),
  "",
  "## Markets",
  "",
  ...Object.entries(pages)
    .filter(([key]) => key.startsWith("regions/"))
    .map(
      ([, page]) => `- [${page.heading}](https://ledgerbyte.io${page.path})`,
    ),
  "",
  "## Practical guides",
  "",
  ...Object.entries(pages)
    .filter(([key]) => key.startsWith("insights/"))
    .map(
      ([, page]) => `- [${page.heading}](https://ledgerbyte.io${page.path})`,
    ),
  "",
  "## LedgerByte",
  "",
  "- [About us](https://ledgerbyte.io/about)",
  "- [Build your finance department](https://ledgerbyte.io/build-your-finance-department)",
  "- [How we work](https://ledgerbyte.io/how-we-work)",
  "- [UAE VAT return filing](https://ledgerbyte.io/uae-vat)",
  "- [Markets](https://ledgerbyte.io/regions)",
  "- [Contact](https://ledgerbyte.io/contact)",
  "- [LedgerByte Insights](https://blog.ledgerbyte.io)",
  "",
];
fs.writeFileSync("public/llms.txt", discovery.join("\n"));
const approved = JSON.parse(
  fs.readFileSync("src/content/user-provided.json", "utf8"),
);
const strings = [];
function visit(value) {
  if (typeof value === "string") strings.push(value);
  else if (Array.isArray(value)) value.forEach(visit);
  else if (value && typeof value === "object")
    Object.values(value).forEach(visit);
}
visit(content);
approved.haiderNovember2026 = {
  value: strings.join("\n"),
  source:
    "Haider's November 10 replacement content, prepared for private review only",
  sha256: crypto.createHash("sha256").update(raw).digest("hex"),
};
fs.writeFileSync(
  "src/content/user-provided.json",
  JSON.stringify(approved, null, 2) + "\n",
);
console.log(
  `Imported ${services.length} services and ${Object.keys(pages).length} pages; original handoff stays private.`,
);
