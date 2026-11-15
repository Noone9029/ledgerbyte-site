import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

function environment(pathname = "/contact") {
  const source = readFileSync(new URL("../src/lib/analytics.ts", import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const jar = new Map(), events = [], window = { gtag: (...args) => events.push(JSON.parse(JSON.stringify(args))) };
  const document = { referrer: "https://chatgpt.com/c/private-conversation?email=private@example.com" };
  Object.defineProperty(document, "cookie", { get: () => [...jar].map(([key,value]) => `${key}=${value}`).join("; "), set: (value) => { const [pair] = value.split(";"); const [key, val] = pair.split("="); if (value.includes("Max-Age=0")) jar.delete(key); else jar.set(key, val); } });
  const exports = {};
  const serviceIds = JSON.parse(readFileSync(new URL("../src/content/service-identifiers.json", import.meta.url), "utf8"));
  runInNewContext(code, { exports, require: () => ({ default: serviceIds }), window, document, location: { pathname, hostname: "ledgerbyte.io", protocol: "https:", search: "?email=private@example.com" }, URL, URLSearchParams });
  return { api: exports, jar, events, window };
}

test("events require an explicit consent even when a tag function exists", () => {
  const { api, jar, events } = environment();
  api.configureAnalytics(true, ["/contact"]);
  assert.equal(api.trackEvent("generate_lead"), false);
  jar.set("ledgerbyte-analytics-consent", "denied");
  assert.equal(api.trackEvent("generate_lead"), false); assert.equal(events.length, 0);
});
test("accepted-enquiry events discard every caller supplied personal field", () => {
  const { api, jar, events } = environment(); jar.set("ledgerbyte-analytics-consent", "granted"); api.configureAnalytics(true, ["/contact"]);
  assert.equal(api.trackEvent("generate_lead", { method: "email", email: "person@example.com", message: "private", company: "private", location: "private", enquiryId: "secret", page_path: "/contact?email=person@example.com", service_slug: "private" }), true);
  assert.deepEqual(events, [["event", "generate_lead", { page_path: "/contact", locale: "en", method: "email" }]]);
});
test("unknown paths and referrer queries cannot expose user input", () => {
  const { api, jar, events } = environment("/private/person@example.com"); jar.set("ledgerbyte-analytics-consent", "granted"); api.configureAnalytics(true, ["/contact"]);
  api.trackEvent("contact_email"); assert.equal(events[0][2].page_path, "/404");
  assert.equal(api.analyticsReferrer("https://example.org/private?q=person@example.com#secret"), "https://example.org");
  assert.equal(api.analyticsReferrer("https://blog.ledgerbyte.io/private?q=secret"), "");
  assert.equal(api.analyticsReferrer("javascript:alert(1)"), "");
});
test("AI referrals identify a known source without conversation paths or arbitrary subdomains", () => {
  const { api, jar, events } = environment(); jar.set("ledgerbyte-analytics-consent", "granted"); api.configureAnalytics(true, ["/contact"]);
  assert.equal(api.classifyAiReferrer("https://chatgpt.com.attacker.example/"), null);
  assert.equal(api.classifyAiReferrer("https://private.chatgpt.com/c/secret").hostname, "chatgpt.com");
  api.trackEvent("ai_referral_session");
  assert.deepEqual(events[0][2], { page_path: "/contact", locale: "en", ai_source: "chatgpt", referral_host: "chatgpt.com" });
});
test("withdrawing consent stops subsequent events and removes analytics cookies", () => {
  const { api, jar, events, window } = environment(); jar.set("ledgerbyte-analytics-consent", "granted"); jar.set("_ga", "sample"); jar.set("_ga_QVGSMZ73D1", "sample"); api.configureAnalytics(true, ["/contact"]);
  api.revokeAnalytics("G-QVGSMZ73D1");
  assert.equal(api.trackEvent("generate_lead"), false); assert.equal(events.length, 0); assert.equal(jar.has("_ga"), false); assert.equal(jar.has("_ga_QVGSMZ73D1"), false); assert.equal(window["ga-disable-G-QVGSMZ73D1"], true);
});
