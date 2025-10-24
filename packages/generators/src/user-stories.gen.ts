import { Artifact, Generator, RuleContext } from '@po-copilot/core';

export const UserStoriesGenerator: Generator = {
  id: 'gen/user-stories',
  supports(ctx: RuleContext) {
    // ejemplo muy simple: generar si hay persona y al menos 1 note
    return Boolean(ctx.persona && ctx.notes?.length);
  },
  generate(ctx: RuleContext): Artifact[] {
    const personas = ctx.persona;
    const stories: Artifact[] = ctx.notes.map((n, idx) => ({
      kind: 'user_story',
      title: `US-${idx + 1}: ${ctx.productName ?? 'Product'} - ${personas}`,
      body: `Como ${personas}, quiero ${inferAction(n.text)} para ${inferBenefit(n.text)}.`,
      meta: { note_id: n.id, domain: ctx.domain, language: n.language },
    }));
    return stories;
  },
};

// Helpers bobos para demo
function inferAction(text: string) {
  // heurística naïve
  if (/login|auth|signin/i.test(text)) return 'autenticarme de forma segura';
  if (/onboard/i.test(text)) return 'completar el onboarding';
  return 'cumplir mi objetivo';
}
function inferBenefit(text: string) {
  if (/security|secure|compliance/i.test(text)) return 'cumplir compliance y seguridad';
  return 'ahorrar tiempo';
}
