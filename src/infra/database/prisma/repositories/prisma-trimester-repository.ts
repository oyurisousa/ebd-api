import { Trimester } from '@/domain/ebd/enterprise/trimester';
import { Injectable } from '@nestjs/common';
import { PrismaTrimesterMapper } from '../mappers/prisma-trimester-mapper';
import { PrismaService } from '../prisma.service';
import { TrimestersRepository } from '@/domain/ebd/application/repositories/trimester-repository';
import { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaTrimestersRepository implements TrimestersRepository {
  constructor(private prisma: PrismaService) {}

  async create(trimester: Trimester): Promise<void> {
    const data = PrismaTrimesterMapper.toPrisma(trimester);
    await this.prisma.trimester.create({
      data,
    });
  }

  async findById(id: string): Promise<Trimester | null> {
    const trimester = await this.prisma.trimester.findUnique({
      where: {
        id,
      },
    });

    if (!trimester) return null;

    return PrismaTrimesterMapper.toDomain(trimester);
  }

  async findByQuarterAndYear(
    quarter: number,
    year: number,
  ): Promise<Trimester | null> {
    const trimester = await this.prisma.trimester.findFirst({
      where: {
        quarter,
        year,
      },
    });

    if (!trimester) return null;

    return PrismaTrimesterMapper.toDomain(trimester);
  }

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: { title?: string; quarter?: number; year?: number },
  ): Promise<{ trimesters: Trimester[]; meta: Meta }> {
    const { quarter, title, year } = filters;

    const whereClause: Prisma.TrimesterWhereInput = {
      ...(title && {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      }),
      ...(quarter && {
        quarter: {
          equals: Number(quarter),
        },
      }),
      ...(year && {
        year: {
          equals: Number(year),
        },
      }),
    };

    const [trimesters, totalCount] = await Promise.all([
      this.prisma.trimester.findMany({
        where: whereClause,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: [{ year: 'desc' }, { quarter: 'asc' }],
      }),

      this.prisma.trimester.count({
        where: whereClause,
      }),
    ]);

    const trimestersMapped = trimesters.map((trimester) => {
      return PrismaTrimesterMapper.toDomain(trimester);
    });

    return {
      trimesters: trimestersMapped,
      meta: {
        page,
        totalCount,
        totalPage: trimesters.length,
      },
    };
  }
}
