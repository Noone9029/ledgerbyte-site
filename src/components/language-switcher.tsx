"use client";
import { usePathname } from "next/navigation";

export function LanguageSwitcher({ pairs, locale }: { pairs: { en: string; ar: string }[]; locale: "en" | "ar" }) {
  const pathname = usePathname();
  const pair = pairs.find((item) => item[locale] === pathname);
  if (!pair) return null;
  return <nav className="language-switcher accounting-wrap" aria-label={locale === "ar" ? "اللغة" : "Language"}><a href={locale === "ar" ? pair.en : pair.ar} lang={locale === "ar" ? "en" : "ar"} hrefLang={locale === "ar" ? "en" : "ar"}>{locale === "ar" ? "English" : "العربية"}</a></nav>;
}
