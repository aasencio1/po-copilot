// packages/core/src/types.ts

/** ===== Unions base ===== */
export type PriorityTag = "Must" | "Should" | "Could" | "Wont";
export type KanoTag = "Basic" | "Performance" | "Delighter" | "Indifferent" | "Questionable";
export type Domain = "UI" | "DATA" | "CHATBOT" | "API" | "DEVOPS";

export type Language = "es" | "en";
export type Speaker = "client" | "po" | "user" | "dev";
export type IsoDateTime = string;

/** Útil cuando AC puede ser texto markdown o lista de bullets */
export type AcceptanceCriteria = string | ReadonlyArray<string>;

/** ===== Contratos de entrada cruda / conocimiento ===== */
export interface RawNote {
  id: string;
  speaker: Speaker;
  language: Language;
  text: string;
  timestamp?: IsoDateTime;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string; // si quieres, cambia a union más estricta
  power: "High" | "Medium" | "Low";
  interest: "High" | "Medium" | "Low";
  expectations: ReadonlyArray<string>;
  channel: string;
  cadence: string;
}

/** Mantengo tu nombre original (SWOT). Si prefieres PascalCase, crea un alias: */
export interface SWOT {
  strengths: ReadonlyArray<string>;
  weaknesses: ReadonlyArray<string>;
  opportunities: ReadonlyArray<string>;
  threats: ReadonlyArray<string>;
}
export type Swot = SWOT;

/** ===== Artefactos / PBI / Historia ===== */
export interface PBI {
  id: string;
  epic?: string;
  summary: string;
  description: string;
  acceptanceCriteria: AcceptanceCriteria; // <- antes: string
  priority: PriorityTag;
  kano?: KanoTag;
  wsjf?: number;
  labels: ReadonlyArray<string>;
  domain: Domain;
  trace: {
    sources: ReadonlyArray<string>;
    stakeholders: ReadonlyArray<string>;
    decisions: ReadonlyArray<string>;
  };
}

export interface UserStory {
  id: string;
  epic?: string;
  summary: string;
  description: string;
  acceptanceCriteria: AcceptanceCriteria; // <- antes: string
  priority: PriorityTag;                  // <- antes: string
  kano?: KanoTag;                         // <- antes: string
  wsjf?: number;
  labels: ReadonlyArray<string>;
  domain: Domain;                         // <- antes: string
  trace: {
    sources: ReadonlyArray<string>;
    stakeholders: ReadonlyArray<string>;
    decisions: ReadonlyArray<string>;
  };
}

/** ===== DTOs de requests/responses ===== */
export interface GenerateRequest {
  language: Language;
  industry: string;
  project: string;
  notes: ReadonlyArray<RawNote>;
  documents?: ReadonlyArray<{ id: string; title: string; summary?: string }>;
  targetTool?: "Jira" | "GitHub" | "GitLab" | "ClickUp" | "Monday";
}

export interface NluResponse {
  domains: ReadonlyArray<Domain>;
  stakeholders: ReadonlyArray<Stakeholder>;
  swot: SWOT;
  entities: {
    slo?: ReadonlyArray<{ type: string; value_ms?: number; value?: string }>;
    compliance?: ReadonlyArray<string>;
    musts?: ReadonlyArray<string>;
  };
  signals: {
    kano_basic?: ReadonlyArray<string>;
    moscow_must?: ReadonlyArray<string>;
  };
}

/** ===== Contexto de generación (tu firma original, con Domain) ===== */
export interface GenerationContext {
  productName: string;
  domain: Domain; // <- antes: string
  epic?: string;
  description?: string;
  notes?: ReadonlyArray<{ id: string; text: string }>;
}

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


/** ===== Helpers opcionales ===== */

/** Normaliza AC a array para pipelines que lo requieran como bullets */
export function normalizeAC(ac: AcceptanceCriteria): ReadonlyArray<string> {
  if (Array.isArray(ac)) return ac;
  // Divide por líneas o por "- " como bullets simples; ajusta a tu formato
 const lines = (
  typeof ac === 'string'
    ? ac.split(/\r?\n/).map(s => s.trim())
    : Array.from(ac).map(s => s.trim())
).filter(Boolean);

return lines.length
  ? lines
  : (typeof ac === 'string' && ac ? [ac] : []); // garantiza string[]

}
/** ===== Artifacts y contratos cross-package ===== */

// (opcional) etiqueta de tipo para discriminar
export type ArtifactKind = 'user_story' | 'pbi';

/** Un Artifact es una unión de tus artefactos existentes con una "tag" kind */
export type Artifact =
  | ({ kind: 'user_story' } & UserStory)
  | ({ kind: 'pbi' } & PBI);

/** Contexto que consumen reglas/generators/exporters */
/*export interface RuleContext extends GenerationContext {
  persona?: string;
  // notas enriquecidas (compatible hacia atrás con tu GenerationContext)
  notes?: ReadonlyArray<{ id: string; text: string; language?: Language }>;
}*/



/** Contratos base para el pipeline (útiles en generators/exporters/rules) */
export interface Generator {
  id: string;
  supports(ctx: RuleContext): boolean;
  generate(ctx: RuleContext): Artifact[];
}

export interface Exporter {
  export(artifacts: ReadonlyArray<Artifact>, ctx: RuleContext): string;
}

export interface RuleResult {
  ok: boolean;
  message?: string;
}

export interface Rule {
  id: string;
  run(ctx: RuleContext): RuleResult;
}
