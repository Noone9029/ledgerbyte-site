import { notFound } from "next/navigation";
import { ContentPage } from "@/components/accounting/content-page";
import { accountingPages } from "@/content/accounting";
import { createMetadata } from "@/lib/seo";

const entries = Object.entries(accountingPages).filter(
  ([key]) => key !== "home" && key !== "about" && !key.startsWith("services/"),
);
export function generateStaticParams() {
  return entries.map(([, page]) => ({ slug: page.path.slice(1).split("/") }));
}
async function resolve(params: Promise<{ slug: string[] }>) {
  const path = "/" + (await params).slug.join("/");
  const entry = entries.find(([, page]) => page.path === path);
  if (!entry) notFound();
  return entry;
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const [, page] = await resolve(params);
  return createMetadata({
    path: page.path,
    title: page.title,
    description: page.description,
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const [key] = await resolve(params);
  return <ContentPage pageKey={key} />;
}
