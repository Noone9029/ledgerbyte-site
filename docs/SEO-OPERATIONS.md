# LedgerByte SEO Operations

## Release Order

1. Export the current `ledgerbyte.io` Search Console performance, index,
   backlink, and sitemap reports. If no property exists, create a DNS-verified
   domain property before launch. `GOOGLE_SITE_VERIFICATION` supports HTML-tag
   verification when DNS verification is not immediately available.
2. Configure `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel Production and verify
   `generate_lead`, contact channel, form-start, and CTA events without personal
   data.
3. Deploy and validate a preview. Preview HTML and headers must remain
   `noindex, nofollow`.
4. Add `ledgerbyte.io` and `www.ledgerbyte.io` to the Vercel project. Keep the
   blog on `blog.ledgerbyte.io`.
5. Update DNS only after Vercel reports the domains as configured. Verify HTTPS,
   the non-www canonical, every redirect below, and all sitemap URLs.
6. Submit `https://ledgerbyte.io/sitemap.xml` after the canonical domain serves
   the new application. Inspect the homepage, both division hubs, four service
   pages, Contact, and one blog article.

## Migration Matrix

| Legacy source | Permanent destination |
|---|---|
| `/services` | `/finance/services` |
| `/services/:slug` | `/finance/services/:slug` |
| `/about-us` | `/about` |
| `/lets-connect` | `/contact` |
| `/process` | `/technology/process` |
| `/why-ledgerbyte-tech` | `/technology/why-ledgerbyte` |
| `tech.ledgerbyte.io/` | `/technology` |
| `tech.ledgerbyte.io/services` | `/technology/services` |
| `tech.ledgerbyte.io/about` | `/about` |
| `tech.ledgerbyte.io/contact` | `/contact` |

Keep redirects for at least 12 months. Preserve query strings and never send a
retired content URL to the homepage unless the homepage is genuinely the
closest replacement.

## First 90 Days

- Review Search Console weekly for non-brand queries, indexing, soft 404s, and
  unexpected canonical selections.
- Refresh two existing Insights articles each month with a named author,
  qualified reviewer, current official sources, updated date, and contextual
  service links.
- Publish only verified client outcomes. Target one approved case study and one
  practical finance asset per quarter.
- Keep UAE finance as the first search market. Do not create KSA, UK, US,
  Arabic, or city pages until there is distinct local expertise and evidence.
- Do not migrate the blog during the main-domain move. Consider `/insights`
  only after 6–8 stable weeks and with one-to-one article redirects.

## Entity and Local Checks

Use the Sharjah address and `+971 56 137 1569` consistently on the website,
LinkedIn, Trustpilot, and eligible directories. Confirm whether the Shams
Business Center location has permanent LedgerByte signage, LedgerByte staff,
and customer access during stated hours before creating a Google Business
Profile. Do not list an unstaffed virtual office.

## Monitoring and Rollback

Monitor daily for seven days, twice weekly through week four, then monthly.
Track qualified organic leads, non-brand clicks, and priority-query visibility.
If the cutover produces widespread 5xx responses, redirect loops, or missing
canonical pages, restore the previous DNS target while retaining the verified
deployment for diagnosis.
