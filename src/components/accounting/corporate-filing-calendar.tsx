import styles from "./corporate-filing-calendar.module.css";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CorporateFilingCalendar() {
  return (
    <details id="filing-calendar" className={styles.calendar}>
      <summary>Find your filing month</summary>
      <p>
        The standard UAE corporate tax filing and payment deadline is nine months after the end of the tax period.
        {" "}Confirm the actual period and deadline in the <a href="https://eservices.tax.gov.ae/">taxpayer’s account</a>.
      </p>
      <p className={styles.source}>
        <a href="https://tax.gov.ae/en/media.centre/news/pr.2809.aspx">FTA filing reminder</a>
        <span>31 December 2025 <span aria-hidden="true">→</span><span className="sr-only"> to </span> 30 September 2026</span>
      </p>
      <table aria-label="Standard filing months">
        <thead>
          <tr>
            <th scope="col">Tax period end</th>
            <th scope="col">Filing and payment month</th>
          </tr>
        </thead>
        <tbody>
          {months.map((month, index) => {
            const filingIndex = index + 9;
            return (
              <tr key={month}>
                <th scope="row">{month}</th>
                <td>{months[filingIndex % 12]} <span>· {filingIndex < 12 ? "same year" : "next year"}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </details>
  );
}
