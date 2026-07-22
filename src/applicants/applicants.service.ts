import { Injectable } from '@nestjs/common';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApplicantsService {
  constructor(private readonly prisma: PrismaService) {}

  async getApplicantsTest() {
    return this.prisma.applicant.findMany();
  }

  create(createApplicantDto: CreateApplicantDto) {
    return 'This action adds a new applicant';
  }

  findAll() {
    return `This action returns all applicants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} applicant`;
  }

  update(id: number, updateApplicantDto: UpdateApplicantDto) {
    return `This action updates a #${id} applicant`;
  }

  remove(id: number) {
    return `This action removes a #${id} applicant`;
  }
}
