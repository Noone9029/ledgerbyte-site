# Repository Guidelines

## Project Structure & Module Organization

This Next.js App Router application keeps public routes and the contact API in
`src/app/`, reusable UI in `src/components/`, typed marketing data in
`src/content/`, shared utilities in `src/lib/`, and approved assets in `public/`.

`content-source/ledgerbyte-site-archive-v2/` is the immutable provenance subset
from the archived sites. Generated services live in `src/content/generated/`,
scripts in `scripts/`, and Playwright coverage in `tests/`. SEO assignments are
in `src/content/seo.json`; metadata, analytics, and schema helpers are in
`src/lib/`.

## Build, Test, and Development Commands

Run commands from the repository root:

```powershell
npm ci                  # Install the locked dependency graph
npm run dev             # Start the local development server
npm run content:extract # Rebuild typed service data from content-source/
npm run test:content    # Verify visible marketing-copy provenance
npm run test:visuals    # Check non-shared artwork uniqueness
npm run test:aeo        # Verify AI discovery, direct answers, and person entities
npm run test:seo        # Crawl metadata, schema, sitemap, and redirects
npm run test:seo:preview # Verify preview deployments stay noindex
npm run seo:indexnow    # Notify IndexNow engines after production deploys
npm run test:e2e        # Run Playwright route, interaction, and a11y checks
npm run lint            # Run ESLint
npm run build           # Type-check and create the production build
```

## Coding Style & Naming Conventions

Use TypeScript, semantic HTML, two-space indentation, and Server Components by
default. Use PascalCase components, camelCase functions, lowercase kebab-case
route slugs and assets. Keep GSAP in focused Client Components and preserve
reduced-motion and JavaScript-disabled fallbacks.

## Content, Design, and Security Rules

Use only approved archive-backed or explicitly user-provided marketing copy.
Do not alter `content-source/` casually. Layouts, styling, and non-portrait
imagery must remain original; only the supplied logo and archived team
portraits may be reused. Never commit credentials, `.env` files, customer data,
or `.vercel/`. Resend configuration is optional; the WhatsApp contact handoff
must continue working without it. Enable Google Analytics only when
`NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured. Analytics events must never
include names, email addresses, phone numbers, company names, or message text.

Keep production canonical URLs on `https://ledgerbyte.io`. Preview deployments
must remain `noindex`, and legacy redirects must stay permanent, preserve query
strings, and resolve in one hop. Update `src/content/seo.json`, sitemap tests,
and provenance records together whenever public routes or metadata change.
Keep `public/llms.txt`, team profile entities, and the IndexNow key file
available. IndexNow is a public ownership token, not an application secret.

## Commits and Pull Requests

Use concise imperative commits. Before review, run provenance, visual, SEO,
browser, lint, and build checks. Pull requests should list affected routes,
configuration changes, verification results, and before/after screenshots for
visual work.
