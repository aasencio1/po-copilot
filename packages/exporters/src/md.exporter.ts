import { Artifact, Exporter, RuleContext } from '@po-copilot/core';

export const MarkdownExporter: Exporter = {
  id: 'exp/markdown',
  format: 'markdown',
  export(artifacts: Artifact[], ctx: RuleContext): string {
    const header = `# Backlog - ${ctx.productName ?? 'Product'} (${ctx.domain})\n\n`;
    const warns = ctx.warnings?.length ? `> Warnings:\n${ctx.warnings.map(w => `- ${w}`).join('\n')}\n\n` : '';
    const body = artifacts.map(a => `## ${a.title}\n- Kind: ${a.kind}\n\n${a.body}\n`).join('\n');
    return header + warns + body;
  },
};
