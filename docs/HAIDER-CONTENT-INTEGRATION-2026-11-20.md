# Add Haider's content in the existing LedgerByte design

The owner requested the content and functionality from Haider's November 20
source ZIP while keeping the current website's images, theme, fonts, structure,
page flow and sliding service cards. This implementation starts from live-source
commit `2af7a11c12e3740e2c22b0f10dcc78785234c942` on an isolated local branch.

| Before | After | Why |
| --- | --- | --- |
| Current hero, editorial image and headline | Same hero, image and headline; finance-team message in the lead and a builder action | Introduce the new message without replacing the existing identity |
| Eight problem-led pathways | Same eight pathways, with three UAE starting offers in the same section | Include the AED 500/750 offers while retaining the original service flow |
| Finance statement | Same statement treatment, with department-builder links and an expandable working process | Fit the supplied outsourcing and responsibility content into an existing block |
| Eight expanding service cards | Same component, content, CSS and hover/touch/keyboard behavior | Preserve the interaction the owner explicitly requested |
| Detailed service browsing on the services route | Existing route retained; homepage adds expandable scope search and four workstream summaries below the cards | Include the supplied discovery features without replacing the cards |
| Existing six-person portrait grid | Same images, framing and order, with the supplied founder statement underneath | Add the founder's message without swapping portraits |
| Three practical guide links | Same link layout with expanded guide content and a blog link | Keep the homepage reading flow and provide the supplied examples |
| Current FAQs and closing action | Pricing/scope FAQs and a finance-team enquiry, using the existing components | Explain the offers in the site's existing presentation |

## Routes and behavior

- `/`: finance-team message; monthly SME support from AED 500, VAT return
  support from AED 750 per return, corporate tax review/filing from AED 750;
  original pathways and sliding cards; searchable 22-service scope list;
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
cases and 6 intentional viewport skips after correcting a new test fixture to
the actual original hero headline. All existing card, navigation, contact,
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
