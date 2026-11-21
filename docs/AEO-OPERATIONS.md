# LedgerByte AEO Operations

## What Is Implemented

The finance site serves its answers, service links and JSON-LD in the initial
HTML. Its three practical guides identify LedgerByte as author and cite the
sources behind their examples. Team profiles describe the six named people
separately. Service pages identify the provider and match their visible
questions and answers. The UAE offers specify currency, billing unit and
starting price. Public pages allow search crawlers through `robots.txt`.

`llms.txt` is a discovery aid, not a Google ranking directive. Google states
that its normal crawlability, indexing, structured-data, and people-first
content requirements also apply to AI search experiences.

## Release Checklist

1. Run `npm run test:content`, `npm run test:aeo`, `npm run test:seo`,
   `npm run lint`, and `npm run build`.
2. Deploy production and verify `/robots.txt`, `/llms.txt`, `/sitemap.xml`, and
   the IndexNow key file return `200`.
3. Check the submitted `https://ledgerbyte.io/sitemap.xml` and its last read in
   Google Search Console. Submit it if the property has no existing entry.
4. Send affected finance URLs to participating engines with
   `npm run seo:indexnow -- /changed-path /another-changed-path`.
5. Inspect the priority commercial URLs in Google Search Console. Request
   indexing only after the live test passes.
6. Confirm GA4 receives `ai_referral_session` with only `ai_source`,
   `referral_host`, and `landing_page`.

## Citation and Authorship Standard

Keep the visible byline and article markup aligned. Credit a person and link
their profile when their authorship or review is documented. Use the publisher
byline for a collective LedgerByte guide. Cite the source behind each example
and link to the relevant service. Publish dates, credentials or client outcomes
only when there is a record to support them.

## Monthly Measurement

Complete `docs/AEO-MONITORING.csv` on the same day each month using fresh,
signed-out sessions where possible. Record whether LedgerByte is mentioned,
which LedgerByte URL is cited, and which competitors are cited. Also review:

- Google Search Console non-brand queries and indexed pages.
- Bing Webmaster Tools IndexNow history and AI Performance.
- GA4 `ai_referral_session` sessions and qualified lead events.
- Server logs for OAI-SearchBot, Bingbot, and other permitted crawlers.

AI mentions can vary by user, location, and model. Track citation coverage and
qualified enquiries over time; do not treat a single generated answer as a
stable ranking.

## Primary References

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- https://www.indexnow.org/documentation
- https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c
