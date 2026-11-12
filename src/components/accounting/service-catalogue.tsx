"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react";
import {
  accountingCopy,
  accountingGroups,
  accountingServices,
} from "@/content/accounting";

export function ServiceCatalogue() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All services");
  const services = useMemo(
    () =>
      accountingServices.filter(
        (service) =>
          (group === "All services" || service.group === group) &&
          `${service.title} ${service.summary} ${service.group}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [group, query],
  );
  return (
    <section
      className="accounting-catalogue accounting-wrap"
      aria-label="All accounting services"
    >
      <div className="accounting-search">
        <label>
          <span>Find your service</span>
          <div>
            <MagnifyingGlass aria-hidden="true" />
            <input
              type="search"
              placeholder={accountingCopy.C06.search_placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </label>
        <label>
          <span>Service category</span>
          <select
            value={group}
            onChange={(event) => setGroup(event.target.value)}
          >
            <option>All services</option>
            {accountingGroups.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="accounting-results" role="status">
        {services.length} services
      </p>
      <div className="accounting-service-grid">
        {services.map((service) => (
          <article key={service.slug} data-service-card>
            <p className="eyebrow">{service.group}</p>
            <h2>
              <Link href={`/finance/services/${service.slug}`}>
                {service.title}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </h2>
            <p>{service.summary}</p>
            <div className="accounting-card-output">
              <span>Typical output</span>
              <p>{service.output}</p>
            </div>
            <Link
              className="text-link"
              href={`/finance/services/${service.slug}`}
            >
              Explore service
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
      {services.length === 0 && (
        <div className="accounting-empty">
          <h2>No matching services</h2>
          <p>Try a different search or category.</p>
          <button
            className="button button-amber"
            onClick={() => {
              setQuery("");
              setGroup("All services");
            }}
          >
            Show all services
          </button>
        </div>
      )}
    </section>
  );
}
