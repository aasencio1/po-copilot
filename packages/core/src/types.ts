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

/** ===== Helpers opcionales ===== */

/** Normaliza AC a array para pipelines que lo requieran como bullets */
export function normalizeAC(ac: AcceptanceCriteria): ReadonlyArray<string> {
  if (Array.isArray(ac)) return ac;
  // Divide por líneas o por "- " como bullets simples; ajusta a tu formato
  const lines = ac.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  return lines.length ? lines : [ac];
}
