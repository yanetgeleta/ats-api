import { Module } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
  imports: [PrismaModule],
})
export class ApplicantsModule {}
