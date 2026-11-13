# November website audit fixes

Implemented for the private review only. Production approval is still outstanding.

| Audit finding | Resolution |
| --- | --- |
| A1: enquiry data in a URL without JavaScript | The form remains hidden until its handlers are attached. Its native fallback uses POST, and the email/WhatsApp fallback stays available without JavaScript. |
| A2: menus obscure their destination | Native disclosures are enhanced to close on navigation, Escape, outside clicks and focus leaving the open menus. Escape restores focus to the menu trigger. |
| A3: technical gateway/network errors | Only controlled API recovery messages are shown. HTML, malformed JSON and network failures use the friendly fallback and retain entered values. A stalled request aborts after 20 seconds. Accepted unchanged enquiries are not resent from the same form. |
| A4: Market scope opens Services | The regions index is mapped explicitly. Missing content targets now fail validation instead of silently pointing to Services. All supplied related destinations are checked. |
| A5: dedicated SEO/AEO checks run no tests | A dedicated discovery configuration runs current metadata, sitemap, redirect, related-link, service FAQ/schema, person and preview-indexing checks. The AI discovery document now lists all 22 accounting services and links technology externally. |
| A6: reduced motion still moves controls / ungated hover | Decorative hover/press transforms are neutralized for reduced motion. Mouse-only hover effects require hover capability and a fine pointer. |
| A7: small mobile field text | Contact controls have a minimum 16px text size and respect larger text settings. |
| A8: 1 services | Exactly one result now says 1 service. |
| A9: nonfunctional no-JavaScript filters | Enhancement-only search/category controls stay hidden until attached; all 22 service cards remain server-rendered. |
| Keyboard theme motion | Keyboard activation commits the theme immediately and disables icon transitions for that activation. |
| Press feedback and touch targets | Pointer press receives subtle feedback; keyboard activation stays immediate. The mobile theme target is at least 44 by 44px. |
| Repeated motion literals | Active control/card/portrait/theme timings and easing use shared tokens in globals.css. |
| Long unbroken titles | Service grids use minmax(0, 1fr), zero minimum item width and targeted wrapping. The isolated worst-case fixture stays within a 284px grid at 320px, including 200% root text. |

## Verification

- Content provenance: 2,235 checked strings passed; original artwork: 22 audited slots passed.
- Lint and production build passed.
- Main browser suite: 42 passed, 1 intentional skip. Includes the new regressions alongside desktop/tablet/mobile, both themes, accessibility, reduced motion and JavaScript-disabled content.
- Dedicated commands: test:seo 3 passed; test:aeo 3 passed; test:seo:preview 1 passed. Total: 49 browser/discovery checks passed.
- Contact checks use mocks or honeypots. Preview email dispatch remains disabled; no actual enquiry was sent.
- Original portraits and archive files are unchanged. Existing URL structure, legal pages and blog content are preserved.

The owner decisions recorded in the November review still apply. These code fixes do not approve publication, supply the official Trustpilot widget/contact confirmation, verify real inbox receipt or replace legal/professional review. Physical-device Safari/iOS checks and field performance are not claimed.

The existing website project receives a protected preview upload only. No production promotion, custom-domain assignment, Git push, CMS publication or indexing submission is part of this change. Audit fixtures and reports under plans are excluded from the upload.
