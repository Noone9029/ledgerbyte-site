# Expanding service cards — private review

The finance homepage now uses the eight-card showcase from the live site's
interaction pattern, populated with the current approved accounting copy. The
services catalogue uses the same component in its five existing categories,
retaining all 22 services, summaries, typical outputs, filters and destinations.
The showcase has a direct anchor at `/#services-showcase`.

## Interaction and motion

| Element | Role | Starts | Duration | Motion | Relationship |
| --- | --- | --- | --- | --- | --- |
| Selected card | Lead | Pointer selection on desktop | 260ms | Expand in the row | One continuous layout transition |
| Other cards | Support | Same moment | 260ms | Contract into numbered rails | Together with the lead |
| Title and copy | Support | Selection | Immediate | Carried by the card, no separate entrance | Remain laid out at final text width |
| Keyboard / no-JavaScript selection | Static | Activation | Immediate | Open or close directly | No animation gate |
| Header, hero, portraits and FAQs | Static | — | — | Unchanged | Outside the card interaction |

The row uses the existing palette, typography and ease-out token. CSS container
units keep text wrapping steady while the surrounding card expands. Normal
desktop row heights are stable across selections: 480px for the homepage,
620px for the eight-card catalogue category and 540px for the other categories.
These are minimum heights; content may grow rather than be cut off. There is no
pinning, scroll interception or artificial viewport-height spacer.

Hover opening requires a fine pointer, hover support and width above 1100px.
Clicking a card after hovering keeps it open. Narrow layouts stack the cards and
use explicit click/tap activation, avoiding accidental switching as rows move.
Keyboard focus takes priority over pointer hover. Tab, Enter and Space retain
native behavior; arrow keys and Home/End move among the summaries. Service links
remain separate from their disclosure controls.

Native named `details`/`summary` elements provide disclosure semantics and usable
controls without JavaScript ([HTML standard](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element)).
Only one card per group opens at a time. Reduced motion and disabled scripts use
instant selection. No dependency, server API, raw approved dataset or CMS schema
was changed. Visible text comes from `accounting.json`; the eight showcase slugs
are derived in the typed content module. No archive or portrait was modified.

## Verification

- Production build, strict type checking, lint, 2235 copy-provenance strings and
  22 artwork slots passed.
- Browser checks cover desktop, tablet, mobile, both themes, search and category
  filters, hover/click, keyboard focus protection, reduced motion and native
  script-disabled expansion/navigation. The complete suite passed 59 browser
  checks, with six intentional viewport-specific skips. SEO, AI discovery and
  preview indexing checks add seven passes, for 66 passed checks.
- Nine additional layout cases cover the homepage and catalogue at 1440, 1920,
  2560, 1024, 390 and 320px. Every card was selected in each applicable group;
  all had zero horizontal overflow and unclipped content, and desktop rows kept
  a stable height across selection.
- Local screenshots, layout measurements, upload inspection and a short hover
  recording are in `.qa/flashcards/`. The recording moves between cards 02, 04,
  06, 08 and 01; inspect the rails and text as they settle into one gesture.

## Release boundary

Update the authenticated preview only. Keep the production main and blog
deployments unchanged, keep preview indexing and email sending disabled, and do
not push the review source to the public Git repository. Tests, docs, plans,
private QA artifacts and environment files remain excluded from deployment.
