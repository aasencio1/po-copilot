import type { Rule, RuleContext } from '@po-copilot/core';

export const MinNotesRule: Rule = {
  id: 'rules/min-notes',
  description: 'Debe existir al menos 1 nota',
  apply(ctx: RuleContext): RuleContext {
    const warnings = ctx.warnings ?? [];
    if (!ctx.notes || ctx.notes.length < 1) {
      warnings.push('notes must contain at least 1 element');
    }
    return { ...ctx, warnings };
  },
};

export const PersonaPresentRule: Rule = {
  id: 'rules/persona-present',
  description: 'Persona no debe ser vacío',
  apply(ctx: RuleContext): RuleContext {
    const warnings = ctx.warnings ?? [];
    if (!ctx.persona || !ctx.persona.trim()) {
      warnings.push('persona is empty');
    }
    return { ...ctx, warnings };
  },
};
