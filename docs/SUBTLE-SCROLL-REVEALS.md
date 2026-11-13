# Subtle homepage reveals — 12 November 2026

Baseline: the restored `fe33ba7` website, retained by rollback commit `dd91f3c`.
The layout, content, illustration, portrait assets, ratios and section order are
unchanged. Only seven existing homepage sections receive an optional entrance.

| Element | Role | Starts | Duration | Motion | Relationship |
| --- | --- | --- | --- | --- | --- |
| Reviews | Support | First entry into view | 360ms | 8px rise, opacity .9 → 1 | Entire section together |
| Service pathways | Support | First entry into view | 360ms | 8px rise, opacity .9 → 1 | Entire section together |
| Statement | Support | First entry into view | 360ms | 8px rise, opacity .9 → 1 | Entire section together |
| Featured services | Support | First entry into view | 360ms | 8px rise, opacity .9 → 1 | Entire section together |
| Team | Support | First entry into view | 360ms | 8px rise, opacity .9 → 1 | Portraits travel together; no scaling |
| Guides | Support | First entry into view | 360ms | 8px rise, opacity .9 → 1 | Entire section together |
| Closing enquiry | Support | First entry into view | 360ms | 8px rise, opacity .9 → 1 | Entire section together |

There is no stagger, delay, pinning, scrubbing, fixed positioning, spacer, scroll
interception, added wrapper or height change. The hero is static so its headline
and actions are immediately available. Navigation, forms, FAQs, footer and other
pages retain their existing behavior. Content already on screen never replays.

The small client controller uses IntersectionObserver and native Web Animations;
no dependency was added. Duration, distance and the existing ease-out curve are
read from `globals.css` tokens. It animates transform/opacity only, without React
updates on scroll. Each group plays once, with no child entrance layered inside.
Visual review should watch the section's first viewport entry: its contents must
read as one small settle, with no pause before links can be used.

Enhancement requires a fine pointer, hover support, width >=1024px and no
reduced-motion preference. Narrow/touch layouts, reduced motion, disabled scripts
and unsupported animation APIs remain fully visible in their original flow.
No content is pre-hidden. Focus and anchors settle their target immediately;
preference changes cancel active effects. Observers/listeners/animations are
cleaned up on navigation, and restored browser pages do not replay visible text.

Verification: production build, strict type check, lint, 2235 copy-provenance
strings and 22 artwork slots passed. Browser tests passed 49 checks with five
intentional viewport skips, plus SEO (3), AI discovery (3) and preview indexing
(1), for 56 passed checks. Coverage includes a paused actual reveal, unchanged
scroll height, once-only behavior, keyboard focus, unsupported API fallback,
reduced-motion changes and JavaScript-disabled navigation. Existing accessibility
checks passed in both themes on desktop, tablet and mobile.

Additional page-height comparisons with scripts enabled/disabled:

| Viewport | Enhanced height | Static height | Pins |
| --- | --- | --- | --- |
| 1440 × 1000 | 6721px | 6721px | 0 |
| 1920 × 1080 | 6859px | 6859px | 0 |
| 2560 × 1440 | 6859px | 6859px | 0 |
| 390 × 844 | 11461px | 11461px | 0 |

Deploy only as an authenticated Vercel preview, with indexing and email sending
disabled. Keep both live domains on their existing deployments and keep source
local to the review branch. No Git push, production promotion or CMS change is
part of this update. Local evidence is under `.qa/subtle-reveals/` and is excluded
from deployment along with tests, docs, plans, environment files and credentials.
