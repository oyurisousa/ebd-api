import { UsersRepository } from '@/domain/ebd/application/repositories/users-repository';
import { User, type UserRole } from '@/domain/ebd/enterprise/user';
import { Injectable } from '@nestjs/common';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { PrismaService } from '../prisma.service';
import { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
import { $Enums, type Prisma } from '@prisma/client';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: { content?: string; role?: UserRole },
  ): Promise<{ users: User[]; meta: Meta }> {
    const { content, role } = filters;

    const whereClause: Prisma.UserWhereInput = {
      OR: content
        ? [
            { email: { contains: content, mode: 'insensitive' } },
            { username: { contains: content, mode: 'insensitive' } },
          ]
        : undefined,
      ...(role && {
        role: $Enums.UserRole[role],
      }),
    };

    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: whereClause,
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: {
          username: 'asc',
        },
      }),
      this.prisma.user.count({
        where: whereClause,
      }),
    ]);
    const usersMapped = users.map(PrismaUserMapper.toDomain);

    return {
      users: usersMapped,
      meta: {
        page,
        totalCount,
        totalPage: users.length,
      },
    };
  }
}
