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
  @IsString()
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @IsEmail()
  email: string;

  // phone number is an optional field
  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(InternshipTrack, {
    message: 'Track must be a valid internship track!',
  })
  track: InternshipTrack;
}
