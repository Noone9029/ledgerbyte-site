"use client";
import { useRef, useState, type FormEvent } from "react";
import { accountingServices } from "@/content/accounting";
import { trackEvent } from "@/lib/analytics";

export const enquiryChoices = [
  ...accountingServices.map((service) => service.title),
  "UAE VAT support",
  "Not sure yet",
];
export function AccountingContactForm({
  initialService,
}: {
  initialService: string;
}) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const startedAt = useRef(0);
  const hasStarted = useRef(false);
  function start() {
    if (!startedAt.current) startedAt.current = Date.now();
    if (!hasStarted.current) {
      hasStarted.current = true;
      trackEvent("contact_form_start", { page_path: "/contact" });
    }
    if (status !== "sending") setStatus("idle");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, startedAt: startedAt.current }),
      });
      const result = (await response.json()) as {
        message?: string;
        enquiryId?: string;
      };
      if (!response.ok || !result.enquiryId)
        throw new Error(
          result.message ||
            "We could not send your enquiry. Please try again or contact us by email.",
        );
      setStatus("success");
      setFeedback(
        "Your enquiry has been accepted for email delivery. Please keep this page if you need your entered details.",
      );
      trackEvent("generate_lead", { method: "email", page_path: "/contact" });
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "We could not send your enquiry. Please try again or contact us by email.",
      );
    }
  }
  return (
    <form
      className="accounting-contact-form"
      onSubmit={submit}
      onFocus={start}
      onChange={start}
    >
      <div className="accounting-form-grid">
        <label>
          Name <span aria-hidden="true">*</span>
          <input
            name="fullName"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
          />
        </label>
        <label>
          Email <span aria-hidden="true">*</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Business location <span aria-hidden="true">*</span>
          <input
            name="location"
            autoComplete="country-name"
            required
            minLength={2}
            maxLength={100}
          />
        </label>
        <label>
          Support you need <span aria-hidden="true">*</span>
          <select
            name="service"
            required
            defaultValue={
              enquiryChoices.includes(initialService) ? initialService : ""
            }
          >
            <option value="" disabled>
              Choose a service
            </option>
            {enquiryChoices.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Company <small>(optional)</small>
        <input name="companyName" autoComplete="organization" maxLength={120} />
      </label>
      <label>
        What would you like help with? <small>(optional)</small>
        <textarea
          name="message"
          rows={5}
          maxLength={2000}
          placeholder="Briefly describe your needs and the period or task involved."
        />
      </label>
      <div className="accounting-honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="accounting-privacy-hint">
        Please do not include account credentials, financial documents, payroll
        details or sensitive personal information. Secure document intake will
        be agreed separately.
      </p>
      <button
        className="button button-amber"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
        <span aria-hidden="true">↗</span>
      </button>
      {feedback && (
        <div
          className={`accounting-form-feedback ${status}`}
          role={status === "error" ? "alert" : "status"}
        >
          {feedback}
        </div>
      )}
      <noscript>
        <p>
          To send an enquiry, please email{" "}
          <a href="mailto:info@ledgerbyte.io">info@ledgerbyte.io</a> or use the
          WhatsApp link on this page.
        </p>
      </noscript>
    </form>
  );
}
