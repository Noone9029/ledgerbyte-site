import { TeamGrid } from "@/components/accounting/content-page";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArabicPages, arabicServiceCards } from "@/lib/arabic-content";
import { createMetadata } from "@/lib/seo";
import { isSeoReview } from "@/lib/localization";
import { StructuredData } from "@/components/structured-data";
import { AccountingContactForm } from "@/components/accounting/contact-form";
import { ServiceFlashcards } from "@/components/accounting/service-flashcards";
import { ScrollReveals } from "@/components/motion/scroll-reveals";

type Props = { params: Promise<{ slug?: string[] }>; searchParams: Promise<{ service?: string }> };
async function resolve(params: Props["params"]) {
  const path = "/ar" + ((await params).slug?.length ? "/" + (await params).slug!.join("/") : "");
  return getArabicPages().find((page) => page.path === path);
}
export const dynamicParams = false;

export function generateStaticParams() { return getArabicPages().map((page) => ({ slug: page.path.slice(4).split("/").filter(Boolean) })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await resolve(params);
  return page ? createMetadata({ path: page.path, title: page.title, description: page.description, noIndex: isSeoReview }) : {};
}
export default async function ArabicPage({ params, searchParams }: Props) {
  const page = await resolve(params);
  if (!page) notFound();
  const isHome = page.englishPath === "/", isCatalogue = page.englishPath === "/finance/services", isContact = page.englishPath === "/contact";
  const detailPaths = getArabicPages().map((item) => item.path);
  const cards = arabicServiceCards.map((service) => ({ ...service, href: detailPaths.includes(`/ar/finance/services/${service.slug}`) ? `/ar/finance/services/${service.slug}` : `/finance/services/${service.slug}` }));
  const service = cards.find((item) => `/finance/services/${item.slug}` === page.englishPath);
  return <main id="main-content" className="accounting-page arabic-page">
    <ScrollReveals />
    <section className={`${isHome ? "accounting-home-hero" : "arabic-page-hero"} accounting-wrap`}>
      <div><p className="eyebrow">محاسبة. ضرائب. استشارات.</p><h1>{page.title}</h1><p className="accounting-lead" data-aeo-answer>{page.intro}</p>
        {!isContact && <Link className="button button-amber" href={`/ar/contact${service ? "?service=" + encodeURIComponent(service.englishTitle) : ""}`}>ناقش متطلباتك ↗</Link>}
      </div>
      {isHome && <figure className="accounting-hero-figure"><div className="accounting-hero-image"><Image src="/art/finance-editorial-v3.webp" alt="رسم يربط السجلات المحاسبية بالتقارير والتخطيط" width={1536} height={1024} priority sizes="(max-width:900px) 90vw,44vw" /></div></figure>}
    </section>
    {(isHome || isCatalogue) && <section className="accounting-wrap arabic-service-section" data-scroll-reveal><h2>اختر الخدمة المناسبة</h2><ServiceFlashcards services={isHome ? cards.filter((item) => item.arabicDetail) : cards} label="الخدمات المحاسبية والمالية" locale="ar" /></section>}
    <div className="accounting-wrap arabic-reading">{page.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((text) => <p key={text}>{text}</p>)}{section.bullets.length > 0 && <ul>{section.bullets.map((text) => <li key={text}>{text}</li>)}</ul>}</section>)}</div>
    {page.englishPath === "/regions" && <nav className="accounting-wrap arabic-market-grid" aria-label="الأسواق">{getArabicPages().filter((item) => item.englishPath.startsWith("/regions/")).map((item) => <Link href={item.path} key={item.path}>{item.title} ↗</Link>)}</nav>}
    {isContact && <section className="accounting-wrap arabic-reading"><h2>استفسار بالبريد الإلكتروني</h2><AccountingContactForm locale="ar" initialService={(await searchParams).service || ""} /><p><a href="https://wa.me/971561371569">تواصل عبر واتساب ↗</a></p><p>يفتح واتساب عند اختياره. راجع الرسالة وأرسلها بنفسك داخل واتساب.</p></section>}
    {(isHome || page.englishPath === "/about") && <section className="accounting-team accounting-wrap" data-scroll-reveal><h2>فريق وراء السجلات والتقارير والقرارات التالية.</h2><p>روابط الملفات الشخصية متاحة بالإنجليزية.</p><TeamGrid locale="ar" /></section>}
    {page.faqs.length > 0 && <section className="accounting-wrap arabic-reading"><h2>أسئلة شائعة</h2>{page.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>}
    <StructuredData data={{ "@context": "https://schema.org", "@type": service ? "Service" : "WebPage", name: page.title, description: page.intro, url: `https://ledgerbyte.io${page.path}`, inLanguage: "ar", ...(service ? { provider: { "@id": "https://ledgerbyte.io/#organization" } } : {} ) }} />
  </main>;
}
