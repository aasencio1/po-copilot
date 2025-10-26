import type { Generator, RuleContext } from '@po-copilot/core';

type Note = NonNullable<RuleContext['notes']>[number];

export const UserStoriesGenerator: Generator = {
  id: 'gen/user-stories',
  supports(ctx: RuleContext) {
    return Boolean(ctx.persona && ctx.notes?.length);
  },
  generate(ctx: RuleContext) {
    const persona = ctx.persona ?? 'user';
    const notes = (ctx.notes ?? []) as NonNullable<RuleContext['notes']>;
    const stories = notes.map((n: Note, idx: number) => ({
      kind: 'user-story',
      title: `US-${idx + 1}: ${ctx.productName ?? 'Product'} - ${persona}`,
      body: `Como ${persona}, quiero ${inferAction(n.text)} para ${inferBenefit(n.text)}.`,
      sources: notes.map((nn: Note) => nn.id),
      meta: { note_id: n.id, domain: ctx.domain, language: n.language },
    }));
    return stories;
  },
};

function inferAction(text: string) {
  if (/login|auth|signin/i.test(text)) return 'autenticarme de forma segura';
  if (/onboard/i.test(text)) return 'completar el onboarding';
  return 'cumplir mi objetivo';
}
function inferBenefit(text: string) {
  if (/security|secure|compliance/i.test(text)) return 'cumplir compliance y seguridad';
  return 'ahorrar tiempo';
}
