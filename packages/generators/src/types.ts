import type { RuleContext, RawNote } from "@po-copilot/core";
import type { PriorityTag, KanoTag } from "@po-copilot/core";

export type GenerationContext = RuleContext & {
  description?: string;
  epic?: string;
};

export interface UserStory {
  id: string;
  epic: string;
  summary: string;
  description: string;
  acceptanceCriteria: string;   // Opción B: texto plano (no array)
  priority: PriorityTag;
  kano: KanoTag;
  wsjf: number;
  labels: string[];
  domain?: string;
  trace: {
    sources: string[];
    stakeholders: string[];
    decisions: string[];
  };
}

export type { RawNote };
