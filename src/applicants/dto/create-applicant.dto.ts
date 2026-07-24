import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { InternshipTrack } from 'src/generated/prisma/enums';
// import { InternshipTrack } from '../enums/track.enum';

export class CreateApplicantDto {
  @ApiProperty({ example: 'Gelete Burka', description: 'Full name' })
  @IsString()
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @ApiProperty({
    example: 'gelete@gmail.com',
    description: 'Unique email address',
  })
  @IsEmail()
  email: string;

  // phone number is an optional field
  @ApiPropertyOptional({
    example: '+251911234567',
    description: 'Contact phone number',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    enum: InternshipTrack,
    example: InternshipTrack.MOBILE_DEVELOPMENT,
    description: 'Offered internship track',
  })
  @IsEnum(InternshipTrack, {
    message: 'Track must be a valid internship track!',
  })
  track: InternshipTrack;
}
