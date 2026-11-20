"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ServiceFlashcards } from "./service-flashcards";
import { useHydrated } from "@/lib/use-hydrated";
import { accountingCopy, accountingGroups, serviceContactHref } from "@/content/accounting";
import { findServices } from "@/content/service-search";

export function ServiceCatalogue({ children }: { children?: ReactNode }) {
  const hydrated = useHydrated();
  const field = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const home = Boolean(children);
  const filtering = Boolean(query.trim() || group);
  const results = findServices(query, group);
  const showRows = results.length > 0 && filtering && (home || Boolean(query.trim()));

  function clear() {
    setQuery("");
    setGroup("");
    field.current?.focus();
  }

  return (
    <section className={home ? "accounting-home-search" : "accounting-catalogue accounting-wrap"} aria-label="All accounting services">
      {hydrated && <div className="accounting-search">
        <label>
          <span>Find your service</span>
          <div>
            <MagnifyingGlass aria-hidden="true" />
            <input type="search" ref={field} placeholder={accountingCopy.C06.search_placeholder}
              value={query} onChange={event => setQuery(event.target.value)} />
          </div>
        </label>
        <label>
          <span>Service category</span>
          <select value={group} onChange={event => setGroup(event.target.value)}>
            <option value="">All categories</option>
            {accountingGroups.map(value => <option key={value}>{value}</option>)}
          </select>
        </label>
      </div>}
      <p id={home ? "home-result-count" : undefined} className="accounting-results" role="status">
        {results.length} {results.length === 1 ? "service" : "services"}
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
          {results.map(({ service, title, scope, href, enquiry }) => (
            <li key={service.slug} data-service-card data-service-slug={service.slug}>
              <div>
                <h3><Link href={href}>{title}</Link></h3>
                <p>{scope}</p>
              </div>
              <Link className="text-link" aria-label={`Discuss ${title}`} href={serviceContactHref(enquiry)}>Discuss ↗</Link>
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
