import Image from "next/image";
import styles from "./worked-example-figure.module.css";

type Amount = { label: string; amount: number };
type Chart =
  | { kind: "allocation"; total: Amount; parts: Amount[]; months?: boolean; result?: string }
  | { kind: "comparison"; maximum: number; rows: (Amount & { context: string })[]; percent?: boolean };

type WorkedFigure = { artwork: string; title: string; chart: Chart };

// The figures, periods, and assumptions are from the corresponding worked examples in accounting.json.
const figures: Record<string, WorkedFigure> = {
  "insights/month-end-close": {
    artwork: "insurance-prepayment", title: "Annual insurance",
    chart: { kind: "allocation", months: true, total: { label: "Annual payment", amount: 12000 }, parts: [
      { label: "January expense", amount: 1000 }, { label: "Remaining prepayment", amount: 11000 },
    ] },
  },
  "insights/vat-records": {
    artwork: "vat-reconciliation", title: "Net VAT calculation",
    chart: { kind: "allocation", total: { label: "Net output VAT", amount: 4500 }, parts: [
      { label: "Recoverable input VAT", amount: 2000 }, { label: "Net VAT payable", amount: 2500 },
    ] },
  },
  "services/financial-reporting-mis": {
    artwork: "margin-erosion", title: "Gross margin",
    chart: { kind: "comparison", maximum: 100, percent: true, rows: [
      { label: "Previous month", amount: 40, context: "AED 80,000 gross profit" },
      { label: "Current month", amount: 35, context: "AED 84,000 gross profit" },
    ] },
  },
  "services/budgeting-forecasting": {
    artwork: "forecast-sensitivity", title: "Operating result",
    chart: { kind: "comparison", maximum: 20000, rows: [
      { label: "10 projects", amount: 20000, context: "AED 200,000 revenue" },
      { label: "8 projects", amount: 4000, context: "AED 160,000 revenue" },
    ] },
  },
  "services/payroll-wps": {
    artwork: "payroll-variance", title: "Gross payroll",
    chart: { kind: "allocation", total: { label: "Monthly increase", amount: 8000 }, parts: [
      { label: "New employee", amount: 6000 }, { label: "Approved variable pay", amount: 2000 },
    ], result: "AED 120,000 → AED 128,000" },
  },
  "services/fractional-cfo": {
    artwork: "hiring-break-even", title: "Hiring break-even",
    chart: { kind: "allocation", total: { label: "Additional monthly revenue", amount: 30000 }, parts: [
      { label: "50% contribution margin", amount: 15000 },
    ], result: "Role cost · AED 15,000" },
  },
};

const currency = new Intl.NumberFormat("en-AE");
const aed = (amount: number) => `AED ${currency.format(amount)}`;

function Allocation({ chart }: { chart: Extract<Chart, { kind: "allocation" }> }) {
  return (
    <>
      <div className={styles.total}><span>{chart.total.label}</span><strong>{aed(chart.total.amount)}</strong></div>
      <div className={styles.track} aria-hidden="true">
        {chart.parts.map(part => (
          <span key={part.label} style={{ width: `${part.amount / chart.total.amount * 100}%` }} />
        ))}
        {chart.months && <i className={styles.months} />}
      </div>
      <dl className={styles.legend}>
        {chart.parts.map(part => (
          <div key={part.label}><dt>{part.label}</dt><dd>{aed(part.amount)}</dd></div>
        ))}
      </dl>
      {chart.result && <div className={styles.result}>{chart.result}</div>}
    </>
  );
}

function Comparison({ chart }: { chart: Extract<Chart, { kind: "comparison" }> }) {
  return (
    <dl className={styles.comparison}>
      {chart.rows.map(row => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd><strong>{chart.percent ? `${row.amount}%` : aed(row.amount)}</strong>
            <span className={styles.track} aria-hidden="true">
              <span style={{ width: `${row.amount / chart.maximum * 100}%` }} />
            </span>
            <small>{row.context}</small>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function WorkedExampleFigure({ pageKey }: { pageKey: string }) {
  const figure = figures[pageKey];
  if (!figure) return null;
  return (
    <figure className={styles.figure}>
      <Image className={styles.artwork} src={`/art/examples/${figure.artwork}.webp`} alt=""
        width={960} height={640} sizes="(max-width: 600px) 92vw, (max-width: 1100px) 38vw, 365px" />
      <figcaption className={styles.caption}>
        <strong className={styles.title}>{figure.title}</strong>
        {figure.chart.kind === "allocation" ? <Allocation chart={figure.chart} /> : <Comparison chart={figure.chart} />}
      </figcaption>
    </figure>
  );
}
