import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NoteDto {
  @IsString() id: string;
  @IsString() speaker: 'user' | 'po' | 'client';
  @IsString() language: 'en' | 'es';
  @IsString() text: string;
}

export class GenerateRequestDto {
  // --- Día 3 ---
  @IsOptional() @IsString() productName?: string;
  @IsOptional() @IsString() domain?: string;
  @IsOptional() @IsString() persona?: string;

  // --- Día 2 ---
  @IsOptional() @IsString() language?: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() project?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NoteDto)
  notes: NoteDto[];
}
