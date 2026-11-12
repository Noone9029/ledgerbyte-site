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
  Object.entries(handoff.page_copy).map(([key, page]) => [
    key,
    services.some((s) => s.key === key)
      ? `/finance/services/${services.find((s) => s.key === key).slug}`
      : page.target.path,
  ]),
);
paths.services = "/finance/services";
const pages = Object.fromEntries(
  Object.entries(handoff.page_copy).map(([key, page]) => [
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
    .filter((change) => ["C01", "C03", "C06", "C08", "C10"].includes(change.id))
    .map((change) => [change.id, change.replacement]),
);
const content = {
  sourceDate: "2026-11-10",
  services,
  paths,
  pages,
  replacements,
  contact: handoff.shared_contact_and_social,
};
fs.writeFileSync(
  "src/content/accounting.json",
  JSON.stringify(content, null, 2) + "\n",
);
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
