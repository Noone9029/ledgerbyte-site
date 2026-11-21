// Content from Haider's November 20 source ZIP, adapted into the existing site.
export const homeUpdate = {
  heroLead: "Why hire one accountant when you can get a finance team? Start with the books, tax returns or cash forecast you need today. Bring in a controller or fractional CFO when your next decision calls for one.",
  builderOffer: "From AED 500/month before tax for 15 hours, including bookkeeping, senior review and VAT filing.",
  offers: [
    {
      name: "SME Accounting & Tax Management",
      serviceSlug: "accounting-bookkeeping",
      fit: "Monthly books and tax work, quoted separately from the team builder.",
      description: "Keep your books current and plan for upcoming tax work. We agree which records and deadlines your monthly fee covers.",
      price: 500,
      unit: "/ month",
      service: "Accounting & Bookkeeping",
      cta: "Discuss SME support",
      priceHref: "/build-your-finance-department",
      priceLinkLabel: "Build your finance department",
      href: "/regions/uae",
      scope: "UAE accounting and bookkeeping services",
    },
    {
      name: "VAT Return Filing",
      previousNames: ["VAT Return Support"],
      serviceSlug: "tax-vat-compliance",
      fit: "Preparation and filing for one UAE VAT return.",
      description: "We check your VAT records and prepare your return. Once you approve it and authorize us to submit, we file it for you.",
      price: 750,
      unit: "/ return",
      service: "UAE VAT support",
      cta: "File your VAT return now",
      href: "/uae-vat",
      scope: "UAE VAT return filing",
    },
    {
      name: "UAE Corporate Tax Return Filing",
      previousNames: ["UAE Corporate Tax Review & Filing", "UAE Corporate Tax Filing"],
      serviceSlug: "corporate-tax-filing",
      fit: "Preparation and filing for the agreed corporate tax period.",
      description: "We prepare your corporate tax return and share it with you for review. Once you approve the return and authorize us to submit it, we file it for you.",
      price: 750,
      unit: "",
      service: "UAE Corporate Tax Return Filing",
      cta: "File your corporate tax return now",
      href: "/finance/services/corporate-tax-filing",
      scope: "UAE corporate tax return filing",
    },
  ],
  workstreams: [
    {
      need: "Books or balances behind?", name: "Accounting & Bookkeeping", slug: "accounting-bookkeeping",
      output: "Reconciled books, supporting schedules and open items.", discuss: "Discuss accounting",
    },
    {
      need: "A UAE tax task due?", name: "UAE Tax & VAT", slug: "tax-vat-compliance",
      output: "A review-ready preparation pack with clear approval roles.", discuss: "Discuss tax",
    },
    {
      need: "Need closer financial oversight?", name: "Financial Controller", slug: "fractional-controller",
      output: "Reviewed balances and a list of control issues for your team to resolve.", discuss: "Discuss controller support",
    },
    {
      need: "Planning your next hire?", name: "Fractional CFO", slug: "fractional-cfo-advisory",
      output: "A cash forecast showing how the timing affects available funds.", discuss: "Discuss CFO support",
    },
  ],
  process: [
    { title: "Understand the starting point", text: "Discuss the entity, records, current system, deadlines and the people already involved." },
    { title: "Agree the scope and responsibilities", text: "Define outputs, periods, fees, exclusions and the review calendar. Keep each workstream distinct." },
    { title: "Prepare and resolve exceptions", text: "Organize the agreed work and track missing evidence or questions with named owners." },
    { title: "Review and approve", text: "Review balances, calculations and the business context. Confirm client approval and authorized submission roles." },
    { title: "Hand over and plan the next cycle", text: "Provide the agreed output and open items, then confirm the next inputs and any scope changes." },
  ],
  preparation: "For our first conversation, tell us where you operate, which accounting system you use and the last month you closed. Mention any backlog or upcoming deadline. A short overview is enough.",
  founder: "That’s the question I want your numbers to help you answer. Can you take on a bigger project without tying up too much cash? Can you hire now and still cover next month’s commitments? I started LedgerByte to bring the books, tax work and financial planning together, so you can see what a decision will cost before you make it.",
  faqs: [
    { question: "What does AED 500 per month cover in the builder and the SME offer?", answer: "The finance team builder starts at AED 500 per month before tax for 15 hours. Bookkeeping includes VAT filing, and the monthly fee depends on the role hours you choose. SME Accounting & Tax Management also starts at AED 500 per month. We quote it separately after agreeing which records and deadlines the work covers. Standalone VAT Return Filing starts at AED 750 per return." },
    { question: "What affects the final price?", answer: "We look at the period to cover, the number of transactions and any gaps in the records. For example, tell us if earlier months still need reconciling so we can agree on that work before we quote." },
    { question: "Does SME Accounting & Tax Management include all four pillars?", answer: "The starting price applies to SME Accounting & Tax Management. Controller and fractional CFO services are separately scoped and quoted. Discuss the combination your business needs." },
    { question: "Can I start with just one service?", answer: "Yes. You can start with one task, such as a VAT return or a month-end close. If you’re unsure where to start, tell us what’s due next." },
  ],
};

export function filingOfferForPath(path: string) {
  return homeUpdate.offers.find(offer => offer.href === path && offer.serviceSlug !== "accounting-bookkeeping");
}
