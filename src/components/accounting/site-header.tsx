import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { accountingGroups, accountingServices } from "@/content/accounting";
import { NavigationBehaviour } from "./navigation-behaviour";

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      <details className="accounting-services-menu">
        <summary>
          Services <span aria-hidden="true">+</span>
        </summary>
        <div className="accounting-mega">
          <Link className="accounting-menu-all" href="/finance/services">
            All 22 services
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link href="/build-your-finance-department">
            Build your finance department
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <div>
            {accountingGroups.map((group) => {
              const links = accountingServices
                  .filter((s) => s.group === group)
                  .map((service) => (
                    <Link
                      key={service.slug}
                      href={`/finance/services/${service.slug}`}
                    >
                      {service.title}
                    </Link>
                  ));
              return mobile ? (
                <details key={group} className="accounting-menu-group">
                  <summary>{group}</summary>
                  {links}
                </details>
              ) : (
                <section key={group}><h2>{group}</h2>{links}</section>
              );
            })}
          </div>
          <Link href="/uae-vat">
            UAE VAT support
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </details>
      <Link href="/about">About us</Link>
      <Link href="/how-we-work">How we work</Link>
      <Link href="/insights">Insights</Link>
      <Link href="/regions">Markets</Link>
    </>
  );
}
export function AccountingHeader() {
  return (
    <header className="accounting-header">
      <div className="accounting-header-inner">
        <Brand />
        <nav className="accounting-desktop-nav" aria-label="Primary navigation">
          <Navigation />
        </nav>
        <div className="accounting-header-actions">
          <Link
            className="button button-amber accounting-header-cta"
            href="/contact"
          >
            Get in touch
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <ThemeToggle />
          <details className="accounting-mobile-nav">
            <summary aria-label="Open navigation">
              <span aria-hidden="true">☰</span>
            </summary>
            <nav aria-label="Mobile navigation">
              <Navigation mobile />
              <Link className="button button-amber" href="/contact">
                Get in touch
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </nav>
          </details>
        </div>
      </div>
      <NavigationBehaviour />
    </header>
  );
}
