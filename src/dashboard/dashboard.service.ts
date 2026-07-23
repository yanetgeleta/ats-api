import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const aggregations = await this.prisma.applicant.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
      where: {
        deletedAt: null,
      },
    });

    const stats = {
      total: 0,
      PENDING: 0,
      SHORTLISTED: 0,
      ACCEPTED: 0,
      REJECTED: 0,
    };
    aggregations.forEach((item) => {
      stats[item.status] = item._count._all;
      stats.total += item._count._all;
    });
    return stats;
  }
}
