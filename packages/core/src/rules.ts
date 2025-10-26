// packages/core/src/rules.ts

import type { RuleContext } from "./types.js";

/**
 * Contrato base de cualquier regla.
 * Cada regla debe implementar un `id`, `description` y un método `apply`
 * que recibe y devuelve un contexto `RuleContext`.
 */
export interface Rule {
  id: string;
  description: string;
  apply(ctx: RuleContext): RuleContext;
}

/**
 * Aquí podrías exportar implementaciones concretas de reglas,
 * por ejemplo:
 *
 * export class MinNotesRule implements Rule {
 *   id = 'rule/min-notes';
 *   description = 'Debe haber al menos una nota de usuario o PO.';
 *
 *   apply(ctx: RuleContext): RuleContext {
 *     if (!ctx.notes?.length) {
 *       ctx.warnings = [...(ctx.warnings || []), 'No se detectaron notas.'];
 *     }
 *     return ctx;
 *   }
 * }
 */
