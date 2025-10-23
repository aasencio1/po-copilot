import { PBI } from "@core/types";
export const toGitHubIssuesJSON = (items: PBI[]) =>
  items.map(i => ({
    title: i.summary,
    body: `${i.description}\n\n**Acceptance**\n${i.acceptanceCriteria}\n`,
    labels: i.labels
  }));
