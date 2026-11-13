"use client";

import Link from "next/link";
import { useId, useRef, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { contentPath, type AccountingService } from "@/content/accounting";
import { hasHoverPointer } from "@/lib/pointer";
import { useHydrated } from "@/lib/use-hydrated";

interface ServiceFlashcardsProps {
  services: AccountingService[];
  label: string;
  catalogue?: boolean;
}

export function ServiceFlashcards({ services, label, catalogue = false }: ServiceFlashcardsProps) {
  const name = useId();
  const enhanced = useHydrated();
  const scope = useRef<HTMLDivElement>(null);
  const keyboard = useRef(false);
  const pointer = useRef("");

  function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
    keyboard.current = true;
    if (!(event.target instanceof HTMLElement) || event.target.tagName !== "SUMMARY") return;
    const summaries = Array.from(scope.current!.querySelectorAll<HTMLElement>("summary"));
    const current = summaries.indexOf(event.target);
    let next: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown": next = (current + 1) % summaries.length; break;
      case "ArrowLeft":
      case "ArrowUp": next = (current - 1 + summaries.length) % summaries.length; break;
      case "Home": next = 0; break;
      case "End": next = summaries.length - 1; break;
      default: return;
    }
    event.preventDefault();
    summaries[next].focus();
  }

  return (
    <div
      ref={scope}
      className="accounting-flashcards"
      role="group"
      aria-label={label}
      data-service-flashcards
      data-catalogue={catalogue}
      data-enhanced={enhanced}
      data-service-count={services.length}
      style={{
        "--flashcard-share": 9 / (services.length + 8),
        "--flashcard-gaps": `${Math.max(0, services.length - 1)}px`,
      } as CSSProperties}
      onKeyDown={moveFocus}
      onPointerDownCapture={(event) => { keyboard.current = false; pointer.current = event.pointerType; }}
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible")) keyboard.current = true;
      }}
    >
      {services.map((service, index) => (
        <details
          className="accounting-flashcard"
          key={service.slug}
          name={`service-cards-${name}`}
          open={index === 0}
          data-service-card={catalogue ? "" : undefined}
          data-service-slug={service.slug}
          onPointerEnter={(event) => {
            if (
              event.pointerType === "mouse" && !keyboard.current &&
              hasHoverPointer(1101)
            ) event.currentTarget.open = true;
          }}
          onToggle={(event) => {
            // Native named details provide this behavior without scripts; keep
            // older browsers exclusive as well when the enhancement is present.
            if (!event.currentTarget.open) return;
            scope.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((other) => {
              if (other !== event.currentTarget) other.open = false;
            });
          }}
        >
          <summary onClick={(event) => {
            // Hover may already have opened this card before a mouse click.
            if (event.detail > 0 && pointer.current === "mouse" && hasHoverPointer(1101)) {
              event.preventDefault();
              (event.currentTarget.parentElement as HTMLDetailsElement).open = true;
            }
          }}>
            <span className="accounting-flashcard-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h3>{service.title}</h3>
            <span className="accounting-flashcard-toggle" aria-hidden="true" />
          </summary>
          <div className="accounting-flashcard-body">
            <p>{service.summary}</p>
            {catalogue && (
              <div className="accounting-card-output">
                <span>Typical output</span>
                <p>{service.output}</p>
              </div>
            )}
            <Link className="text-link" href={contentPath(service.key)} aria-label={`Explore ${service.title}`}>
              Explore service
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </details>
      ))}
    </div>
  );
}
