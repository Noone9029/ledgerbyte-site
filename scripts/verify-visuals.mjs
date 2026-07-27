import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const manifestPath = path.join(projectRoot, "src", "content", "visuals.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const expectedCounts = {
  financeServices: 8,
  technologyServices: 6,
  technologyPartnerships: 6,
};

const entries = [];

for (const [group, expectedCount] of Object.entries(expectedCounts)) {
  const groupEntries = Object.entries(manifest[group] ?? {});

  if (groupEntries.length !== expectedCount) {
    throw new Error(
      `${group} must contain ${expectedCount} visuals; found ${groupEntries.length}.`,
    );
  }

  for (const [slot, assetPath] of groupEntries) {
    entries.push([`${group}.${slot}`, assetPath]);
  }
}

entries.push(["technologyProcess", manifest.technologyProcess]);
entries.push(["financeOversight", manifest.financeOversight]);

const paths = entries.map(([, assetPath]) => assetPath);

if (new Set(paths).size !== paths.length) {
  const repeated = paths.filter(
    (assetPath, index) => paths.indexOf(assetPath) !== index,
  );
  throw new Error(`Repeated visual paths: ${[...new Set(repeated)].join(", ")}`);
}

const hashes = [];

for (const [slot, assetPath] of entries) {
  if (typeof assetPath !== "string" || !assetPath.startsWith("/art/")) {
    throw new Error(`${slot} must reference an asset in /art/.`);
  }

  const diskPath = path.join(
    projectRoot,
    "public",
    ...assetPath.replace(/^\//, "").split("/"),
  );
  await access(diskPath);
  const bytes = await readFile(diskPath);
  hashes.push([slot, createHash("sha256").update(bytes).digest("hex")]);
}

const hashValues = hashes.map(([, hash]) => hash);

if (new Set(hashValues).size !== hashValues.length) {
  const repeatedHashes = hashValues.filter(
    (hash, index) => hashValues.indexOf(hash) !== index,
  );
  const repeatedSlots = hashes
    .filter(([, hash]) => repeatedHashes.includes(hash))
    .map(([slot]) => slot);
  throw new Error(`Duplicate visual bytes used by: ${repeatedSlots.join(", ")}`);
}

console.log(
  `Visual uniqueness passed: ${entries.length} audited non-shared artwork slots use distinct files and bytes.`,
);
