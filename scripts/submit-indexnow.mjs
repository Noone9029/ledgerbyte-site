import process from "node:process";

const INDEX_NOW_KEY =
  "97ca97ace89ec9975938643a29c54e5a118979431ab8718422d6a7bdf715d0b3";
const siteOrigin = new URL(
  process.env.INDEXNOW_SITE_URL ?? "https://ledgerbyte.io",
);
const endpoint =
  process.env.INDEXNOW_ENDPOINT ?? "https://api.indexnow.org/indexnow";
const keyLocation = new URL(`/${INDEX_NOW_KEY}.txt`, siteOrigin).toString();
const dryRun = process.argv.includes("--dry-run");
const requestedUrls = process.argv
  .slice(2)
  .filter((argument) => !argument.startsWith("--"));

async function readSitemapUrls() {
  const sitemapUrl = new URL("/sitemap.xml", siteOrigin);
  const response = await fetch(sitemapUrl, {
    headers: { "user-agent": "LedgerByte-IndexNow/1.0" },
  });

  if (!response.ok) {
    throw new Error(
      `Could not read ${sitemapUrl}: ${response.status} ${response.statusText}`,
    );
  }

  const xml = await response.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    match[1].replaceAll("&amp;", "&"),
  );
}

function validateUrls(urls) {
  const uniqueUrls = [...new Set(urls)];

  if (!uniqueUrls.length) {
    throw new Error("No URLs were supplied or discovered in the sitemap.");
  }
  if (uniqueUrls.length > 10_000) {
    throw new Error("IndexNow accepts at most 10,000 URLs per request.");
  }

  for (const value of uniqueUrls) {
    const url = new URL(value, siteOrigin);
    if (url.origin !== siteOrigin.origin) {
      throw new Error(`Refusing to submit a different host: ${url}`);
    }
    if (url.protocol !== "https:") {
      throw new Error(`Refusing to submit a non-HTTPS URL: ${url}`);
    }
  }

  return uniqueUrls.map((value) => new URL(value, siteOrigin).toString());
}

async function verifyPublicKey() {
  const response = await fetch(keyLocation, {
    headers: { "user-agent": "LedgerByte-IndexNow/1.0" },
  });
  const value = response.ok ? (await response.text()).trim() : "";

  if (!response.ok || value !== INDEX_NOW_KEY) {
    throw new Error(
      `IndexNow key verification failed at ${keyLocation}. Deploy the key file before submitting.`,
    );
  }
}

const urls = validateUrls(
  requestedUrls.length ? requestedUrls : await readSitemapUrls(),
);
const payload = {
  host: siteOrigin.hostname,
  key: INDEX_NOW_KEY,
  keyLocation,
  urlList: urls,
};

if (dryRun) {
  console.log(JSON.stringify({ endpoint, ...payload }, null, 2));
  process.exit(0);
}

await verifyPublicKey();

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "content-type": "application/json; charset=utf-8",
    "user-agent": "LedgerByte-IndexNow/1.0",
  },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  const body = (await response.text()).slice(0, 500);
  throw new Error(
    `IndexNow rejected the submission: ${response.status} ${response.statusText} ${body}`,
  );
}

console.log(
  `IndexNow accepted ${urls.length} LedgerByte URL(s) with HTTP ${response.status}.`,
);
