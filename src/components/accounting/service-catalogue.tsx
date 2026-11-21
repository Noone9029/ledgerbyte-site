"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ServiceFlashcards } from "./service-flashcards";
import { useHydrated } from "@/lib/use-hydrated";
import { accountingCopy, accountingGroups, accountingServices, accountingShowcaseServices } from "@/content/accounting";
import { serviceWhatsAppHref } from "@/lib/enquiry-options";
import { findServices } from "@/content/service-search";

type CatalogueVisit = {
  path: string;
  query: string;
  group: string;
  result?: { href: string; index: number; top: number };
};

const emptyVisit: CatalogueVisit = { path: "", query: "", group: "" };
const changed = "ledgerbyte:catalogue-change";
function subscribe(notify: () => void) {
  window.addEventListener(changed, notify);
  window.addEventListener("popstate", notify);
  return () => {
    window.removeEventListener(changed, notify);
    window.removeEventListener("popstate", notify);
  };
}

function currentVisit(): CatalogueVisit {
  const visit = window.history.state?.ledgerbyteCatalogue as CatalogueVisit | undefined;
  return visit?.path === window.location.pathname ? visit : emptyVisit;
}

function saveVisit(visit: CatalogueVisit) {
  // Keep typed terms private and preserve Next's state for this history entry.
  window.history.replaceState({ ...window.history.state, ledgerbyteCatalogue: visit }, "");
}

export function ServiceCatalogue({ children }: { children?: ReactNode }) {
  const hydrated = useHydrated();
  const catalogue = useRef<HTMLElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const { query, group } = useSyncExternalStore(subscribe, currentVisit, () => emptyVisit);
  const home = Boolean(children);
  const filtering = Boolean(query.trim() || group);
  const results = findServices(query, group);
  const showRows = results.length > 0 && filtering && (home || Boolean(query.trim()));

  function filter(query: string, group: string) {
    saveVisit({ path: window.location.pathname, query, group });
    window.dispatchEvent(new Event(changed));
  }

  useEffect(() => {
    function rememberDeparture(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || !catalogue.current || link.target === "_blank" || link.origin !== location.origin ||
        event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const visit = currentVisit();
      const next: CatalogueVisit = { path: location.pathname, query: visit.query, group: visit.group };
      if (catalogue.current.contains(link)) {
        const matches = Array.from(catalogue.current.querySelectorAll<HTMLAnchorElement>("a[href]"))
          .filter(item => item.href === link.href);
        next.result = { href: link.href, index: matches.indexOf(link), top: link.getBoundingClientRect().top };
      } else if (!visit.result) return;
      saveVisit(next);
    }
    document.addEventListener("click", rememberDeparture, true);
    return () => document.removeEventListener("click", rememberDeparture, true);
  }, []);

  useLayoutEffect(() => {
    if (!hydrated) return;
    let frame = 0;
    function restoreResult() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = currentVisit().result;
        if (!target || !catalogue.current) return;
        const link = Array.from(catalogue.current.querySelectorAll<HTMLAnchorElement>("a[href]"))
          .filter(item => item.href === target.href)[target.index];
        if (!link) return;
        for (let detail = link.closest("details"); detail; detail = detail.parentElement?.closest("details") ?? null) {
          detail.open = true;
        }
        link.focus({ preventScroll: true });
        window.scrollBy({ top: link.getBoundingClientRect().top - target.top, behavior: "instant" });
      });
    }
    restoreResult();
    window.addEventListener("popstate", restoreResult);
    window.addEventListener("pageshow", restoreResult);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("popstate", restoreResult);
      window.removeEventListener("pageshow", restoreResult);
    };
  }, [hydrated]);

  function clear() {
    filter("", "");
    field.current?.focus();
  }

  return (
    <section id={home ? "catalogue-search" : undefined} ref={catalogue}
      className={home ? "accounting-home-search" : "accounting-catalogue accounting-wrap"} aria-label="All accounting services">
      {hydrated && <div className="accounting-search">
        <label>
          <span>{home ? `Search all ${accountingServices.length} services` : "Find your service"}</span>
          <div>
            <MagnifyingGlass aria-hidden="true" />
            <input type="search" ref={field} placeholder={accountingCopy.C06.search_placeholder}
              value={query} onChange={event => filter(event.target.value, group)} />
          </div>
        </label>
        <label>
          <span>Service category</span>
          <select value={group} onChange={event => filter(query, event.target.value)}>
            <option value="">All categories</option>
            {accountingGroups.map(value => <option key={value}>{value}</option>)}
          </select>
        </label>
      </div>}
      <p id={home ? "home-result-count" : undefined} className="accounting-results" role="status">
        {home && !filtering ? `${accountingShowcaseServices.length} featured services` : `${results.length} ${results.length === 1 ? "service" : "services"}`}
      </p>
      {!results.length && (
        <div className="accounting-empty">
          <h2>No matching services</h2>
          <p>Try a different search or category.</p>
          <button className="button button-outline" onClick={clear}>{home ? "Clear filters" : "Show all services"}</button>
          <Link className="text-link" href="/contact#enquiry-heading">Help me choose ↗</Link>
        </div>
      )}
      {home && !filtering && children}
      {showRows && (
        <ul className="accounting-service-results">
          {results.map(({ service, title, scope, href, enquiry, market }) => (
            <li key={href} data-service-card data-service-slug={service.slug}>
              <div>
                <h3><Link href={href}>{title}</Link></h3>
                <p>{scope}</p>
              </div>
              <a className="text-link" aria-label={`Discuss ${title}`} href={serviceWhatsAppHref(enquiry, market)} target="_blank" rel="noreferrer">Discuss ↗</a>
            </li>
          ))}
        </ul>
      )}
      {!home && results.length > 0 && !showRows && (
        <div className="accounting-flashcard-groups">
          {accountingGroups.map(category => {
            const services = results.filter(row => row.service.group === category).map(row => row.service);
            return services.length ? (
              <section key={category}>
                <h2>{category}</h2>
                <ServiceFlashcards services={services} label={category} catalogue />
              </section>
            ) : null;
          })}
        </div>
      )}
    </section>
  );
}
