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
