import { MembersRepository } from '@/domain/ebd/application/repositories/members-repository';
import { Member, type Sex } from '@/domain/ebd/enterprise/member';
import { Injectable } from '@nestjs/common';
import { PrismaMemberMapper } from '../mappers/prisma-member-mapper';
import { PrismaService } from '../prisma.service';
import { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
import { Prisma, Sex as PrismaSex } from '@prisma/client';

@Injectable()
export class PrismaMembersRepository implements MembersRepository {
  constructor(private prisma: PrismaService) {}

  async create(member: Member): Promise<void> {
    const data = PrismaMemberMapper.toPrisma(member);
    await this.prisma.member.create({
      data,
    });
  }

  async findById(id: string): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: {
        id,
      },
    });

    if (!member) return null;

    return PrismaMemberMapper.toDomain(member);
  }

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: { name?: string; sex?: Sex; birthDate?: Date },
  ): Promise<{ members: Member[]; meta: Meta }> {
    const { name, birthDate, sex } = filters;

    const whereClause: Prisma.MemberWhereInput = {
      name: {
        contains: name,
        mode: 'insensitive',
      },
      ...(birthDate && {
        birthDate: { gte: new Date(birthDate), lte: new Date(birthDate) },
      }),
      ...(sex && {
        sex: {
          equals: PrismaSex[sex.toString()],
        },
      }),
    };

    const [members, totalCount] = await this.prisma.$transaction([
      this.prisma.member.findMany({
        where: whereClause,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.member.count({
        where: whereClause,
      }),
    ]);

    const membersMapped = members.map(PrismaMemberMapper.toDomain);

    return {
      members: membersMapped,
      meta: {
        page,
        totalCount,
        totalPage: membersMapped.length,
      },
    };
  }
}
