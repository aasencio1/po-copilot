// packages/core/src/generators.ts

import type { RuleContext } from "./types.js";


/**
 * Representa un artefacto generado por cualquier generator.
 * Puede ser una User Story, un PBI, un Outcome, etc.
 */
export interface Artifact {
  kind: string; // Ej: "user_story", "pbi", "outcome"
  title: string;
  body?: string;
  meta?: Record<string, unknown>; // Información extra opcional
}

/**
 * Contrato que deben cumplir todos los generadores (PBIs, User Stories, Outcomes, etc.)
 */
export  interface Generator {
  id: string;

  /**
   * Indica si este generador aplica al contexto actual.
   * Ejemplo: el generator de user stories solo aplica si hay persona y notes.
   */
  supports(ctx: RuleContext): boolean;

  /**
   * Genera una lista de artefactos (user stories, outcomes, etc.)
   */
  generate(ctx: RuleContext): Artifact[];
}
