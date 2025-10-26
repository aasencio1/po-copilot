import { Body, Controller, Post } from '@nestjs/common';
import type { RuleContext } from '@po-copilot/core';
import { GenerateService } from './generate.service';

@Controller('generate')
export class GenerateController {
  constructor(private readonly svc: GenerateService) {}

  @Post()
  run(@Body() ctx: RuleContext) {
    const md = this.svc.generate(ctx);
    return { format: 'markdown', content: md };
  }
}
