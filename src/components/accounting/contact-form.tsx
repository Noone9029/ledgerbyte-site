"use client";
import { useRef, useState, type FormEvent } from "react";
import arabicDrafts from "@/content/seo-drafts/contact-ar-ui.json";
import { enquiryMarket, financeEnquiryChoices, serviceWhatsAppHref } from "@/lib/enquiry-options";
import { useEnquiryService } from "./enquiry-channels";
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

export function AccountingContactForm({
  initialService, initialMarket = "", locale = "en",
}: {
  initialService: string; initialMarket?: string; locale?: "en" | "ar";
}) {
  const selection = useEnquiryService();
  const enhanced = useHydrated();
  const [fallbackService, setFallbackService] = useState(initialService);
  const ar = locale === "ar";
  const say = (en: string) => ar ? (arabicDrafts.labels[en as keyof typeof arabicDrafts.labels] || en) : en;
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
    setFallbackService(String(payload.service || ""));
    const payloadKey = JSON.stringify(payload);
    if (acceptedPayload.current === payloadKey) {
      setStatus("success");
      setFeedback(say(acceptedFeedback));
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
            ? say(result.message)
            : say(deliveryFailure),
        );
        return;
      }
      acceptedPayload.current = payloadKey;
      setStatus("success");
      setFeedback(say(acceptedFeedback));
      trackEvent("generate_lead", { method: "email", page_path: "/contact" });
    } catch {
      setStatus("error");
      setFeedback(say(deliveryFailure));
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
        <fieldset disabled={status === "sending"}>
          <div className="accounting-form-grid">
            <label>
              {say("Name")} <span aria-hidden="true">*</span>
              <input
                name="fullName"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
              />
            </label>
            <label>
              {say("Email")} <span aria-hidden="true">*</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
            <label>
              {say("Business location")} <span aria-hidden="true">*</span>
              <input
                name="location"
                defaultValue={initialMarket}
                onChange={(event) => selection?.setMarket(enquiryMarket(event.target.value))}
                aria-describedby={initialMarket ? "enquiry-market-hint" : undefined}
                autoComplete="country-name"
                required
                minLength={2}
                maxLength={100}
              />
              {initialMarket && <small id="enquiry-market-hint">Suggested market. Edit here.</small>}
            </label>
            <label>
              {say("Support you need")} <span aria-hidden="true">*</span>
              <select
                name="service"
                onChange={(event) => selection?.setService(event.target.value)}
                required
                defaultValue={
                  financeEnquiryChoices.includes(initialService) ? initialService : ""
                }
              >
                <option value="" disabled>
                  {say("Choose a service")}
                </option>
                {financeEnquiryChoices.map((service) => (
                  <option key={service} value={service}>{ar ? (arabicDrafts.services[service as keyof typeof arabicDrafts.services] || service) : service}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            {say("Company")} <small>{say("(optional)")}</small>
            <input
              name="companyName"
              autoComplete="organization"
              maxLength={120}
            />
          </label>
          <label>
            {say("What would you like help with?")} <small>{say("(optional)")}</small>
            <textarea
              name="message"
              rows={5}
              maxLength={2000}
              placeholder={say("Briefly describe your needs and the period or task involved.")}
            />
          </label>
          <div className="accounting-honeypot" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
        </fieldset>
        <p className="accounting-privacy-hint">
          {say("Please do not include account credentials, financial documents, payroll details or sensitive personal information. Secure document intake will be agreed separately.")}
        </p>
        <button
          className="button button-amber"
          type="submit"
          disabled={status === "sending" || status === "success"}
        >
          {say(status === "sending" ? "Sending…" : "Send enquiry")}
          <span aria-hidden="true">↗</span>
        </button>
        {feedback && (
          <div
            className={`accounting-form-feedback ${status}`}
            role={status === "error" ? "alert" : "status"}
          >
            <p>{feedback}</p>
            {status === "error" && <div className="hero-actions">
              <a className="text-link" href={`mailto:info@ledgerbyte.io?subject=${encodeURIComponent("LedgerByte enquiry: " + fallbackService)}`}>info@ledgerbyte.io</a>
              <a className="text-link" href={serviceWhatsAppHref(fallbackService, selection?.market)} target="_blank" rel="noreferrer">WhatsApp ↗</a>
            </div>}
          </div>
        )}
      </form>
      <noscript>
        <p>
          {say("To send an enquiry, please email")} <a href="mailto:info@ledgerbyte.io">info@ledgerbyte.io</a> {say("or use the WhatsApp link on this page.")}
        </p>
      </noscript>
    </>
  );
}
