import { PBI } from "@core/types";
const esc = (s: string) => {
  const needs = /[",\n]/.test(s);
  const e = s.replace(/"/g, '""');
  return needs ? `"${e}"` : e;
};
export function toJiraCSV(items: PBI[]): string {
  const header = ["Summary","Issue Type","Description","Priority","Labels","Acceptance Criteria","Epic Link"].join(",");
  const rows = items.map(i => [
    esc(i.summary), "Story", esc(i.description), i.priority, esc(i.labels.join(" ")),
    esc(i.acceptanceCriteria), i.epic || ""
  ].join(","));
  return [header, ...rows].join("\n");
}
