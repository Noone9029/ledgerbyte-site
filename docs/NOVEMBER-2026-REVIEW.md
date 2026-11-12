# November accounting website review

Prepared from Haider's 10 November 2026 Markdown checklist and replacement JSON. **Private review only; launch approval is outstanding.**

The original private handoff files remain outside tracked source. `src/content/accounting.json` contains the mapped website copy, and `src/content/user-provided.json` records its provenance. The immutable archive was not changed.

## Implemented

- C01–C02: Accounting-only brand, navigation, homepage, eight buyer pathways, output-focused service highlights and finance enquiry actions. LedgerByte Tech is a discreet external link.
- C03: Trustpilot section immediately below the hero, using the genuine profile link. No invented review cards, scores, stars or rating schema.
- C04–C05: Existing finance artwork, confirmed roles/credentials across main-site profiles and schema. Existing team roster retained pending the final decision. The blog review has matching presentation overrides without publishing Sanity documents.
- C06: All 22 distinct services, searchable catalogue and five category filters. Eight existing URLs retained; fourteen new pages placed under `/finance/services/` for this review.
- C07: Dedicated `/uae-vat` page with supplied scope, preparation, responsibility and fee language; it is not a 23rd catalogue service.
- C08: Contact form with name/email/location/service required, company/message optional; all 22 services plus UAE VAT support and Not sure yet. Service context is preserved. Email uses Resend and reports acceptance only after a provider ID; WhatsApp is a separate deliberate click and does not copy form fields or open automatically. Failure preserves entered data. Validation, origin/body-size checks, a honeypot and per-instance throttling are implemented. Preview delivery is disabled; automated checks mock provider responses.
- C09–C10: Finance-focused About and How we work, four market pages and three guides. Guides use `/insights/` for this review. Existing blog articles and technology routes were retained.
- C11: Blog desktop/mobile/footer navigation now points to accounting services, accounting systems and How we work. Products/Discovery dead links were removed from those menus; technology articles remain intact. Blog source had pre-existing uncommitted work; the scoped navigation/role changes preserve it.
- C12: Server-rendered copy, supplied page titles/descriptions, one H1, breadcrumbs, visible FAQs and matching schema, related links and updated sitemap. Preview always remains noindex, including if an indexing override is accidentally set.
- C13: Supplied service limits and illustrative-example labels are rendered. Existing production privacy and terms were retained rather than replaced by prototype notices.
- C14: Responsive, keyboard/accessibility, no-JavaScript and reduced-motion checks; no real email enquiry was sent. Existing optional analytics remains subject to property/consent approval and is not evidence of verified measurement.

## Owner decisions before release

1. Final accounting-site roster, particularly Amir and Ahmad.
2. Approved replacement LinkedIn portrait for Haider. It was absent from both main-site image folders inspected and the exact-name Drive search; the existing portrait remains.
3. Official account-generated Trustpilot widget configuration and consent/load checks.
4. Official phone and WhatsApp number.
5. Final paths for the fourteen new services and whether the three guides should remain on this website or move to the existing blog. Existing eight service URLs remain intact.
6. Contracting entity, production legal notices, credentials, professional scope and current tax-source review.
7. An authorized actual email-receipt test and final recipient/sender operational approval. Provider acceptance is not inbox receipt. The per-instance throttle is not a distributed rate-limit service.
8. Analytics property, consent and conversion verification before activation or paid traffic.
9. Haider's explicit launch approval.

These decisions are also visible at `/review-notes` in the preview. That route returns 404 in production.

## Validation

- Marketing-copy provenance: 2,233 checked strings passed.
- Original artwork checks: 22 existing artwork slots passed.
- Lint and the Next.js production build passed.
- November Playwright suite: 22 passed, 1 intentional skip. Includes desktop/mobile full page crawls, tablet interaction/accessibility checks, both themes, native menus, all service options, field validation, form failure/success semantics, unknown-route 404s, preview indexing, reduced motion and all supplied content without JavaScript.
- Email tests use mocks or the honeypot path and do not dispatch messages. Actual receipt remains unverified.

The historical split-site tests are retained in `tests/`; the active Playwright configuration selects the November suite because the previous navigation, eight-service count and WhatsApp-submit assertions conflict with the new instructions.

## Release and source handling

Work is isolated in local branch `review/haider-november-2026` and a separate checkout. The live Vercel project has no Git connection. No production deployment, domain assignment, redirect migration, Sanity publication or indexing submission is part of this review.

The GitHub repository is public. This unpublished review source remains local rather than uploading the privately shared draft content to a public branch. The protected Vercel review uses the existing website project and its Vercel Authentication setting. Haider's project-only Vercel access remains constrained by the account's plan, as recorded in the access handoff.

After explicit approval: resolve the release gates, run final checks with production configuration, stage a production build, verify it, and promote it. Retain `dpl_8ywBA8VZ9eVrnZRj9NEAkMRW3wv5` as the current production rollback baseline and verify the public routes after any approved release or rollback.
