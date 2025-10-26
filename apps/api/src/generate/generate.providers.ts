// apps/api/src/generate/generate.providers.ts

// Usa import type para no emitir require() en el JS resultante
import type { Provider } from '@nestjs/common';
import type { Rule, Generator as Gen, Exporter as Exp } from '@po-copilot/core';

// Tokens DI
export const RULES = Symbol('RULES');
export const GENERATORS = Symbol('GENERATORS');
export const EXPORTER = Symbol('EXPORTER');

// Providers con useFactory async para poder usar import() dinámico desde CJS
export const generateProviders: Provider[] = [
  {
    provide: RULES,
    useFactory: async (): Promise<Rule[]> => {
      // Si todavía no tienes reglas o el paquete no exporta las clases, devuelve []
      try {
        const rulesMod = await import('@po-copilot/rules');
        // Si en el futuro exportas reglas concretas, ajústalas aquí:
        // const { MinNotesRule, PersonaPresentRule } = rulesMod;
        // return [MinNotesRule, PersonaPresentRule] as Rule[];
        return [];
      } catch {
        // Paquete ausente o ESM no disponible: continúa sin reglas
        return [];
      }
    },
  },
  {
    provide: GENERATORS,
    useFactory: async (): Promise<Gen[]> => {
      const gens = await import('@po-copilot/generators');
      // Asegúrate de que @po-copilot/generators exporta UserStoriesGenerator (named export)
      return [gens.UserStoriesGenerator] as Gen[];
    },
  },
  {
    provide: EXPORTER,
    useFactory: async (): Promise<Exp> => {
      const exp = await import('@po-copilot/exporters');
      // Asegúrate de que @po-copilot/exporters exporta MarkdownExporter (named export)
      return exp.MarkdownExporter as Exp;
    },
  },
];
