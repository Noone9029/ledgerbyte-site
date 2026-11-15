export function buildPersonPath(name: string) {
  const slug = name.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `/about/team/${slug}`;
}
export function buildPersonId(name: string) { return `https://ledgerbyte.io${buildPersonPath(name)}#person`; }
