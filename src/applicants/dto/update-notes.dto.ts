import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateNotesDto {
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed a thousand characters.' })
  @IsOptional()
  notes?: string;
}
