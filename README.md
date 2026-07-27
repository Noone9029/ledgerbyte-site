# LedgerByte Web

Unified Next.js storefront for LedgerByte Finance and LedgerByte Technology.

## Local Development

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Verification

```powershell
npm run test:content
npm run test:seo
npm run test:seo:preview
npm run test:e2e
npm run lint
npm run build
```

`test:content` verifies visible marketing copy against the immutable provenance
subset in `content-source/ledgerbyte-site-archive-v2`. Playwright covers all
public routes at desktop, tablet, and mobile sizes, plus accessibility,
reduced-motion, JavaScript-disabled rendering, redirects, menus, service links,
FAQs, and contact states.

## Contact Delivery

The contact form validates each enquiry server-side and opens a prefilled
WhatsApp chat with LedgerByte. The visitor reviews the message and confirms
delivery inside WhatsApp. Direct email, phone, and WhatsApp alternatives remain
visible, and the form retains its data if the handoff is interrupted.

An optional email copy can be delivered through Resend:

```dotenv
RESEND_API_KEY=
CONTACT_FROM_EMAIL="LedgerByte Website <website@your-verified-domain>"
CONTACT_TO_EMAIL=info@ledgerbyte.io
```

WhatsApp works without Resend credentials. Never commit production values.

## Search and Analytics

SEO metadata, canonical paths, target intent, and modification dates are
centralized in `src/content/seo.json`. Production uses
`https://ledgerbyte.io`; Vercel previews are `noindex`, while permanent
redirects preserve the legacy finance and technology URLs.

Google Analytics is optional:

```dotenv
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=google-verification-token
```

The implementation records contact channel clicks, consultation CTA clicks,
form starts, and successful leads. It does not send visitor-entered personal
information to analytics. See `docs/SEO-OPERATIONS.md` for the domain cutover,
Search Console, profile consistency, and ongoing content checklist.
