import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicantDto } from './create-applicant.dto';

export class UpdateApplicantDto extends PartialType(CreateApplicantDto) {}
