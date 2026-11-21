import { payrollHandoverChecklist, payrollStep } from "@/content/payroll-handover";
import styles from "./payroll-handover.module.css";

export function PayrollHandover({ steps }: { steps: string[] }) {
  return (
    <div className={styles.handover} id="payroll-handover">
      <ol className={styles.steps}>
        {steps.map(text => {
          const { stage, role, instruction } = payrollStep(text);
          return (
            <li key={stage}>
              <strong>{stage}</strong>
              <small>{role}</small>
              <span>{instruction}</span>
            </li>
          );
        })}
      </ol>
      <a href={`/samples/${payrollHandoverChecklist.file}`} download className={styles.download}>
        Download payroll checklist <span>(CSV)</span>
      </a>
    </div>
  );
}
