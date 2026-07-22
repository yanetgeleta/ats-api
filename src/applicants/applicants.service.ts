import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

const activeFilter = { deletedAt: null };
@Injectable()
export class ApplicantsService {
  constructor(private readonly prisma: PrismaService) {}

  // this is just for test
  async getApplicantsTest() {
    return this.prisma.applicant.findMany();
  }

  async create(createApplicantDto: CreateApplicantDto) {
    try {
      return await this.prisma.applicant.create({ data: createApplicantDto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Applicant with this email already exists!',
          );
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.applicant.findMany({ where: activeFilter });
  }

  async findOne(id: string) {
    const applicant = await this.prisma.applicant.findFirst({
      where: { id, ...activeFilter },
    });
    if (!applicant) {
      throw new NotFoundException(`Applicant with id ${id} is not found`);
    }
    return applicant;
  }

  async update(id: string, updateApplicantDto: UpdateApplicantDto) {
    await this.findOne(id);

    return this.prisma.applicant.update({
      where: { id },
      data: updateApplicantDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.applicant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
