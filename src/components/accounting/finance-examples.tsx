import Link from "next/link";
import styles from "./finance-examples.module.css";

const currency = new Intl.NumberFormat("en-AE");
const aed = (value: number) => `${value < 0 ? "−" : ""}AED ${currency.format(Math.abs(value))}`;

// Figures from the supplied profit-and-cash guide. Each adjustment is relative to profit.
const bridge = [
  { label: "Accounting profit", amount: 30000 },
  { label: "Depreciation", amount: 5000 },
  { label: "Increase in receivables", amount: -40000 },
  { label: "Increase in payables", amount: 15000 },
  { label: "Equipment purchases", amount: -20000 },
  { label: "Loan principal repaid", amount: -10000 },
];
const balanceAt = (count: number) => bridge.slice(0, count).reduce((sum, row) => sum + row.amount, 0);

export function CashBridgePreview() {
  const totals = [
    { label: "Accounting profit", amount: balanceAt(1) },
    { label: "Operating cash generated", amount: balanceAt(4) },
    { label: "Change in cash", amount: balanceAt(6) },
  ];
  const low = Math.min(0, ...totals.map(row => row.amount));
  const span = Math.max(...totals.map(row => row.amount)) - low;
  return (
    <figure className={styles.preview}>
      <figcaption className="eyebrow">Profit to cash · One month</figcaption>
      <dl>
        {totals.map(({ label, amount }) => (
          <div className={styles.measure} key={label}>
            <dt>{label}</dt>
            <dd>
              {aed(amount)}
              <span className={styles.scale} aria-hidden="true">
                <i style={{
                  insetInlineStart: `${100 * (Math.min(0, amount) - low) / span}%`,
                  width: `${100 * Math.abs(amount) / span}%`,
                }} />
                <b style={{ insetInlineStart: `${100 * -low / span}%` }} />
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <Link className="text-link" href="/insights/profit-and-cash#cash-bridge">See the calculation ↗</Link>
    </figure>
  );
}

export function CashBridgeWorksheet() {
  return (
    <table className={styles.worksheet}>
      <caption>Illustrative cash bridge · AED</caption>
      <thead><tr><th scope="col">Movement</th><th scope="col">Amount</th><th scope="col">Running total</th></tr></thead>
      <tbody>
        {bridge.map(({ label, amount }, i) => (
          <tr key={label}><th scope="row">{label}</th><td>{i > 0 && amount > 0 ? "+" : ""}{currency.format(amount)}</td><td>{currency.format(balanceAt(i + 1))}</td></tr>
        ))}
      </tbody>
      <tfoot><tr><th scope="row" colSpan={2}>Change in cash</th><td>{currency.format(balanceAt(bridge.length))}</td></tr></tfoot>
    </table>
  );
}

export function ReceiptMatchingSample() {
  return (
    <table className={styles.worksheet}>
      <caption>Illustrative receipt allocation · AED</caption>
      <thead><tr><th scope="col">Bank receipt</th><th scope="col">Ledger entry</th><th scope="col">Amount to match</th></tr></thead>
      <tbody>
        <tr><th scope="row" rowSpan={2}>10,000</th><td>First unpaid invoice</td><td>6,000</td></tr>
        <tr><td>Second unpaid invoice</td><td>4,000</td></tr>
      </tbody>
      <tfoot><tr><th scope="row" colSpan={2}>Unallocated after remittance is confirmed</th><td>0</td></tr></tfoot>
    </table>
  );
}

export function CashTimingSample() {
  return (
    <table className={styles.worksheet}>
      <caption>Illustrative cash forecast · AED</caption>
      <thead><tr><th scope="col">Cash movement</th><th scope="col">As forecast</th><th scope="col">One receipt delayed</th></tr></thead>
      <tbody>
        <tr><th scope="row">Opening cash</th><td>50,000</td><td>50,000</td></tr>
        <tr><th scope="row">Customer receipts</th><td>80,000</td><td>40,000</td></tr>
        <tr><th scope="row">Scheduled payments</th><td>−100,000</td><td>−100,000</td></tr>
      </tbody>
      <tfoot><tr><th scope="row">Closing cash</th><td>30,000</td><td>−10,000</td></tr></tfoot>
    </table>
  );
}
