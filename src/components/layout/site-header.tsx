"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { financeServices, technologyServices } from "@/content";
import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const closeNavigation = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <div onClick={closeNavigation}>
          <Brand />
        </div>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <button
            className="nav-link nav-services-trigger"
            type="button"
            aria-expanded={servicesOpen}
            aria-controls="services-menu"
            onClick={() => setServicesOpen((open) => !open)}
          >
            Services
            <span aria-hidden="true">+</span>
          </button>
          <Link className="nav-link" href="/finance" onClick={closeNavigation}>
            Finance
          </Link>
          <Link
            className="nav-link"
            href="/technology"
            onClick={closeNavigation}
          >
            Technology
          </Link>
          <Link className="nav-link" href="/about" onClick={closeNavigation}>
            About
          </Link>
          <a className="nav-link" href="https://blog.ledgerbyte.io">
            Insights
          </a>
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          <Link
            className="button button-small nav-cta"
            href="/contact"
            onClick={closeNavigation}
          >
            Let&apos;s Connect
            <ArrowUpRight weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <List aria-hidden="true" />}
        </button>
      </div>

      <div
        className="mega-menu"
        id="services-menu"
        data-open={servicesOpen}
        aria-hidden={!servicesOpen}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) closeNavigation();
        }}
      >
        <div className="mega-inner">
          <div className="mega-intro">
            <p className="eyebrow">Our Services</p>
            <h2>Finance + Technology</h2>
            <p>
              Finance, reporting, and advisory services designed for growing
              businesses
            </p>
          </div>
          <div className="mega-column">
            <Link className="mega-heading" href="/finance/services">
              Finance Services
              <ArrowUpRight aria-hidden="true" />
            </Link>
            {financeServices.map((service) => (
              <Link
                className="mega-service"
                href={`/finance/services/${service.slug}`}
                key={service.slug}
              >
                {service.title}
              </Link>
            ))}
          </div>
          <div className="mega-column">
            <Link className="mega-heading" href="/technology/services">
              Technology Services
              <ArrowUpRight aria-hidden="true" />
            </Link>
            {technologyServices.map((service) => (
              <Link
                className="mega-service"
                href={`/technology/services/${service.slug}`}
                key={service.slug}
              >
                {service.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mobile-navigation"
        id="mobile-navigation"
        data-open={menuOpen}
        aria-hidden={!menuOpen}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) closeNavigation();
        }}
      >
        <nav aria-label="Mobile navigation">
          <Link href="/finance">Finance</Link>
          <Link href="/finance/services">Finance Services</Link>
          <Link href="/technology">Technology</Link>
          <Link href="/technology/services">Technology Services</Link>
          <Link href="/technology/process">Process</Link>
          <Link href="/technology/why-ledgerbyte">Why LedgerByte Tech</Link>
          <Link href="/about">About</Link>
          <a href="https://blog.ledgerbyte.io">Insights</a>
          <Link href="/contact">Let&apos;s Connect</Link>
        </nav>
        <div className="mobile-nav-contact">
          <a href="mailto:info@ledgerbyte.io">info@ledgerbyte.io</a>
          <a href="tel:+971561371569">+971 56 137 1569</a>
        </div>
      </div>
    </header>
  );
}
