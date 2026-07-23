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
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Page number must be 1 or greater.' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Limit must be 1 or greater.' })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ApplicationStatus, { message: 'Invalid application status.' })
  status?: ApplicationStatus;

  @IsOptional()
  @IsEnum(InternshipTrack, { message: 'Invalid internship track.' })
  track?: InternshipTrack;

  @IsOptional()
  @IsString()
  @IsIn(allowedSortFields, {
    message: `Can only sort by valid database fields: ${allowedSortFields.join(', ')}`,
  })
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'Sort order must be asc or desc.' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
