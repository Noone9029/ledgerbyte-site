"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ServiceFlashcards } from "./service-flashcards";
import { useHydrated } from "@/lib/use-hydrated";
import {
  accountingCopy,
  accountingGroups,
  accountingServices,
} from "@/content/accounting";

export function ServiceCatalogue() {
  const enhanced = useHydrated();
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
      <div className="accounting-search" hidden={!enhanced}>
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
        {services.length} {services.length === 1 ? "service" : "services"}
      </p>
      <div className="accounting-flashcard-groups">
        {accountingGroups.map((category) => {
          const categoryServices = services.filter((service) => service.group === category);
          if (!categoryServices.length) return null;
          return (
            <section key={`${category}:${categoryServices.map((service) => service.slug).join(":")}`}>
              <h2>{category}</h2>
              <ServiceFlashcards services={categoryServices} label={category} catalogue />
            </section>
          );
        })}
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
