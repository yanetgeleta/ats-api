import { Module } from '@nestjs/common';
import { ResumeParserService } from './resume-parser.service';
import { ResumeParserController } from './resume-parser.controller';

@Module({
  providers: [ResumeParserService],
  controllers: [ResumeParserController],
  exports: [ResumeParserService],
})
export class ResumeParserModule {}
