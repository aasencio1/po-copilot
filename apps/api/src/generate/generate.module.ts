// generate/generate.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
    }),
  ],
  controllers: [GenerateController],
  providers: [GenerateService],
  exports: [GenerateService], // si otros módulos lo usan
})
export class GenerateModule {}
