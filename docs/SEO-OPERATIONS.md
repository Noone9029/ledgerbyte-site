# LedgerByte SEO Operations

## Google Submission Checklist

The canonical site is `https://ledgerbyte.io`; `www`, legacy paths, and the
public Vercel alias must resolve to it in one permanent redirect. Complete these
steps in the existing Search Console domain property after each production
release that materially changes routes or page content:

1. Open **Sitemaps** and submit or resubmit
   `https://ledgerbyte.io/sitemap.xml`. Do not remove the prior submission.
2. Wait for the sitemap status to become **Success** and record the discovered
   URL count. The expected count for this release is 31.
3. Use **URL Inspection → Test Live URL → Request Indexing** for:
   - `https://ledgerbyte.io/`
   - `https://ledgerbyte.io/finance`
   - `https://ledgerbyte.io/finance/services`
   - `https://ledgerbyte.io/finance/services/accounting-bookkeeping`
   - `https://ledgerbyte.io/finance/services/tax-vat-compliance`
   - `https://ledgerbyte.io/finance/services/payroll-wps-management`
   - `https://ledgerbyte.io/finance/services/fractional-cfo-advisory`
   - `https://ledgerbyte.io/technology`
   - `https://ledgerbyte.io/technology/services`
   - `https://ledgerbyte.io/contact`
4. Do not request indexing for old URLs, repeatedly resubmit the same URL, use
   Removals, or use Change of Address. Let permanent redirects consolidate the
   old paths.

Record the submission date, sitemap status, inspected URL, live-test result,
Google-selected canonical, and request result. A request is not a guarantee of
indexing.

## Migration Matrix

| Legacy source | Permanent destination |
|---|---|
| `/services` | `/finance/services` |
| `/services/` | `/finance/services` |
| `/services/:slug` | `/finance/services/:slug` |
| `/services/:slug/` | `/finance/services/:slug` |
| `/about-us` | `/about` |
| `/about-us/` | `/about` |
| `/lets-connect` | `/contact` |
| `/lets-connect/` | `/contact` |
| `/process` | `/technology/process` |
| `/process/` | `/technology/process` |
| `/why-ledgerbyte-tech` | `/technology/why-ledgerbyte` |
| `/why-ledgerbyte-tech/` | `/technology/why-ledgerbyte` |
| `tech.ledgerbyte.io/` | `/technology` |
| `tech.ledgerbyte.io/services` | `/technology/services` |
| `tech.ledgerbyte.io/about` | `/about` |
| `tech.ledgerbyte.io/contact` | `/contact` |

Keep redirects for at least 12 months. Preserve query strings and never send a
retired content URL to the homepage unless the homepage is genuinely the
closest replacement.

## Baseline and Measurement

The first fixed baseline window is **2026-07-28 through 2026-08-24**. Export it
on or after 2026-08-25 into `docs/SEO-BASELINE.csv`. Record page, query, country,
device, clicks, impressions, CTR, average position, and qualified organic leads.
Classify brand queries separately from non-brand queries.

Configure `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel Production before treating
lead measurement as active. Verify `generate_lead`, form completion, WhatsApp,
phone, email, form-start, and service CTA events without transmitting names,
email addresses, phone numbers, messages, or other personal data.
Track AI-originated sessions through `ai_referral_session`; it records only the
AI source, referring hostname, and landing path.

## AI Search and IndexNow

Run `npm run test:aeo` before release. After the production deployment exposes
the current IndexNow key file, run `npm run seo:indexnow` to notify
participating engines of every canonical sitemap URL. IndexNow does not submit
URLs to Google, so continue using the sitemap and selected URL Inspection
requests in Search Console.

Keep `/llms.txt` aligned with canonical service routes. Treat it as an optional
discovery aid rather than a ranking guarantee. The wildcard `robots.txt` rule
must continue allowing OAI-SearchBot and other search crawlers to access public
pages.

Set numerical growth targets only after the complete 28-day baseline. The
primary KPI is qualified organic enquiries; non-brand clicks and priority-query
visibility are supporting indicators.

## First 90 Days

- Review Search Console weekly for non-brand queries, indexing, soft 404s,
  unexpected canonical selections, and pages ranking in positions 5–20.
- Select two existing Insights articles each month from verified Search Console
  opportunity data. Each refresh requires a named author, qualified reviewer,
  current official sources, an accurate updated date, and contextual links to
  the relevant service page.
- Publish only verified client outcomes. Prepare one approved case study and one
  practical finance asset per quarter; do not fabricate client names, metrics,
  credentials, or regulatory claims.
- Pursue legitimate links through professional associations, software
  partnerships, chambers, founder communities, client features, and reputable
  UAE business listings. Reject paid-link packages and bulk directories.
- Keep UAE finance as the first search market for six months. Do not create KSA,
  UK, US, Arabic, or city pages until there is distinct local expertise,
  evidence, and native review.
- Keep the blog on `blog.ledgerbyte.io` during stabilization. Consider
  `/insights` only after 6–8 stable weeks and with exact article-level redirects.

## Entity and Local Checks

Use the Sharjah address and `+971 56 137 1569` consistently on the website,
LinkedIn, Trustpilot, and eligible directories. Confirm whether the Shams
Business Center location has permanent LedgerByte signage, LedgerByte staff,
and customer access during stated hours before creating a Google Business
Profile. Do not list an unstaffed virtual office.

## Monitoring and Rollback

Monitor daily through 2026-08-03, twice weekly through 2026-08-24, then monthly.
Every sitemap URL must return 200, be indexable, declare itself canonical, and
have an internal link. Legacy URLs must appear in Search Console as **Page with
redirect**, not indexed duplicates. If a release produces widespread 5xx
responses, redirect loops, or missing canonical pages, roll back the deployment
while retaining logs and the failed build for diagnosis.
