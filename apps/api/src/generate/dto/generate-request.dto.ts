// src/generate/dto/generate-request.dto.ts
import { IsArray, IsIn, IsNotEmpty, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class NoteDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsIn(['client', 'po', 'user', 'dev'])
  speaker: string;

  @IsIn(['es', 'en'])
  language: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class GenerateRequestDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsString()
  @IsNotEmpty()
  persona: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => NoteDto)
  notes: NoteDto[];
}
