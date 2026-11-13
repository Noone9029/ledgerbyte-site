# Desktop scroll review — 12 November 2026

The private accounting homepage now follows the approved records → reporting →
forward-view story. Existing copy, links, illustration and portrait files are
preserved. The SVG diagram and framing geometry are original artwork; its labels
come from the supplied homepage paragraph. It is decorative because the adjacent
paragraph already explains the concept. It contains no financial figures.

## Score

| Element | Role | Start | Duration | Motion | Relationship |
| --- | --- | --- | --- | --- | --- |
| Hero gold line | Lead | Hero 0% | 70% | Draw the frame | Establish the motif |
| Hero figure | Support | Hero 10% | 55% | y 0 → -20px; scale 1 → 1.035 | Overlap the line |
| Frame accents | Decoration | Hero 60% | 20% | Fade only | Settle with the line |
| Pathway grid | Support | Top reaches 90% of viewport | 450ms | 12px → 0 | One group entrance |
| Ledger rows | Lead | Clarity 0% | 35% | Loose rows align | Explain the foundation |
| Report panel, line and bars | Support | Clarity 25% | 40% | Translate, fade, draw and scale | Overlap the ledger |
| Forecast line | Support | Clarity 55% | 35% | Draw dashed continuation | Carry the report forward |
| Forecast endpoint | Support | Clarity 80% | 10% | Fade only | Land with the line |
| Completed graphic | Static | Clarity 90% | 10% | Hold | Let the result register |
| Featured cards and team grid | Support | Top reaches 90% of viewport | 450ms | Each group 12px → 0 | Return to reading flow |

The hero pin adds 60vh and the clarity pin adds 140vh. Native wheel, scrollbar,
trackpad and keyboard scrolling control both timelines directly. Nothing snaps.
Headlines, paragraphs, controls, reviews and portrait framing do not animate.
Service/profile links are never hidden or delayed. Supporting content pages have
one 8px, 450ms entrance on the hero visual and a gold output-card border.

## Adaptation and lifecycle

- Motion requires width >=1200px, height >=720px, fine pointer, hover support and
  no reduced-motion preference. Each scene must also fit below the measured
  sticky header, with 16px above and 20px below; otherwise it remains static.
- Small screens, coarse pointers, reduced motion and disabled scripts render the
  complete diagram without pin spacing. CSS provides the finished state first.
- Scoped GSAP contexts own animations. Resizing, fonts, image loads and page
  restoration refresh their measurements. Changing eligibility removes pins,
  restores original artwork and keeps the current chapter in view. Route changes
  remove contexts, timers and observers. Focus immediately settles a reveal group.
- Motion uses transforms/opacity plus small SVG stroke drawings. React does not
  render per frame. Only the active hero temporarily requests a transform layer.
- Enlarged text can wrap the mobile header, figure caption and portrait copy.
  All controls and the complete 3:2 hero remain available at 320px and 200% text.
- No API, content-schema, CMS, package or environment-file changes were required.

## Verification and artifacts

The production build, strict type check, lint, content provenance and existing
artwork checks passed. The browser suite includes reversible scene phases,
stationary hero copy, fit guards, media-query changes, resizing, 200% text, route
cleanup, browser back, anchors and script-disabled navigation. Additional review
covers 1440/1920/2560px desktops, a short desktop, tablet, 390px and 320px, each at
100% and 200% text. Accessibility is also checked with a scene active.

Evidence is local under `.qa/choreography/`: `before-home.png`, `after-home.png`,
`hero-complete.png`, three `clarity-*.png` phase captures, `supporting-page.png`,
`baseline-performance.json`, `review-results.json` and
`ledgerbyte-desktop-tour.webm` / `.mp4`. The recording includes a reverse through the
clarity scene. The ledger/report handoff and forecast continuation were inspected
at their start, middle and completed phases. Performance evidence uses Chrome's
animation frames, long-task and layout-shift observers, at normal and 4x CPU
throttling; physical-device performance is not claimed.

Final results: 48 browser tests passed with six intentional viewport-specific
skips; SEO (3), AI discovery (3) and preview indexing (1) also passed. All 14
layout/text-size combinations had zero horizontal overflow. Active-scene
accessibility had no serious/critical violations. Both 8-second performance
samples had zero frames above 33.4ms, zero long tasks and zero layout shifts;
their mean frame intervals were 6.96ms and 6.94ms on this host. The static baseline
likewise had no long tasks or layout shifts. Those host measurements are evidence
for this build, not a guarantee for every visitor's hardware.

## Release boundary

Only the authenticated Vercel preview may be updated. Keep both live domains on
their current deployments, verify those IDs after deploying, and keep source
local to the review branch. No Git push, production deployment, CMS mutation,
email or indexing notification is part of this change. QA artifacts, tests, docs,
plans, environment files and credentials are excluded from the deployment upload.
