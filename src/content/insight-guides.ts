export type GuideExample = {
  summary: string;
  reference: string;
  url: string;
  service: string;
  servicePath: string;
};

export const guideExamples: Record<string, GuideExample> = {
  "insights/month-end-close": {
    summary: "A business pays AED 12,000 in January for a year of insurance. With even monthly cover on an accrual basis, January’s expense is AED 1,000 and AED 11,000 remains prepaid.",
    reference: "ACCA on accruals and prepayments",
    url: "https://www.accaglobal.com/sg/en/student/exam-support-resources/fundamentals-exams-study-resources/f3/technical-articles/adjustments-financial-statements.html",
    service: "Accounting & Bookkeeping",
    servicePath: "/finance/services/accounting-bookkeeping",
  },
  "insights/profit-and-cash": {
    summary: "A business earns AED 30,000 in profit. Customers pay AED 60,000, while operating payments, equipment and debt repayments total AED 80,000. Cash falls by AED 20,000.",
    reference: "IFRS Foundation on cash flows",
    url: "https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/",
    service: "Cash Flow & Working Capital",
    servicePath: "/finance/services/cash-flow-working-capital",
  },
  "insights/vat-records": {
    summary: "For the standard-rated UAE transactions in this example, a sales credit note leaves AED 4,500 of output VAT. Subtracting AED 2,000 of recoverable input VAT gives AED 2,500 payable.",
    reference: "UAE VAT law, Article 3 (standard rate)",
    url: "https://tax.gov.ae/Datafolder/Files/Legislation/2025/Federal-Decree-Law-No-8-of-2017-and-amendments.pdf",
    service: "UAE VAT support",
    servicePath: "/uae-vat",
  },
};
