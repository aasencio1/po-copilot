// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerateModule } from './generate/generate.module';

@Module({
  imports: [GenerateModule],
})
export class AppModule {}
