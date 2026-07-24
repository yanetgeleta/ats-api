import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApplicationStatus, InternshipTrack } from 'src/generated/prisma/enums';

const allowedSortFields = ['name', 'email', 'createdAt', 'status'];
export class FindApplicantsDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Page number must be 1 or greater.' })
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Limit must be 1 or greater.' })
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'Gelete',
    description: 'Search term against name or email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsOptional()
  @IsEnum(ApplicationStatus, { message: 'Invalid application status.' })
  status?: ApplicationStatus;

  @ApiPropertyOptional({ enum: InternshipTrack })
  @IsOptional()
  @IsEnum(InternshipTrack, { message: 'Invalid internship track.' })
  track?: InternshipTrack;

  @ApiPropertyOptional({ enum: allowedSortFields, default: 'createdAt' })
  @IsOptional()
  @IsString()
  @IsIn(allowedSortFields, {
    message: `Can only sort by valid database fields: ${allowedSortFields.join(', ')}`,
  })
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'Sort order must be asc or desc.' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
