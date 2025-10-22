import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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
  // Si llega formato día 3, úsalo
  if (dto.productName || dto.domain || dto.persona) {
    return {
      product_name: dto.productName ?? '',
      domain: dto.domain ?? '',
      persona: dto.persona ?? '',
      notes: dto.notes ?? [],
    };
  }
  // Compatibilidad con día 2
  return {
    product_name: dto.project ?? '',
    domain: dto.industry ?? '',
    // Ajusta esta derivación si tienes una regla distinta
    persona: dto.language ? (dto.language === 'es' ? 'po' : 'user') : 'po',
    notes: dto.notes ?? [],
  };
}

@Injectable()
export class GenerateService {
  private readonly logger = new Logger(GenerateService.name);
  private readonly url = 'http://localhost:8001/generate'; // asegúrate de 8001

  constructor(private readonly http: HttpService) {}

  async generate(dto: GenerateRequestDto) {
    const payload = normalize(dto);
    this.logger.debug({ outgoingPayload: payload });

    try {
      const { data } = await firstValueFrom(
        this.http.post(this.url, payload, {
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
