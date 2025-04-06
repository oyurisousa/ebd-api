import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Registration } from '@/domain/ebd/enterprise/registration';
import {
  Registration as PrismaRegistration,
  type Prisma,
} from '@prisma/client';

export class PrismaRegistrationMapper {
  static toDomain(raw: PrismaRegistration): Registration {
    return Registration.create(
      {
        studentId: new UniqueEntityId(raw.studentId),
        trimesterRommId: new UniqueEntityId(raw.trimesterRoomId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(
    registration: Registration,
  ): Prisma.RegistrationUncheckedCreateInput {
    return {
      id: registration.id.toString(),
      studentId: registration.studentId.toString(),
      trimesterRoomId: registration.trimesterRommId.toString(),
      createdAt: registration.createdAt,
    };
  }
}
