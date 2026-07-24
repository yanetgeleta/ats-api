import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { FindApplicantsDto } from './dto/find-applicants.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateNotesDto } from './dto/update-notes.dto';
import { ApplicationStatus, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const activeFilter = { deletedAt: null };
@Injectable()
export class ApplicantsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll(query: FindApplicantsDto): Promise<PaginatedResult<any>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const search = query?.search;
    const status = query?.status;
    const track = query?.track;
    const sortBy = query?.sortBy ?? 'createdAt';
    const sortOrder = query?.sortOrder ?? 'desc';

    const take = limit;
    const skip = (page - 1) * limit;

    const where: Prisma.ApplicantWhereInput = {
      ...activeFilter,
    };

    const andConditions: Prisma.ApplicantWhereInput[] = [];

    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (status) {
      andConditions.push({ status });
    }

    if (track) {
      andConditions.push({ track });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const [total, data] = await Promise.all([
      this.prisma.applicant.count({ where }),
      this.prisma.applicant.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 0;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
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

  INVALID_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
    [ApplicationStatus.REJECTED]: [
      ApplicationStatus.ACCEPTED,
      ApplicationStatus.SHORTLISTED,
    ],
    [ApplicationStatus.ACCEPTED]: [ApplicationStatus.PENDING],
    [ApplicationStatus.PENDING]: [],
    [ApplicationStatus.SHORTLISTED]: [],
  };

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    // find the applicant with the id, check if the status transition we are asking for is forbidden
    // if not, update the database with the new status
    const applicant = await this.findOne(id);

    const currentStatus = applicant.status;

    const forbiddenTargets = this.INVALID_TRANSITIONS[currentStatus] || [];
    if (forbiddenTargets.includes(updateStatusDto.status)) {
      throw new BadRequestException(
        `Invalid status transition: Cannot change applicant status from ${currentStatus} to ${updateStatusDto.status}.`,
      );
    }

    return this.prisma.applicant.update({
      where: { id },
      data: { status: updateStatusDto.status },
    });
  }

  async updateNotes(id: string, updateNotesDto: UpdateNotesDto) {
    await this.findOne(id);

    return this.prisma.applicant.update({
      where: { id },
      data: { notes: updateNotesDto.notes ?? null },
    });
  }
}
