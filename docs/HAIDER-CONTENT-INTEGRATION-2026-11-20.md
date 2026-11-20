# Add Haider's content in the existing LedgerByte design

The owner requested the content and functionality from Haider's November 20
source ZIP while keeping the current website's images, theme, fonts, structure,
sliding service cards. The owner subsequently clarified that the homepage
sequence and content progression must match Haider’s supplied version. This
implementation starts from live-source
commit `2af7a11c12e3740e2c22b0f10dcc78785234c942` on an isolated local branch.

| Before | After | Why |
| --- | --- | --- |
| Original homepage order and headline | Supplied headline and section order, using the current hero image and typography | Follow the owner's corrected flow requirement |
| Reviews immediately after the hero | Three UAE offers immediately after the hero, followed by reviews | Match the supplied introduction and pricing progression |
| Eight problem-led pathway tiles | Four visible finance workstreams, followed by combined outsourcing | Match Haider's service narrative |
| Original expanding service cards | Same eight sliding cards within the service catalogue section | Retain the requested interaction in the supplied flow |
| Expandable working-process summary | Five visible steps in a dedicated section after the catalogue | Keep the explanation visible and in the supplied position |
| Founder statement below portraits | Founder statement before the existing portrait grid | Match the supplied founder-to-team progression |
| Existing guides, FAQs and closing enquiry | Guides, pricing FAQs, then the supplied contact details and enquiry handoff | Complete the supplied reading sequence |

## Homepage sequence

Hero → UAE offers → client reviews → four finance workstreams and combined
outsourcing → service catalogue → working process → founder and team → guides
→ FAQs → contact. The original eight problem-led pathway tiles are no longer
rendered on the homepage. The eight sliding service cards remain unchanged in
the catalogue section. Finance workstreams and the five working-process steps
are visible without opening disclosure controls. The service catalogue's
optional search disclosure retains its existing no-JavaScript fallback.

## Routes and behavior

- `/`: finance-team message; monthly SME support from AED 500, VAT return
  support from AED 750 per return, corporate tax review/filing from AED 750;
  four visible finance workstreams and original sliding cards; searchable 22-service scope list;
  working process, founder note, guides and pricing FAQs.
- `/build-your-finance-department`: industry/workload/service/role calculator
  rebuilt with existing artwork, fonts, colors, form treatment and navigation.
  The supplied minimum is 15 hours and AED 500 before tax. One additional senior
  hour changes the displayed and drafted enquiry amount to AED 550. Email,
  WhatsApp and phone callback remain drafts that visitors review and send.
- `/regions/uae`: supplied UAE/Sharjah bookkeeping content and builder handoff.
- `/insights/month-end-close`, `/insights/profit-and-cash` and
  `/insights/vat-records`: supplied worked examples, reading order and schema.
- Navigation, sitemap, related-path mapping and AI discovery include the builder.
  The sitemap retains the existing technology routes and adds the existing team
  profile routes alongside the builder, for 57 URLs in total.

## Preservation and provenance

All 58 pre-existing public files other than the intentional `llms.txt` text
update retain their Git content hashes. No new image, portrait, font or logo
was imported from Haider's ZIP. The existing global CSS rules remain intact;
new scoped rules reuse existing tokens. ServiceFlashcards, ScrollReveals,
ThemeToggle, team image paths, original dependency versions and IndexNow
configuration remain unchanged. The existing test suite and repository
documentation are retained.

New marketing copy comes from, or is faithfully adapted from, the supplied ZIP
at the owner's request. Its provenance is recorded in `user-provided.json`.
This is authorization to implement the local change, not to publish it or
independently certify the supplied pricing, salary benchmarks or tax statements.

## Verification

Content provenance, original artwork checks, analytics privacy checks, ESLint
and the Next.js production build pass. The main browser suite has 73 passing
cases and 6 intentional viewport skips. The homepage regression verifies the
complete supplied section order, headline, four workstreams and five visible
process steps. All existing card, navigation, contact,
reduced-motion and JavaScript-disabled regressions pass; new tests cover the
offers, catalogue, calculator arithmetic, minimum hours and enquiry drafts.

The SEO suite now includes technology service routes as well as team profiles,
and the builder is registered in the shared content-path data. This updates the
coverage contract to the complete 57-route sitemap rather than relaxing checks.
SEO, AI discovery and preview-indexing checks are included in final validation.

Additional visual checks cover homepage, builder and UAE page at 1440, 1024,
390 and 320 pixels. There are no horizontal overflows, broken loaded images or
automated WCAG A/AA violations in the checked layouts. Homepage and builder
also pass light-theme checks. Desktop/mobile before-and-after screenshots,
accessibility detail and the internal-link audit are retained locally in `.qa/`.
The link audit checked 6,089 internal references with no broken links or missing
fragments.

No real enquiry, email, WhatsApp message or analytics measurement was sent.
Arabic publishing remains gated. No production deployment or main-branch
update is part of this local implementation.

## Persistent WhatsApp contact

The owner's follow-up adds a fixed bottom-right WhatsApp link in both shared
language layouts and the global fallback page. It uses the existing official
WhatsApp destination and a server-rendered icon/link, so it works without
JavaScript. The link opens a new tab and never sends a message automatically.
The existing consent-gated click tracking recognizes this contact link.

Cookie choices sit above the link. On narrow builder layouts the link clears
the fixed estimate bar; the cookie panel clears both. The link remains visible
instead of disappearing when either control is present. New green contact
colors are kept in the shared CSS tokens.

Validation found one server-rendered link on all 57 sitemap pages and the
global fallback, plus 12 desktop/mobile/small-screen/no-JavaScript checks with
no viewport clipping or cookie/estimate overlap. Automated checks found no
accessibility violations in the contact link. Local screenshots and detailed
results are in `.qa/whatsapp-check.json` and `.qa/whatsapp-*.png`.

The builder's reduced-motion regression now checks the existing 0.01 ms,
single-iteration fallback explicitly; requiring zero browser animation objects
was sensitive to instantaneous focus/color transitions.
