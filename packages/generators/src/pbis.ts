import { randomUUID } from "node:crypto";
import type { GenerationContext, UserStory, RawNote } from "./types.js";
import { inferMoSCoWPriority, inferKano } from "@po-copilot/rules";

/**
 * Genera un Product Backlog Item (PBI) con prioridad MoSCoW y señal Kano.
 * Esta versión tokeniza el texto y permite inferir las señales.
 */
export function generatePBI(ctx: GenerationContext): UserStory {
  // Texto base (producto, dominio o notas)
  const baseText =
    ctx?.description ||
    ctx?.notes?.map((n: RawNote) => n.text).join(" ") ||
    `${ctx.productName} ${ctx.domain}`;

  // Tokenizamos para usar los inferidores de reglas
  const tokens = baseText.toLowerCase().split(/\W+/).filter(Boolean);

  // Aplicamos inferencias de prioridad y tipo Kano
  const priority = inferMoSCoWPriority(tokens);
  const kano = inferKano(tokens);

  return {
    id: randomUUID(),
    epic: ctx?.epic ?? "General",
    summary: `[${ctx.productName}] ${ctx.domain ?? "General"} feature`,
    description: ctx?.description ?? "Generated PBI description.",
    acceptanceCriteria: [
      "Given valid input data, when the user triggers the main action, then the system performs the expected behavior successfully.",
      "Given an invalid input, when the user triggers the action, then the system provides an appropriate error message."
    ].join("\n"),
    priority,
    kano,
    wsjf: Math.floor(Math.random() * 100), // valor WSJF simulado
    labels: [ctx.domain ?? "General", priority, kano],
    domain: ctx.domain ?? "General",   // 👈 AQUÍ está el cambio clave
    trace: {
      sources: ctx?.notes?.map((n: RawNote) => n.id) ?? [],
      stakeholders: [],
      decisions: []
    }
  };
}
