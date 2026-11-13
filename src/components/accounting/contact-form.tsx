"use client";
import { useRef, useState, type FormEvent } from "react";
import { accountingServices } from "@/content/accounting";
import { trackEvent } from "@/lib/analytics";
import { useHydrated } from "@/lib/use-hydrated";

const deliveryFailure =
  "We could not send your enquiry. Please try again or contact us by email.";
const acceptedFeedback =
  "Your enquiry has been accepted for email delivery. Please keep this page if you need your entered details.";
const safeFailures = new Set([
  deliveryFailure,
  "Please check the required fields and try again.",
  "Please wait before trying again, or contact us by email.",
  "Email delivery is unavailable. Please email info@ledgerbyte.io or choose WhatsApp.",
]);

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
  const enhanced = useHydrated();
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const startedAt = useRef(0);
  const hasStarted = useRef(false);
  const inFlight = useRef(false);
  const acceptedPayload = useRef<string | null>(null);
  function start() {
    if (!startedAt.current) startedAt.current = Date.now();
    if (!hasStarted.current) {
      hasStarted.current = true;
      trackEvent("contact_form_start", { page_path: "/contact" });
    }
  }
  function edit() {
    start();
    if (!inFlight.current) {
      setStatus("idle");
      setFeedback("");
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enhanced || inFlight.current) return;
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const payloadKey = JSON.stringify(payload);
    if (acceptedPayload.current === payloadKey) {
      setStatus("success");
      setFeedback(acceptedFeedback);
      return;
    }
    inFlight.current = true;
    setStatus("sending");
    setFeedback("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, startedAt: startedAt.current }),
        signal: controller.signal,
      });
      if (!response.headers.get("content-type")?.includes("application/json"))
        throw new Error();
      const result = (await response.json()) as {
        message?: string;
        enquiryId?: string;
      };
      if (
        !response.ok ||
        typeof result.enquiryId !== "string" ||
        !result.enquiryId
      ) {
        setStatus("error");
        setFeedback(
          result.message && safeFailures.has(result.message)
            ? result.message
            : deliveryFailure,
        );
        return;
      }
      acceptedPayload.current = payloadKey;
      setStatus("success");
      setFeedback(acceptedFeedback);
      trackEvent("generate_lead", { method: "email", page_path: "/contact" });
    } catch {
      setStatus("error");
      setFeedback(deliveryFailure);
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
    }
  }
  return (
    <>
      <form
        className="accounting-contact-form"
        hidden={!enhanced}
        method="post"
        action="/api/contact"
        aria-busy={status === "sending"}
        onSubmit={submit}
        onFocus={start}
        onChange={edit}
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
          <input
            name="companyName"
            autoComplete="organization"
            maxLength={120}
          />
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
          Please do not include account credentials, financial documents,
          payroll details or sensitive personal information. Secure document
          intake will be agreed separately.
        </p>
        <button
          className="button button-amber"
          type="submit"
          disabled={status === "sending" || status === "success"}
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
      </form>
      <noscript>
        <p>
          To send an enquiry, please email{" "}
          <a href="mailto:info@ledgerbyte.io">info@ledgerbyte.io</a> or use the
          WhatsApp link on this page.
        </p>
      </noscript>
    </>
  );
}
