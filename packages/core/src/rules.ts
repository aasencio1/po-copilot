// packages/core/src/rules.ts

import type { RawNote, Domain, PriorityTag, KanoTag } from "./types";

/**
 * Contexto que se pasa entre reglas de validación o inferencia.
 * Contiene la información básica del producto o conversación analizada.
 */
export interface RuleContext {
  productName?: string;
  domain?: Domain;
  persona?: string;
  notes?: ReadonlyArray<RawNote>;
  tokens?: string[];
  warnings?: string[];

  // posibles salidas enriquecidas por reglas
  priority?: PriorityTag;
  kano?: KanoTag;
}

/**
 * Contrato estándar de cualquier regla
 */
export interface Rule {
  id: string;
  description: string;
  apply(ctx: RuleContext): RuleContext;
}
