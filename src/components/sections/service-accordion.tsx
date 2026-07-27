"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { ServiceEntry } from "@/content/types";

interface ServiceAccordionProps {
  services: ServiceEntry[];
  basePath: string;
}

export function ServiceAccordion({
  services,
  basePath,
}: ServiceAccordionProps) {
  const [active, setActive] = useState(0);

  return (
    <div
      className="service-accordion"
      data-service-count={services.length}
    >
      {services.map((service, index) => {
        const panelIndex = String(index + 1).padStart(2, "0");

        return (
          <article
            className="service-panel"
            data-active={active === index}
            data-service-index={panelIndex}
            key={service.slug}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
          >
            <div className="service-panel-copy">
              <span className="service-panel-index" aria-hidden="true">
                {panelIndex}
              </span>
              <h3>{service.title}</h3>
              <div className="service-panel-detail">
                <p>{service.description}</p>
                <Link href={`${basePath}/${service.slug}`}>
                  Learn more
                  <ArrowUpRight weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
