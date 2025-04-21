import { RegistrationsRepository } from '@/domain/ebd/application/repositories/registrations-repository';
import { Registration } from '@/domain/ebd/enterprise/registration';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaRegistrationMapper } from '../mappers/prisma-registration-mapper';
import { Meta } from '@/core/repositories/meta';
import {
  PaginationParams,
  PER_PAGE_DEFAULT,
} from '@/core/repositories/pagination-params';
import { RegistrationWithName } from '@/domain/ebd/enterprise/value-objects/registration-with-name';
import type { Prisma } from '@prisma/client';
import { PrismaRegistrationWithNameMapper } from '../mappers/prisma-registration-with-name-mapper';

@Injectable()
export class PrismaRegistrationsRepository implements RegistrationsRepository {
  constructor(readonly prisma: PrismaService) {}

  async create(registration: Registration): Promise<void> {
    const data = PrismaRegistrationMapper.toPrisma(registration);

    await this.prisma.registration.create({
      data,
    });
  }

  async findById(id: string): Promise<Registration | null> {
    const registration = await this.prisma.registration.findUnique({
      where: {
        id,
      },
    });
    if (!registration) {
      return null;
    }

    return PrismaRegistrationMapper.toDomain(registration);
  }

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: { trimesterRoomId: string; name?: string },
  ): Promise<{ registrations: RegistrationWithName[]; meta: Meta }> {
    const { trimesterRoomId, name } = filters;

    const whereClause: Prisma.RegistrationWhereInput = {
      trimesterRoomId: { equals: trimesterRoomId },
      ...(name && {
        student: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      }),
    };

    const [registrations, totalCount] = await Promise.all([
      this.prisma.registration.findMany({
        where: whereClause,
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: {
          student: {
            name: 'asc',
          },
        },
        include: {
          student: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.registration.count({
        where: whereClause,
      }),
    ]);

    const registrationsMapped = registrations.map((registration) => {
      return PrismaRegistrationWithNameMapper.toDomain({
        ...registration,
        name: registration.student.name,
      });
    });

    return {
      registrations: registrationsMapped,
      meta: {
        page,
        totalCount,
        totalPage: registrations.length,
      },
    };
  }
}
