// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerateModule } from './generate/generate.module';

@Module({
  imports: [GenerateModule],          // ✅ solo importas el módulo de feature
  controllers: [AppController],       // ❌ quita GenerateController
  providers: [AppService],            // ❌ quita GenerateService
})
export class AppModule {}
