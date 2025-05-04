import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { RegistrationWithName } from '@/domain/ebd/enterprise/value-objects/registration-with-name';
import { Registration as PrismaRegistration } from '@prisma/client';

export class PrismaRegistrationWithNameMapper {
  static toDomain(
    raw: PrismaRegistration & { name: string },
  ): RegistrationWithName {
    return RegistrationWithName.create({
      studentId: new UniqueEntityId(raw.studentId),
      trimesterRommId: new UniqueEntityId(raw.trimesterRoomId),
      createdAt: raw.createdAt,
      name: raw.name,
    });
  }
}
