import { Module } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResumeParserModule } from 'src/resume-parser/resume-parser.module';

@Module({
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
  imports: [PrismaModule, ResumeParserModule],
})
export class ApplicantsModule {}
