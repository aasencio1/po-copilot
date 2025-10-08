import { Body, Controller, Post } from '@nestjs/common';
import axios from 'axios';

type Domain = 'UI'|'DATA'|'CHATBOT'|'API'|'DEVOPS';
type PriorityTag = 'Must'|'Should'|'Could'|'Wont';
type KanoTag = 'Basic'|'Performance'|'Delighter'|'Indifferent'|'Questionable';

interface RawNote {
  id: string;
  speaker: 'client'|'po'|'user'|'dev';
  language: 'es'|'en';
  text: string;
  timestamp?: string;
}
interface GenerateRequest {
  language: 'es'|'en';
  industry: string;
  project: string;
  notes: RawNote[];
  documents?: { id: string; title: string; summary?: string }[];
  targetTool?: 'Jira'|'GitHub'|'GitLab'|'ClickUp'|'Monday';
}
interface NluResponse {
  domains: Domain[];
  stakeholders: any[];
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[]; };
  entities: {
    slo?: Array<{ type: string; value_ms?: number; value?: string }>;
    compliance?: string[];
    musts?: string[];
  };
  signals: { kano_basic?: string[]; moscow_must?: string[]; };
}
interface PBI {
  id: string;
  epic?: string;
  summary: string;
  description: string;
  acceptanceCriteria: string;
  priority: PriorityTag;
  kano?: KanoTag;
  labels: string[];
  domain: Domain;
  trace: { sources: string[]; stakeholders: string[]; decisions: string[] };
}

const NLU_URL = process.env.NLU_URL || 'http://localhost:8000/analyze';

function inferMoSCoWPriority(text: string): PriorityTag {
  const t = text.toLowerCase();
  if (/(debe|obligatorio|regulatorio|seguro|latencia|must)/.test(t)) return 'Must';
  if (/(debería|should)/.test(t)) return 'Should';
  return 'Could';
}
function inferKano(text: string): KanoTag {
  const t = text.toLowerCase();
  if (/(inaceptable si falta|lo básico|básico|debe|must|seguro|latencia)/.test(t)) return 'Basic';
  if (/(rápido|performance|filtros|drag|orden)/.test(t)) return 'Performance';
  return 'Delighter';
}
function buildStory(user: string, need: string, benefit: string) {
  return `Como ${user} quiero ${need} para ${benefit}`;
}
function buildGherkin(given: string, when: string, then: string) {
  return `Dado ${given}\nCuando ${when}\nEntonces ${then}`;
}
function toJiraCSV(items: PBI[]): string {
  const header = ['Summary','Issue Type','Description','Priority','Labels','Acceptance Criteria','Epic Link'].join(',');
  const rows = items.map(i => [
    esc(i.summary), 'Story', esc(i.description), i.priority, esc(i.labels.join(' ')),
    esc(i.acceptanceCriteria), i.epic || ''
  ].join(','));
  return [header, ...rows].join('\n');
  function esc(s: string){ const needs = /[",\n]/.test(s); const e=s.replace(/"/g,'""'); return needs?`"${e}"`:e; }
}
function toGitHubIssues(items: PBI[]) {
  return items.map(i => ({ title: i.summary, body: `${i.description}\n\n**Acceptance**\n${i.acceptanceCriteria}\n`, labels: i.labels }));
}

@Controller()
export class GenerateController {
  @Post('generate')
  async generate(@Body() req: GenerateRequest) {
    const { data } = await axios.post<NluResponse>(NLU_URL, {
      language: req.language,
      industry: req.industry,
      project: req.project,
      notes: req.notes,
      documents: req.documents || []
    });

    const pool = [
      ...(data.entities.musts || []),
      ...(data.signals.kano_basic || []),
      'Historia mínima para demo'
    ];
    const domain: Domain = data.domains?.[0] || 'API';

    let seq = 1;
    const pbis: PBI[] = pool.map(text => {
      const id = `PBI-${String(seq++).padStart(3,'0')}`;
      const priority = inferMoSCoWPriority(text);
      const kano = inferKano(text);
      const summary = (text.trim() || 'Historia generada').slice(0, 80);
      return {
        id,
        epic: domain === 'API' ? 'EP-API' : domain === 'DATA' ? 'EP-DATA' : 'EP-Core',
        summary,
        description: buildStory('usuario', `cumplir ${summary}`, 'generar valor'),
        acceptanceCriteria: buildGherkin('contexto válido','ejecuto la funcionalidad','obtengo un resultado verificable'),
        priority,
        kano,
        labels: [domain.toLowerCase(), `kano-${kano.toLowerCase()}`, `moscow-${priority.toLowerCase()}`],
        domain,
        trace: { sources: ['nlu:signals'], stakeholders: [], decisions: [] }
      };
    });

    const productGoal = `Lograr un ${req.project} en ${req.industry} con valor medible en 6–9 meses.`;
    const sprintGoal  = 'Habilitar el flujo mínimo end-to-end con los Must iniciales para una primera demo.';

    return {
      productGoal,
      sprintGoal,
      domains: data.domains,
      stakeholders: data.stakeholders,
      swot: data.swot,
      pbis,
      export: {
        jiraCsv: toJiraCSV(pbis),
        githubIssues: toGitHubIssues(pbis)
      }
    };
  }
}
