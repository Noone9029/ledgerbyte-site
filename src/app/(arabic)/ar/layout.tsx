import { insightsArabicUrl } from "@/lib/review-links";
import { arabicThemeInitializer } from "@/lib/arabic-theme";
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import localFont from "next/font/local";
import { SiteAnalytics } from "@/components/analytics/site-analytics";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { accountingContact } from "@/content/accounting";
import { availableArabicPairs, isSeoReview } from "@/lib/localization";
import "../../globals.css";

const arabic = localFont({ src: "../../../../public/fonts/noto-sans-arabic.woff2", variable: "--font-arabic", display: "swap", preload: false });
export const metadata: Metadata = { metadataBase: new URL("https://ledgerbyte.io"), robots: isSeoReview ? { index: false, follow: false } : undefined };
export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  const pairs = availableArabicPairs();
  return <html lang="ar" dir="rtl" className={arabic.variable} suppressHydrationWarning><body>
    <Script id="ledgerbyte-theme" strategy="beforeInteractive">{arabicThemeInitializer}</Script>
    <a className="skip-link" href="#main-content">انتقل إلى المحتوى</a>
    <header className="accounting-header"><div className="accounting-header-inner">
      <Link className="arabic-brand" href="/ar" aria-label="LedgerByte الصفحة الرئيسية">LEDGERBYTE<span>محاسبة. ضرائب. استشارات.</span></Link>
      <nav className="arabic-nav" aria-label="التنقل الرئيسي"><Link href="/ar/finance/services">الخدمات</Link><Link href="/ar/about">من نحن</Link><Link href="/ar/how-we-work">كيف نعمل</Link><Link href={insightsArabicUrl()}>المدونة</Link><Link href="/ar/regions">الأسواق</Link><Link href="/ar/contact">تواصل معنا</Link></nav>
      <ThemeToggle locale="ar" />
    </div></header>
    <LanguageSwitcher pairs={pairs} locale="ar" />
    {isSeoReview && <aside className="accounting-preview-notice">مسودة للمراجعة الخاصة — تحتاج إلى مراجعة مالية ولغوية وموافقة حيدر قبل النشر. <Link href="/seo-review" lang="en">Review index ↗</Link></aside>}
    {children}
    <footer className="arabic-footer accounting-wrap"><p>LedgerByte · الشارقة، الإمارات العربية المتحدة</p><nav aria-label="روابط التواصل"><a href="mailto:info@ledgerbyte.io" dir="ltr">info@ledgerbyte.io</a><a href="tel:+971561371569" dir="ltr">+971 56 137 1569</a><a href="https://wa.me/971561371569">واتساب</a><Link href="/privacy-policy" lang="en">Privacy policy (English)</Link></nav></footer>
    <SiteAnalytics allowedPaths={pairs.map((pair) => pair.ar)} />
    <FloatingWhatsApp href={accountingContact.social.whatsapp} />
  </body></html>;
}
