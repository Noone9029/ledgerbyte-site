# LedgerByte AEO Operations

## What Is Implemented

LedgerByte exposes answer-first passages on every finance service page, stable
`Person` and `ProfilePage` entities for team members, linked expert reviewers,
FAQ and Service schema, crawlable server-rendered content, and
`https://ledgerbyte.io/llms.txt`. The site permits AI crawlers through the
wildcard rule in `robots.txt`.

`llms.txt` is a discovery aid, not a Google ranking directive. Google states
that its normal crawlability, indexing, structured-data, and people-first
content requirements also apply to AI search experiences.

## Release Checklist

1. Run `npm run test:content`, `npm run test:aeo`, `npm run test:seo`,
   `npm run lint`, and `npm run build`.
2. Deploy production and verify `/robots.txt`, `/llms.txt`, `/sitemap.xml`, and
   the IndexNow key file return `200`.
3. Resubmit `https://ledgerbyte.io/sitemap.xml` in Google Search Console.
4. Run `npm run seo:indexnow`. IndexNow notifies participating engines such as
   Bing; it does not submit URLs to Google.
5. Inspect the priority commercial URLs in Google Search Console. Request
   indexing only after the live test passes.
6. Confirm GA4 receives `ai_referral_session` with only `ai_source`,
   `referral_host`, and `landing_page`.

## Citation and Authorship Standard

Every finance article refresh must name the real author and qualified reviewer,
link each person to a LedgerByte team profile, show accurate publication and
modification dates, cite current primary sources, and link contextually to the
closest finance service. Do not add credentials, client results, regulatory
claims, or update dates that cannot be verified.

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

- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- https://www.indexnow.org/documentation
- https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c
