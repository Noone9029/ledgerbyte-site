import { serviceSamples } from "@/content/service-samples";

const samples = Object.values(serviceSamples).filter(sample => sample !== undefined);
export const dynamicParams = false;
export function generateStaticParams() {
  return samples.map(({ file }) => ({ file }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const sample = samples.find(item => item.file === file);
  if (!sample) return new Response(null, { status: 404 });

  const records = [sample.columns, ...sample.rows];
  const csv = records.map(row => row.map(field => `"${String(field).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  return new Response("\uFEFF" + csv + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ledgerbyte-illustrative-${file}"`,
      "X-Robots-Tag": "noindex",
    },
  });
}
