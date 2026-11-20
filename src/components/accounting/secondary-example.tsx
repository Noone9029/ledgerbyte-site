import Image from "next/image";
import frame from "./worked-example-figure.module.css";
import styles from "./secondary-example.module.css";

const forecast = { opening: 30000, receipts: 70000, payments: 80000, delayed: 25000 };
const expectedClosing = forecast.opening + forecast.receipts - forecast.payments;
const delayedClosing = expectedClosing - forecast.delayed;
const scale = expectedClosing - delayedClosing;
const zero = -delayedClosing / scale * 100;
const currency = new Intl.NumberFormat("en-AE");
const aed = (value: number) => `${value < 0 ? "−" : ""}AED ${currency.format(Math.abs(value))}`;

function CollectionComparison() {
  return (
    <dl className={styles.balances}>
      {[
        { label: "Receipts arrive as forecast", amount: expectedClosing },
        { label: `${aed(forecast.delayed)} arrives later`, amount: delayedClosing },
      ].map(({ label, amount }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>
            <strong>{aed(amount)}</strong>
            <span className={styles.axis} aria-hidden="true">
              <i className={amount < 0 ? styles.shortfall : styles.surplus} style={{
                insetInlineStart: `${Math.min(zero, zero + amount / scale * 100)}%`,
                width: `${Math.abs(amount) / scale * 100}%`,
              }} />
              <b style={{ insetInlineStart: `${zero}%` }} />
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function TaxReviewFlow() {
  return (
    <ol className={styles.flow} role="list">
      <li><span>Expense in the ledger</span><strong>AED 10,000</strong></li>
      <li><span>Preparation schedule</span><strong>Records the proposed tax adjustment and identifies its basis.</strong></li>
      <li><span>Deductible amount</span><strong>Depends on the nature of the expense and the applicable rules.</strong></li>
    </ol>
  );
}

export function SecondaryExample({ kind }: { kind: "tax-adjustment" | "delayed-collection" }) {
  const tax = kind === "tax-adjustment";
  return (
    <figure className={frame.figure}>
      <Image className={frame.artwork} src={`/art/examples/${kind}.webp`} alt=""
        width={960} height={640} sizes="auto, (max-width: 575px) 94vw, (max-width: 920px) 60vw, (max-width: 1100px) 37vw, 450px" />
      <figcaption className={frame.caption}>
        <strong className={frame.title}>{tax ? "From ledger to tax review" : "Projected closing cash"}</strong>
        {tax ? <TaxReviewFlow /> : <CollectionComparison />}
      </figcaption>
    </figure>
  );
}
