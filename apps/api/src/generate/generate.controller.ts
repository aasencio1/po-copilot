import { Body, Controller, Post } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerateRequestDto } from './dto/generate-request.dto';

@Controller()
export class GenerateController {
  constructor(private readonly service: GenerateService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateRequestDto) {
    // El controller NO toca el microservicio: delega al service
    return this.service.generate(dto);
  }
}
