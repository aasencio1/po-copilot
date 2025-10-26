import type { KanoTag } from "@po-copilot/core";

/** Heurística básica para modelo de Kano según palabras clave */
export function inferKano(tokens: string[]): KanoTag {
  const txt = (tokens || []).join(" ").toLowerCase();
  if (/compliance|seguridad|login|basic|obligatorio|esperado/.test(txt)) return "Basic";
  if (/rendim|tiempo|latenc|conversi|eficiencia|mejora/.test(txt)) return "Performance";
  if (/wow|delight|sorpresa|magia|encanta|innov/.test(txt)) return "Delighter";
  if (/dudoso|irrelevante|indiferente/.test(txt)) return "Indifferent";
  return "Questionable";
}
