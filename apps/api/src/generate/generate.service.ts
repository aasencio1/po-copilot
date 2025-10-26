// apps/api/src/generate/generate.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Rule, RuleContext, Exporter, Generator as GenType } from '@po-copilot/core';
import { RULES, GENERATORS, EXPORTER } from './generate.providers';

@Injectable()
export class GenerateService {
  private readonly logger = new Logger(GenerateService.name);

  constructor(
    @Inject(RULES) private readonly rules: Rule[],
    @Inject(GENERATORS) private readonly generators: GenType[],
    @Inject(EXPORTER) private readonly exporter: Exporter,
  ) {}

  generate(ctx: RuleContext): string {
    this.logger.debug('Generating artifacts with in-process pipeline');

    // (Opcional) aplicar reglas si ya las implementas:
    // for (const rule of this.rules) rule.apply?.(ctx);

    // Seleccionar generator compatible (o el primero por defecto)
    const gen =
      this.generators.find(g => (typeof g.supports === 'function' ? g.supports(ctx) : true)) ??
      this.generators[0];

    if (!gen) {
      throw new Error('No generators registered');
    }

    // Algunos generators devuelven Artifact[] directamente; otros podrían devolver un objeto.
    const raw = gen.generate(ctx as any) as unknown;
    const artifacts =
      Array.isArray(raw)
        ? raw
        : (raw as any)?.artifacts ?? []; // tolerante si en el futuro retornas { artifacts, context }

    // Exportar a Markdown (o lo que sea que exponga tu exporter activo)
    const md = this.exporter.export(artifacts as any, ctx);
    return md;
  }
}
