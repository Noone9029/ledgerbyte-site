# Repository Guidelines

## Project Structure & Module Organization

This repository is a Next.js App Router application. Public routes and the
contact API live in `src/app/`, reusable interface elements in
`src/components/`, typed marketing data in `src/content/`, and shared utilities
in `src/lib/`. Original artwork, the LedgerByte logo, team portraits, and
self-hosted fonts are stored under `public/`.

`content-source/ledgerbyte-site-archive-v2/` is the immutable text and HTML
provenance subset from the archived LedgerByte sites. Generated service data
lives in `src/content/generated/`. Extraction and verification utilities are in
`scripts/`, while Playwright coverage is in `tests/`.

## Build, Test, and Development Commands

Run commands from the repository root:

```powershell
npm ci                  # Install the locked dependency graph
npm run dev             # Start the local development server
npm run content:extract # Rebuild typed service data from content-source/
npm run test:content    # Verify visible marketing-copy provenance
npm run test:visuals    # Check non-shared artwork uniqueness
npm run test:e2e        # Run Playwright route, interaction, and a11y checks
npm run lint            # Run ESLint
npm run build           # Type-check and create the production build
```

## Coding Style & Naming Conventions

Use TypeScript, semantic HTML, two-space indentation, and Server Components by
default. Name components in PascalCase, functions in camelCase, dynamic route
slugs in lowercase kebab-case, and assets with lowercase kebab-case filenames.
Keep GSAP in focused Client Components and preserve reduced-motion and
JavaScript-disabled fallbacks.

## Content, Design, and Security Rules

Use only approved archive-backed or explicitly user-provided marketing copy.
Do not alter `content-source/` casually. Layouts, styling, and non-portrait
imagery must remain original; only the supplied logo and archived team
portraits may be reused. Never commit credentials, `.env` files, customer data,
or `.vercel/`. Resend configuration is optional; the WhatsApp contact handoff
must continue working without it.

## Commits and Pull Requests

Use concise imperative commits. Before review, run provenance, visual, browser,
lint, and build checks. Pull requests should list affected routes, configuration
changes, verification results, and before/after screenshots for visual work.
