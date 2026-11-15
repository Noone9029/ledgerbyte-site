import "server-only";
import { createHash } from "node:crypto";
import serviceMap from "@/content/seo-drafts/service-map.json";
import privacy from "@/content/seo-drafts/privacy.json";
import release from "@/content/seo-release.json";
export function englishCopyApproved(kind: "englishServices" | "privacy") {
  const record = release[kind] as { status: string; approvedBy: string | null; approvedAt: string | null; approvedDigest: string | null };
  const content = kind === "englishServices" ? serviceMap : privacy;
  const digest = createHash("sha256").update(JSON.stringify(content)).digest("hex");
  return record.status === "approved" && Boolean(record.approvedBy && record.approvedAt && Number.isFinite(Date.parse(record.approvedAt)) && record.approvedDigest === digest);
}
export function englishApprovalDate(kind: "englishServices" | "privacy") { return englishCopyApproved(kind) ? String(release[kind].approvedAt) : null; }
