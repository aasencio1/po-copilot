// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerateModule } from './generate/generate.module';

@Module({
  imports: [
    // ✅ Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // disponible en toda la app sin volver a importar
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env',
    }),

    // ✅ Módulo HTTP para llamadas externas (como FastAPI)
    HttpModule,

    // ✅ Módulo de tu funcionalidad principal
    GenerateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
