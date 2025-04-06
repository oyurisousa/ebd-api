import { RegistrationsRepository } from '@/domain/ebd/application/repositories/registrations-repository';
import { Registration } from '@/domain/ebd/enterprise/registration';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaRegistrationMapper } from '../mappers/prisma-registration-mapper';

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
}
