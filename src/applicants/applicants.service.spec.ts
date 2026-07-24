import { ApplicantsService } from './applicants.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ApplicantsService (Unit)', () => {
  let service: ApplicantsService;
  let prisma: PrismaService;

  // Define a complete mocked structure of Prisma Service [1.1.4]
  const mockPrismaService = {
    applicant: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicantsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ApplicantsService>(ApplicantsService);
    // Cast it to allow clean spy/mock overrides
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create - Unique email', () => {
    it('should throw ConflictException on database P2002 unique key violation', async () => {
      const createDto = {
        name: 'Tsinukal',
        email: 'tsina@example.com',
        track: 'FRONTEND_DEVELOPMENT' as any,
      };

      // Instantiate a realistic Prisma error [1.1.5]
      const uniqueConstraintError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint violation',
        { code: 'P2002', clientVersion: '5.0.0' },
      );

      mockPrismaService.applicant.create.mockRejectedValue(
        uniqueConstraintError,
      );

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateStatus - Status state Guard', () => {
    it('should permit a valid status transition (PENDING -> SHORTLISTED)', async () => {
      const mockApplicant = {
        id: 'app_1',
        status: ApplicationStatus.PENDING,
        deletedAt: null,
      };
      mockPrismaService.applicant.findFirst.mockResolvedValue(mockApplicant);
      mockPrismaService.applicant.update.mockResolvedValue({
        ...mockApplicant,
        status: ApplicationStatus.SHORTLISTED,
      });

      const result = await service.updateStatus('app_1', {
        status: ApplicationStatus.SHORTLISTED,
      });
      expect(result.status).toBe(ApplicationStatus.SHORTLISTED);
      expect(mockPrismaService.applicant.update).toHaveBeenCalled();
    });

    it('should reject an invalid status transition (REJECTED -> ACCEPTED) with BadRequestException', async () => {
      const mockApplicant = {
        id: 'app_1',
        status: ApplicationStatus.REJECTED,
        deletedAt: null,
      };
      mockPrismaService.applicant.findFirst.mockResolvedValue(mockApplicant);

      await expect(
        service.updateStatus('app_1', { status: ApplicationStatus.ACCEPTED }),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.applicant.update).not.toHaveBeenCalled(); // Safe state-machine check
    });
  });

  describe('findOne - Exclude soft delete', () => {
    it('should successfully return active applicant if record exists and is not soft deleted', async () => {
      const mockApplicant = { id: 'app_1', deletedAt: null };
      mockPrismaService.applicant.findFirst.mockResolvedValue(mockApplicant);

      const result = await service.findOne('app_1');
      expect(result).toEqual(mockApplicant);
    });

    it('should throw NotFoundException if applicant is soft-deleted (Prisma returns null)', async () => {
      // If soft-deleted, findFirst filters on active filter and returns null [1.1.5]
      mockPrismaService.applicant.findFirst.mockResolvedValue(null);

      await expect(service.findOne('app_1')).rejects.toThrow(NotFoundException);
    });
  });
});
