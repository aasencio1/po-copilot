// src/generate/generate.service.ts
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GenerateRequestDto } from './dto/generate-request.dto';

type Canonical = {
  product_name: string;
  domain: string;
  persona: string;
  notes: { id: string; speaker: string; language: string; text: string }[];
};

function normalize(dto: GenerateRequestDto): Canonical {
  // ✅ Día 3 solamente: NO uses project/industry/language
  return {
    product_name: dto.productName,
    domain: dto.domain,
    persona: dto.persona,
    notes: dto.notes,
  };
}

@Injectable()
export class GenerateService {
  private readonly logger = new Logger(GenerateService.name);
  private readonly baseURL =
    process.env.NLU_URL ?? 'http://127.0.0.1:8001';

  constructor(private readonly http: HttpService) {}

  async generate(dto: GenerateRequestDto) {
    const payload = normalize(dto);
    const url = `${this.baseURL}/generate`;
    this.logger.debug({ outgoingPayload: payload, url });

    try {
      const { data } = await firstValueFrom(
        this.http.post(url, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }),
      );
      return data;
    } catch (err: any) {
      const status = err?.response?.status ?? HttpStatus.BAD_GATEWAY;
      const details = err?.response?.data ?? err?.message ?? 'Unknown error';
      this.logger.error('FastAPI call failed', details);
      throw new HttpException({ message: 'FastAPI call failed', details }, status);
    }
  }
}
