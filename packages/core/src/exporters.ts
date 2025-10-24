// packages/core/src/exporters.ts
import type { Artifact } from "./generators";
import type { RuleContext } from "./rules";

export type ExportFormat = "markdown" | "jira_csv" | "github_issues" | string;

export interface Exporter {
  id: string;               // ej: "exp/markdown"
  format: ExportFormat;     // ej: "markdown"
  export(artifacts: Artifact[], ctx: RuleContext): string;
}
