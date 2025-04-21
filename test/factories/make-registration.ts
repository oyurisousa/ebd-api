import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Registration,
  type RegistrationProps,
} from '@/domain/ebd/enterprise/registration';
import { PrismaRegistrationMapper } from '@/infra/database/prisma/mappers/prisma-registration-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeRegistration(
  override: Partial<RegistrationProps> = {},
  id?: UniqueEntityId,
) {
  const registration = Registration.create(
    {
      studentId: new UniqueEntityId(),
      trimesterRommId: new UniqueEntityId(),
      createdAt: faker.date.past(),
      ...override,
    },
    id,
  );

  return registration;
}

@Injectable()
export class RegistrationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRegistration(
    data: Partial<RegistrationProps> = {},
  ): Promise<Registration> {
    const registration = makeRegistration({
      ...data,
    });

    await this.prisma.registration.create({
      data: PrismaRegistrationMapper.toPrisma(registration),
    });

    return registration;
  }
}
