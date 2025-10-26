import type { Exporter, RuleContext } from '@po-copilot/core';

type ExportArtifacts = Parameters<Exporter['export']>[0];

export const MarkdownExporter: Exporter = {
  id: 'exp/markdown',
  format: 'markdown',
  export(artifacts: ExportArtifacts, ctx: RuleContext): string {
    const header = `# Backlog - ${ctx.productName ?? 'Product'} (${ctx.domain ?? 'General'})\n\n`;
    const warns = Array.isArray(ctx.warnings) && ctx.warnings.length
      ? `> Warnings:\n${ctx.warnings.map((w: unknown) => `- ${String(w)}`).join('\n')}\n\n`
      : '';
    const body = artifacts
      .map(a => `## ${a.title}\n- Kind: ${a.kind}\n\n${a.body ?? ''}\n`)
      .join('\n');
    return header + warns + body;
  },
};
