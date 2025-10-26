import type { PriorityTag } from "@po-copilot/core";

/** Muy simple: detecta MUST/SHOULD/COULD/WONT por palabras clave */
export function inferMoSCoWPriority(tokens: string[]): PriorityTag {
  const hay = (p: string) => tokens?.some(t => t.toLowerCase().includes(p));
  if (hay("must") || hay("oblig") || hay("requerido")) return "Must";
  if (hay("should") || hay("debería")) return "Should";
  if (hay("could") || hay("podría")) return "Could";
  if (hay("won't") || hay("no se hará") || hay("no entra")) return "Wont";
  return "Should"; // default conservador
}
