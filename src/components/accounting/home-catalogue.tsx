"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import catalogue from "@/content/home-service-scopes.json";
import { useHydrated } from "@/lib/use-hydrated";

export function HomeCatalogue() {
  const hydrated = useHydrated();
  const field = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("");
  const words = term.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filtering = Boolean(category || words.length);
  const groups = catalogue
    .filter(({ group }) => !category || category === group)
    .map(({ group, items }) => ({
      group,
      items: items.filter(({ name, scope }) => words.every(word => [name, scope, group].join(" ").toLowerCase().includes(word))),
    }))
    .filter(({ items }) => items.length);
  const count = groups.reduce((total, group) => total + group.items.length, 0);

  function clear() {
    setTerm("");
    setCategory("");
    field.current?.focus();
  }

  return (
    <details className="accounting-home-catalogue" id="all-services">
      <summary>All services <span>Explore 22 service scopes</span></summary>
      {hydrated && (
        <div className="accounting-search">
          <label htmlFor="home-service-search"><span>Find your service</span>
            <input id="home-service-search" ref={field} type="search" value={term} placeholder="Try registration, audit or close" onChange={event => setTerm(event.target.value)} />
          </label>
          <label htmlFor="home-service-category"><span>Service category</span>
            <select id="home-service-category" value={category} onChange={event => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {catalogue.map(({ group }) => <option key={group}>{group}</option>)}
            </select>
          </label>
        </div>
      )}
      <p className="accounting-home-result-count" id="home-result-count" role="status">{count} {count === 1 ? "service" : "services"}</p>
      {groups.map(({ group, items }) => (
        <details key={group + filtering} className="accounting-home-catalogue-group" open={filtering || undefined}>
          <summary>{group} <span>{items.length} {items.length === 1 ? "service" : "services"}</span></summary>
          {items.map(({ name, scope, slug }) => (
            <article key={slug}>
              <div>
                <h3><Link href={`/finance/services/${slug}`}>{name}</Link></h3>
                <p>{scope}</p>
                <small>{slug === "corporate-tax-filing" ? "Review & filing from AED 750. Scope and records readiness affect the quote." : "Request a quote"}</small>
              </div>
              <Link className="text-link" href={`/contact?service=${encodeURIComponent(name)}`} aria-label={`Discuss ${name}`}>Discuss ↗</Link>
            </article>
          ))}
        </details>
      ))}
      {!count && <div className="accounting-home-no-results">
        <p>No services match your search. Try a different term or tell us what you need.</p>
        <button className="button button-outline" type="button" onClick={clear}>Clear filters</button>
        <Link className="text-link" href="/contact">Help me choose ↗</Link>
      </div>}
    </details>
  );
}
