export interface ServiceSample {
  file: string;
  title: string;
  columns: string[];
  rows: (string | number)[][];
}

// Illustrative workpapers drawn from the service scopes and worked examples in accounting.json.
export const serviceSamples: Partial<Record<string, ServiceSample>> = {
  "uae-vat": {
    file: "vat-return-reconciliation.csv",
    title: "VAT return reconciliation",
    columns: ["Return working", "Excl. VAT · AED", "VAT · AED"],
    rows: [
      ["Sales", 100000, 5000],
      ["Sales credit note", -10000, -500],
      ["Net sales", 90000, 4500],
      ["Less recoverable input VAT", 40000, -2000],
      ["Simplified net VAT payable", "—", 2500],
    ],
  },
  "services/budgeting-forecasting": {
    file: "budget-variance.csv",
    title: "Budget versus actual",
    columns: ["Basis", "Revenue · AED", "Operating result · AED"],
    rows: [
      ["Budget · 10 projects", 200000, 20000],
      ["Illustrative actual · 8 projects", 160000, 4000],
      ["Variance", -40000, -16000],
    ],
  },
  "services/payroll-wps": {
    file: "payroll-variance.csv",
    title: "A payroll review example",
    columns: ["Gross payroll", "AED"],
    rows: [
      ["Last month", 120000],
      ["New employee", 6000],
      ["Approved variable pay", 2000],
      ["This month", 128000],
    ],
  },
  "services/finance-department-outsourcing": {
    file: "responsibility-map.csv",
    title: "Monthly finance handover",
    columns: ["Monthly work", "LedgerByte", "Management"],
    rows: [
      ["Purchases and payables", "Prepare payment proposals", "Release payments"],
      ["Payroll coordination", "Prepare agreed payroll schedules", "Salary approval"],
      ["Sales and receivables", "Allocate receipts", "Write-offs"],
      ["Month-end and reporting", "Management accounts and a cash update", "Review outstanding decisions"],
    ],
  },
  "services/financial-reporting-mis": {
    file: "monthly-management-pack.csv",
    title: "Monthly management pack index",
    columns: ["Pack section", "Supporting record", "For review"],
    rows: [
      ["Profit and loss", "Revenue and direct costs", "Gross margin: 40% to 35%"],
      ["Balance sheet", "Reconciled balances", "Open data issues"],
      ["Cash summary", "Receivables ageing", "Cash tied up"],
      ["KPIs", "KPI definition sheet", "Period, source and owner"],
    ],
  },
  "services/fractional-controller": {
    file: "close-review.csv",
    title: "Review checklist",
    columns: ["Review", "Supporting record", "Follow-up"],
    rows: [
      ["Bank balances", "Bank reconciliation", "Old or unsupported items"],
      ["Clearing account", "Supporting evidence", "Resolution owner"],
      ["Material movements", "Management-pack comments", "Open accounting issues"],
    ],
  },
  "services/accounts-payable": {
    file: "supplier-exceptions.csv",
    title: "Supplier exceptions log",
    columns: ["Item", "Evidence to check", "Status"],
    rows: [
      ["Resent invoice", "Supplier, reference and amount", "Possible duplicate"],
      ["Unmatched credit", "Supplier statement", "Awaiting reconciliation"],
      ["Bank details change", "Vendor verification", "On hold"],
    ],
  },
  "services/accounts-receivable": {
    file: "receipt-allocation.csv",
    title: "Receipt allocation",
    columns: ["Ledger entry", "Applied · AED", "Unallocated · AED"],
    rows: [
      ["Bank receipt", 0, 10000],
      ["First unpaid invoice", 6000, 4000],
      ["Second unpaid invoice", 4000, 0],
    ],
  },
  "services/corporate-tax-filing": {
    file: "filing-pack-index.csv",
    title: "Filing pack index",
    columns: ["Record", "Basis", "Status"],
    rows: [
      ["Accounting result", "Trial balance", "Reconciled"],
      ["Proposed adjustment", "Supporting schedule", "For review"],
      ["Proposed return", "Tax computation", "Awaiting approval"],
    ],
  },
  "services/internal-audit": {
    file: "controls-testing.csv",
    title: "Supplier-payment control test",
    columns: ["Control", "Evidence", "Follow-up"],
    rows: [
      ["Vendor changes", "System role list", "Check access"],
      ["Invoice approval", "Approval record", "Trace sign-off"],
      ["Payment release", "Payment confirmation", "Verify authority"],
    ],
  },
  "services/external-audit": {
    file: "audit-request-tracker.csv",
    title: "Audit request tracker",
    columns: ["Request", "Supporting record", "Status"],
    rows: [
      ["Bank balances", "Bank reconciliation", "Prepared"],
      ["Receivables", "Ageing report", "For review"],
      ["Adjustments", "Adjustment log", "Awaiting approval"],
    ],
  },
};
