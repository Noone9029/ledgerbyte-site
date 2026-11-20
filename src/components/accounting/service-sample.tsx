import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import type { ServiceSample as Sample } from "@/content/service-samples";
import styles from "./service-sample.module.css";

const number = new Intl.NumberFormat("en-AE");

export function ServiceSample({ sample }: { sample: Sample }) {
  return (
    <figure id="sample-deliverable" className={styles.sheet}>
      <figcaption>
        <span className={styles.imprint}>LedgerByte</span>
        <span className={styles.sampleLabel}>Illustrative deliverable</span>
        <strong>{sample.title}</strong>
      </figcaption>
      <table aria-label={sample.title}>
        <thead><tr>{sample.columns.map((column, i) => <th scope="col" key={column} className={typeof sample.rows[0][i] === "number" ? styles.number : undefined}>{column}</th>)}</tr></thead>
        <tbody>{sample.rows.map(([label, ...cells]) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            {cells.map((value, i) => <td key={sample.columns[i + 1]} className={typeof value === "number" ? styles.number : undefined}>
              {typeof value === "number" ? number.format(value) : value}
            </td>)}
          </tr>
        ))}</tbody>
      </table>
      <a href={`/samples/${sample.file}`} download className={styles.download}>Download sample <span>CSV</span><ArrowDown size={16} aria-hidden="true" /></a>
    </figure>
  );
}
