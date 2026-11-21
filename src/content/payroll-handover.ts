import { accountingPages } from "./accounting";
import type { ServiceSample } from "./service-samples";

// The workflow and its payment boundary come from the approved payroll scope.
const payrollRoles: Record<string, string> = {
  "Set the cutoff": "HR and employer",
  "Calculate and compare": "LedgerByte",
  "Resolve exceptions": "LedgerByte and employer",
  "Hand over the pack": "Employer’s authorized approver",
  "Reconcile the outcome": "LedgerByte",
};

export function payrollStep(text: string) {
  const stop = text.indexOf(". ");
  const stage = stop === -1 ? text : text.slice(0, stop);
  const instruction = stop === -1 ? "" : text.slice(stop + 2);
  return { stage, instruction, role: payrollRoles[stage] };
}

const workflow = accountingPages["services/payroll-wps"].sections.find(
  section => section.heading === "Run the monthly payroll workflow",
);
if (!workflow?.bullets.length) throw new Error("The monthly payroll workflow is missing.");

export const payrollHandoverChecklist: ServiceSample = {
  file: "payroll-handover-checklist.csv",
  title: "Monthly payroll handover checklist",
  columns: ["Step", "Responsible party", "Review or handover", "Named owner", "Due date", "Status", "Exception reference"],
  rows: workflow.bullets.map(text => {
    const { stage, role, instruction } = payrollStep(text);
    if (!role) throw new Error(`Confirm the payroll owner for "${stage}".`);
    return [stage, role, instruction, "", "", "", ""];
  }),
};
