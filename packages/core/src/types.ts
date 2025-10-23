export type PriorityTag = "Must" | "Should" | "Could" | "Wont";
export type KanoTag = "Basic" | "Performance" | "Delighter" | "Indifferent" | "Questionable";
export type Domain = "UI" | "DATA" | "CHATBOT" | "API" | "DEVOPS";

export interface RawNote {
  id: string;
  speaker: "client" | "po" | "user" | "dev";
  language: "es" | "en";
  text: string;
  timestamp?: string;
}
export interface Stakeholder {
  id: string; name: string; role: string;
  power: "High"|"Medium"|"Low"; interest: "High"|"Medium"|"Low";
  expectations: string[]; channel: string; cadence: string;
}
export interface SWOT { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[]; }

export interface PBI {
  id: string; epic?: string; summary: string; description: string; acceptanceCriteria: string;
  priority: PriorityTag; kano?: KanoTag; wsjf?: number; labels: string[]; domain: Domain;
  trace: { sources: string[]; stakeholders: string[]; decisions: string[] };
}

export interface GenerateRequest {
  language: "es" | "en";
  industry: string; project: string; notes: RawNote[];
  documents?: { id: string; title: string; summary?: string }[];
  targetTool?: "Jira" | "GitHub" | "GitLab" | "ClickUp" | "Monday";
}
export interface NluResponse {
  domains: Domain[];
  stakeholders: Stakeholder[];
  swot: SWOT;
  entities: { slo?: Array<{ type: string; value_ms?: number; value?: string }>; compliance?: string[]; musts?: string[]; };
  signals: { kano_basic?: string[]; moscow_must?: string[]; };
}
export interface UserStory {
  id: string;
  epic?: string;
  summary: string;
  description: string;
  acceptanceCriteria: string;
  priority: string;
  kano?: string;
  wsjf?: number;
  labels: string[];
  domain: string;
  trace: {
    sources: string[];
    stakeholders: string[];
    decisions: string[];
  };
}
export interface GenerationContext {
  productName: string;
  domain: string;
  epic?: string;
  description?: string;
  notes?: Array<{ id: string; text: string }>;
}