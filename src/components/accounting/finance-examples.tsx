import Image from "next/image";
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
const balances = [0, ...bridge.map((_, i) => balanceAt(i + 1))];

function ExampleArt({ subject }: { subject: "profit-to-cash" | "receipt-matching" | "processor-settlement" | "cash-timing" }) {
  return <Image className={styles.art} src={`/art/examples/${subject}.webp`} alt="" width={960} height={640}
    sizes="(max-width: 700px) 90vw, (max-width: 1000px) 52vw, 460px" />;
}

// Each bar runs between two values on the same axis. The dotted rule marks zero.
function RangeBar({ from = 0, to, min, max }: { from?: number; to: number; min: number; max: number }) {
  const position = (value: number) => 100 * (value - min) / (max - min);
  return (
    <span className={styles.track} aria-hidden="true">
      <i className={to < from ? styles.decrease : styles.increase} style={{
        insetInlineStart: `${position(Math.min(from, to))}%`,
        width: `${100 * Math.abs(to - from) / (max - min)}%`,
      }} />
      <b style={{ insetInlineStart: `${position(0)}%` }} />
    </span>
  );
}

function SplitBar({ first, second }: { first: number; second: number }) {
  return (
    <span className={styles.split} aria-hidden="true">
      <i className={styles.increase} style={{ flexGrow: first }} />
      <i className={styles.decrease} style={{ flexGrow: second }} />
    </span>
  );
}

export function GuideCashChart({ view }: { view: "result" | "movements" }) {
  const measures = view === "result"
    ? [{ label: "Accounting profit", amount: balances[1] }, { label: "Change in cash", amount: balances[6] }]
    : [{ label: "Cash received", amount: 60000 }, { label: "Cash paid", amount: 80000 }];
  const min = Math.min(0, ...measures.map(row => row.amount));
  const max = Math.max(...measures.map(row => row.amount));
  return (
    <dl className={styles.cashComparison}>
      {measures.map(row => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{aed(row.amount)}<RangeBar to={row.amount} min={min} max={max} /></dd>
        </div>
      ))}
    </dl>
  );
}

export function CashBridgePreview() {
  const totals = [
    { label: "Accounting profit", amount: balances[1] },
    { label: "Operating cash generated", amount: balances[4] },
    { label: "Change in cash", amount: balances[6] },
  ];
  const min = Math.min(0, ...totals.map(row => row.amount));
  const max = Math.max(0, ...totals.map(row => row.amount));
  return (
    <div className={styles.visual}>
      <figure className={styles.preview}>
        <ExampleArt subject="profit-to-cash" />
        <figcaption>
          <p className="eyebrow">Profit to cash · One month</p>
          <dl className={styles.measures}>
            {totals.map(({ label, amount }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{aed(amount)}<RangeBar to={amount} min={min} max={max} /></dd>
              </div>
            ))}
          </dl>
          <Link className="text-link" href="/insights/profit-and-cash#cash-bridge">See the calculation ↗</Link>
        </figcaption>
      </figure>
    </div>
  );
}

export function CashBridgeWorksheet() {
  const min = Math.min(...balances);
  const max = Math.max(...balances);
  return (
    <div className={styles.visual}>
      <div className={styles.plate}>
        <ExampleArt subject="profit-to-cash" />
        <table className={styles.worksheet}>
          <caption>Illustrative cash bridge · AED</caption>
          <thead><tr><th scope="col">Movement</th><th scope="col">Amount</th><th scope="col">Running total</th></tr></thead>
          <tbody>
            {bridge.map(({ label, amount }, i) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{i > 0 && amount > 0 ? "+" : ""}{currency.format(amount)}</td>
                <td>{currency.format(balances[i + 1])}<RangeBar from={balances[i]} to={balances[i + 1]} min={min} max={max} /></td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><th scope="row" colSpan={2}>Change in cash</th><td>{currency.format(balanceAt(bridge.length))}</td></tr></tfoot>
        </table>
      </div>
    </div>
  );
}

export function ReceiptMatchingSample() {
  const invoices = [6000, 4000];
  const receipt = 10000;
  return (
    <div className={styles.visual}>
      <div className={styles.plate}>
        <ExampleArt subject="receipt-matching" />
        <table className={styles.worksheet}>
          <caption>Illustrative receipt allocation · AED</caption>
          <tbody>
            <tr><th scope="row">Bank receipt</th><td>{currency.format(receipt)}</td></tr>
            <tr aria-hidden="true" className={styles.splitRow}><td colSpan={2}><SplitBar first={invoices[0]} second={invoices[1]} /></td></tr>
            <tr><th scope="row"><i className={`${styles.key} ${styles.increase}`} aria-hidden="true" />First unpaid invoice</th><td>{currency.format(invoices[0])}</td></tr>
            <tr><th scope="row"><i className={`${styles.key} ${styles.decrease}`} aria-hidden="true" />Second unpaid invoice</th><td>{currency.format(invoices[1])}</td></tr>
          </tbody>
          <tfoot><tr><th scope="row">Unallocated after remittance is confirmed</th><td>{receipt - invoices[0] - invoices[1]}</td></tr></tfoot>
        </table>
      </div>
    </div>
  );
}

export function ProcessorSettlementSample() {
  const gross = 10000;
  const fees = 300;
  const net = gross - fees;
  return (
    <div className={styles.visual}>
      <div className={styles.plate}>
        <ExampleArt subject="processor-settlement" />
        <table className={styles.worksheet}>
          <caption>Illustrative settlement · AED</caption>
          <tbody>
            <tr><th scope="row">Gross sales</th><td>{currency.format(gross)}</td></tr>
            <tr aria-hidden="true" className={styles.splitRow}><td colSpan={2}><SplitBar first={net} second={fees} /></td></tr>
            <tr><th scope="row"><i className={`${styles.key} ${styles.decrease}`} aria-hidden="true" />Processing fees</th><td>−{currency.format(fees)}</td></tr>
          </tbody>
          <tfoot><tr><th scope="row"><i className={`${styles.key} ${styles.increase}`} aria-hidden="true" />Bank deposit</th><td>{currency.format(net)}</td></tr></tfoot>
        </table>
      </div>
    </div>
  );
}

export function CashTimingSample() {
  const opening = 50000;
  const payments = 100000;
  const scenarios = [{ name: "As forecast", receipts: 80000 }, { name: "One receipt delayed", receipts: 40000 }];
  const closing = scenarios.map(scenario => opening + scenario.receipts - payments);
  return (
    <div className={styles.visual}>
      <div className={styles.plate}>
        <ExampleArt subject="cash-timing" />
        <table className={styles.worksheet}>
          <caption>Illustrative cash forecast · AED</caption>
          <thead><tr><th scope="col">Cash movement</th>{scenarios.map(s => <th key={s.name} scope="col">{s.name}</th>)}</tr></thead>
          <tbody>
            <tr><th scope="row">Opening cash</th>{scenarios.map(s => <td key={s.name}>{currency.format(opening)}</td>)}</tr>
            <tr><th scope="row">Customer receipts</th>{scenarios.map(s => <td key={s.name}>{currency.format(s.receipts)}</td>)}</tr>
            <tr><th scope="row">Scheduled payments</th>{scenarios.map(s => <td key={s.name}>−{currency.format(payments)}</td>)}</tr>
          </tbody>
          <tfoot><tr><th scope="row">Closing cash</th>{closing.map((amount, i) => (
            <td key={scenarios[i].name}>{amount < 0 ? "−" : ""}{currency.format(Math.abs(amount))}
              <RangeBar to={amount} min={Math.min(0, ...closing)} max={Math.max(0, ...closing)} />
            </td>
          ))}</tr></tfoot>
        </table>
      </div>
    </div>
  );
}
