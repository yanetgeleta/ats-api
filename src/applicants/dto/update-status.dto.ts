import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApplicationStatus } from 'src/generated/prisma/enums';

// checks if status is valid acording to the application status
export class UpdateStatusDto {
  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.SHORTLISTED,
  })
  @IsEnum(ApplicationStatus, { message: 'Invalid status value.' })
  @IsNotEmpty({ message: 'Status must be provided.' })
  status: ApplicationStatus;
}
