import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { generateProviders } from './generate.providers';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10_000,
    }),
  ],
  controllers: [GenerateController],
  // 👇 ¡Ojo al spread!
  providers: [...generateProviders, GenerateService],
  exports:   [...generateProviders, GenerateService],
})
export class GenerateModule {}
