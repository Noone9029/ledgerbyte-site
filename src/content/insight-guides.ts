export type GuideExample = {
  artwork: string;
  summary: string;
  amounts: [string, string][];
  reference: string;
  url: string;
  service: string;
  servicePath: string;
};

// These English guides are already published on LedgerByte Insights.
export const relatedInsights = [
  {
    slug: "outsourced-bookkeeping-vs-fractional-cfo",
    title: "Outsourced bookkeeping vs a fractional CFO: choose the next layer",
    pages: ["services/accounting-bookkeeping", "services/fractional-cfo", "services/finance-department-outsourcing"],
  },
  {
    slug: "pakistan-monthly-management-reporting-pack",
    title: "A monthly management reporting pack for a Pakistan business",
    pages: ["regions/pakistan", "services/financial-reporting-mis"],
  },
  {
    slug: "saudi-vat-zatca-records-handover",
    title: "Saudi VAT and ZATCA: prepare a records handover by obligation",
    pages: ["regions/saudi-arabia", "services/ksa-vat", "services/zatca-filing"],
  },
  {
    slug: "uae-corporate-tax-registration-vs-filing",
    title: "UAE corporate tax registration vs filing: separate the workstreams",
    pages: ["services/corporate-tax-registration", "services/corporate-tax-filing"],
  },
  {
    slug: "uae-vat-registration-vs-return-filing",
    title: "UAE VAT registration vs return filing: which task do you need?",
    pages: ["uae-vat", "services/vat-registration", "insights/vat-records"],
  },
  {
    slug: "us-year-end-bookkeeping-adviser-handover",
    title: "US year-end bookkeeping: prepare a useful adviser handover",
    pages: ["regions/united-states", "services/month-end-year-end-close"],
  },
];

export const guideExamples: Record<string, GuideExample> = {
  "insights/month-end-close": {
    artwork: "insurance-prepayment",
    amounts: [["Annual payment", "AED 12,000"], ["January expense", "AED 1,000"], ["Remaining prepayment", "AED 11,000"]],
    summary: "A business pays AED 12,000 in January for a year of insurance. With even monthly cover on an accrual basis, January’s expense is AED 1,000 and AED 11,000 remains prepaid.",
    reference: "ACCA on accruals and prepayments",
    url: "https://www.accaglobal.com/sg/en/student/exam-support-resources/fundamentals-exams-study-resources/f3/technical-articles/adjustments-financial-statements.html",
    service: "Accounting & Bookkeeping",
    servicePath: "/finance/services/accounting-bookkeeping",
  },
  "insights/profit-and-cash": {
    artwork: "profit-to-cash",
    amounts: [["Accounting profit", "AED 30,000"], ["Cash received", "AED 60,000"], ["Cash paid", "AED 80,000"], ["Change in cash", "−AED 20,000"]],
    summary: "A business earns AED 30,000 in profit. Customers pay AED 60,000, while operating payments, equipment and debt repayments total AED 80,000. Cash falls by AED 20,000.",
    reference: "IFRS Foundation on cash flows",
    url: "https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/",
    service: "Cash Flow & Working Capital",
    servicePath: "/finance/services/cash-flow-working-capital",
  },
  "insights/vat-records": {
    artwork: "vat-reconciliation",
    amounts: [["Net output VAT", "AED 4,500"], ["Recoverable input VAT", "AED 2,000"], ["Net VAT payable", "AED 2,500"]],
    summary: "For the standard-rated UAE transactions in this example, a sales credit note leaves AED 4,500 of output VAT. Subtracting AED 2,000 of recoverable input VAT gives AED 2,500 payable.",
    reference: "UAE VAT law, Article 3 (standard rate)",
    url: "https://tax.gov.ae/Datafolder/Files/Legislation/2025/Federal-Decree-Law-No-8-of-2017-and-amendments.pdf",
    service: "UAE VAT support",
    servicePath: "/uae-vat",
  },
};
