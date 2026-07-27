"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import {
  contactDetails,
  financeServices,
  technologyServices,
} from "@/content";
import type { ContactRequest } from "@/content/types";
import { trackEvent } from "@/lib/analytics";

const initialForm: ContactRequest = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  service: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactRequest>(initialForm);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [whatsappHref, setWhatsappHref] = useState("");
  const startedAt = useRef(0);
  const formStarted = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const updateField = (field: keyof ContactRequest, value: string) => {
    if (!formStarted.current && value.trim()) {
      formStarted.current = true;
      trackEvent("contact_form_start", {
        page_path: window.location.pathname,
      });
    }

    setForm((current) => ({ ...current, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
      setWhatsappHref("");
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    setWhatsappHref("");

    const whatsappWindow = window.open(
      "about:blank",
      "ledgerbyte-whatsapp",
    );
    if (whatsappWindow) {
      whatsappWindow.opener = null;
      whatsappWindow.document.title = "LedgerByte WhatsApp";
    }

    const payload = {
      ...form,
      website: new FormData(event.currentTarget).get("website") ?? "",
      startedAt: startedAt.current,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        message?: string;
        whatsappHref?: string;
      };

      if (!response.ok) {
        whatsappWindow?.close();
        setStatus("error");
        setMessage(
          result.message ??
            "There was an issue sending your message. Please try again.",
        );
        return;
      }

      const target = result.whatsappHref
        ? new URL(result.whatsappHref)
        : null;
      const expected = new URL(contactDetails.whatsappHref);
      const isValidTarget =
        target?.protocol === "https:" &&
        target.hostname === expected.hostname &&
        target.pathname === expected.pathname &&
        Boolean(target.searchParams.get("text"));

      if (!target || !isValidTarget) {
        whatsappWindow?.close();
        setStatus("error");
        setMessage(
          "There was an issue sending your message. Please try again.",
        );
        return;
      }

      const targetHref = target.toString();
      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.location.replace(targetHref);
      }

      setStatus("success");
      setMessage(result.message ?? "WhatsApp is ready.");
      setWhatsappHref(targetHref);
      trackEvent("generate_lead", {
        method: "whatsapp",
        service: form.service,
      });
    } catch {
      whatsappWindow?.close();
      setStatus("error");
      setMessage(
        "There was an issue sending your message. Please try again.",
      );
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Full Name *
          <input
            autoComplete="name"
            maxLength={100}
            minLength={2}
            name="fullName"
            onChange={(event) => updateField("fullName", event.target.value)}
            required
            value={form.fullName}
          />
        </label>
        <label>
          Email Address *
          <input
            autoComplete="email"
            maxLength={254}
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            required
            type="email"
            value={form.email}
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Phone Number
          <input
            autoComplete="tel"
            maxLength={32}
            name="phone"
            onChange={(event) => updateField("phone", event.target.value)}
            type="tel"
            value={form.phone}
          />
        </label>
        <label>
          Company Name
          <input
            autoComplete="organization"
            maxLength={120}
            name="companyName"
            onChange={(event) => updateField("companyName", event.target.value)}
            value={form.companyName}
          />
        </label>
      </div>
      <label>
        Service of Interest *
        <select
          name="service"
          onChange={(event) => updateField("service", event.target.value)}
          required
          value={form.service}
        >
          <option value="">Select a service</option>
          <optgroup label="Finance">
            {financeServices.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="Technology">
            {technologyServices.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </optgroup>
          <option value="Other">Other</option>
        </select>
      </label>
      <label>
        Message *
        <textarea
          maxLength={1000}
          minLength={10}
          name="message"
          onChange={(event) => updateField("message", event.target.value)}
          required
          rows={7}
          value={form.message}
        />
        <span className="character-count">{form.message.length} / 1000</span>
      </label>

      <label className="honeypot" aria-hidden="true">
        Website
        <input
          autoComplete="off"
          name="website"
          tabIndex={-1}
          type="text"
        />
      </label>

      <p className="form-consent">
        By submitting this form, you agree to our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
        <Link href="/terms-of-use">Terms of Use</Link>.
      </p>

      <button
        className="button button-amber"
        disabled={status === "sending"}
        type="submit"
      >
        {status === "sending" ? "Preparing WhatsApp" : "Continue to WhatsApp"}
        <ArrowUpRight weight="bold" aria-hidden="true" />
      </button>

      <div className="form-status" data-status={status} aria-live="polite">
        {status === "success" ? (
          <>
            <CheckCircle weight="fill" aria-hidden="true" />
            <div>
              <p>{message}</p>
              <span>
                <a href={whatsappHref} rel="noreferrer" target="_blank">
                  Open WhatsApp
                </a>
              </span>
            </div>
          </>
        ) : null}
        {status === "error" ? (
          <>
            <WarningCircle weight="fill" aria-hidden="true" />
            <div>
              <p>{message}</p>
              <span>
                Need instant help? Ping us on{" "}
                <a
                  href="https://wa.me/971561371569"
                  rel="noreferrer"
                  target="_blank"
                >
                  WhatsApp
                </a>
                , or use{" "}
                <a href="mailto:info@ledgerbyte.io">info@ledgerbyte.io</a> /{" "}
                <a href="tel:+971561371569">+971 56 137 1569</a>.
              </span>
            </div>
          </>
        ) : null}
      </div>
    </form>
  );
}
