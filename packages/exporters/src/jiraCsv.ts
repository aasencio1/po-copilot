import { PBI } from "@core/types";
import type { AcceptanceCriteria } from "@po-copilot/core";

// Escapa caracteres problemáticos para CSV
const esc = (s: string) => {
  const needs = /[",\n]/.test(s);
  const e = s.replace(/"/g, '""');
  return needs ? `"${e}"` : e;
};

// ✅ Maneja correctamente string o readonly string[]
const acToString = (ac: AcceptanceCriteria): string => {
  if (Array.isArray(ac)) {
    return ac.map(s => s.trim()).join(" | ");
  }
  if (typeof ac === "string") {
    return ac.trim();
  }
  return "";
};

export function toJiraCSV(items: PBI[]): string {
  const header = [
    "Summary",
    "Issue Type",
    "Description",
    "Priority",
    "Labels",
    "Acceptance Criteria",
    "Epic Link"
  ].join(",");

  const rows = items.map(i => [
    esc(i.summary),
    "Story",
    esc(i.description),
    i.priority,
    esc(i.labels.join(" ")),
    esc(acToString(i.acceptanceCriteria)),
    i.epic || ""
  ].join(","));

  return [header, ...rows].join("\n");
}
