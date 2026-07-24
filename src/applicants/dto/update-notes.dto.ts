import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateNotesDto {
  @ApiPropertyOptional({
    example: 'Selected for immediate interview.',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed a thousand characters.' })
  @IsOptional()
  notes?: string;
}
