import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

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
const sourceRoot = path.join(projectRoot, "src");
const generatedRoot = path.join(sourceRoot, "content", "generated");
const userProvidedCopyPath = path.join(
  sourceRoot,
  "content",
  "user-provided.json",
);
const seoCopyPath = path.join(sourceRoot, "content", "seo.json");
const textExtensions = new Set([
  ".txt",
  ".html",
  ".js",
  ".json",
  ".xml",
  ".md",
  ".csv",
]);

const walk = (root, predicate) => {
  const results = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) results.push(...walk(absolute, predicate));
    else if (predicate(absolute)) results.push(absolute);
  }
  return results;
};

const decodeEntities = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&apos;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&nbsp;", " ")
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .replaceAll("’", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"');

const normalize = (value) =>
  decodeEntities(value)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9%+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const archiveFiles = walk(archiveRoot, (file) =>
  textExtensions.has(path.extname(file).toLowerCase()),
);
const userProvidedCopy = JSON.parse(
  fs.readFileSync(userProvidedCopyPath, "utf8"),
);
const userProvidedValues = Object.values(userProvidedCopy)
  .map((entry) => entry.value)
  .filter((value) => typeof value === "string");
const approvedCorpus = normalize(
  [
    ...archiveFiles.map((file) => fs.readFileSync(file, "utf8")),
    ...userProvidedValues,
  ].join("\n"),
);

const failures = [];
const checked = [];

const checkCopy = (value, origin) => {
  const raw = value.trim();
  if (
    /^\d{2}$/.test(raw) ||
    raw.startsWith(".") ||
    raw.startsWith("#") ||
    raw.includes("(max-width:") ||
    raw.includes("prefers-reduced-motion") ||
    raw.includes("prefers-color-scheme")
  ) {
    return;
  }
  const candidate = normalize(value);
  const wordCount = candidate.split(" ").filter(Boolean).length;
  if (candidate.length < 28 || wordCount < 4) return;
  checked.push({ origin, value });
  if (!approvedCorpus.includes(candidate)) failures.push({ origin, value });
};

const skippedDataKeys = new Set([
  "division",
  "slug",
  "source",
  "sourceHtml",
  "href",
  "image",
]);

const validateData = (value, origin, key = "") => {
  if (typeof value === "string") {
    if (!skippedDataKeys.has(key)) checkCopy(value, origin);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      validateData(item, `${origin}[${index}]`, key),
    );
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([childKey, child]) =>
      validateData(child, `${origin}.${childKey}`, childKey),
    );
  }
};

for (const file of walk(generatedRoot, (candidate) =>
  candidate.endsWith(".json"),
)) {
  validateData(
    JSON.parse(fs.readFileSync(file, "utf8")),
    path.relative(projectRoot, file),
  );
}

validateData(
  JSON.parse(fs.readFileSync(seoCopyPath, "utf8")),
  path.relative(projectRoot, seoCopyPath),
);

const ignoredPropertyNames = new Set([
  "className",
  "href",
  "src",
  "alt",
  "id",
  "name",
  "type",
  "rel",
  "target",
  "sizes",
  "canonical",
  "url",
  "item",
  "path",
  "source",
  "sourceHtml",
  "slug",
  "image",
]);

const isIgnoredString = (node) => {
  const parent = node.parent;
  if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) {
    return true;
  }
  if (ts.isJsxAttribute(parent)) {
    return ignoredPropertyNames.has(parent.name.getText());
  }
  if (ts.isPropertyAssignment(parent)) {
    const propertyName = parent.name.getText().replaceAll(/['"]/g, "");
    return ignoredPropertyNames.has(propertyName) || propertyName.startsWith("@");
  }
  return false;
};

for (const file of walk(sourceRoot, (candidate) => candidate.endsWith(".tsx"))) {
  const sourceText = fs.readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const visit = (node) => {
    if (ts.isJsxText(node)) {
      const text = decodeEntities(node.getText(sourceFile)).replace(/\s+/g, " ");
      checkCopy(text, `${path.relative(projectRoot, file)}:${sourceFile.getLineAndCharacterOfPosition(node.pos).line + 1}`);
    } else if (
      (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) &&
      !isIgnoredString(node)
    ) {
      checkCopy(
        node.text,
        `${path.relative(projectRoot, file)}:${sourceFile.getLineAndCharacterOfPosition(node.pos).line + 1}`,
      );
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

if (failures.length) {
  console.error(
    `Content provenance failed: ${failures.length} string(s) were not found in ledgerbyte-site-archive-v2.`,
  );
  failures.forEach(({ origin, value }) =>
    console.error(`- ${origin}\n  ${value}`),
  );
  process.exit(1);
}

console.log(
  `Content provenance passed: ${checked.length} marketing strings matched ledgerbyte-site-archive-v2 or recorded user-provided copy.`,
);
