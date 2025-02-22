import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Member, Sex } from '@/domain/ebd/enterprise/member';
import { $Enums, Member as PrismaMember, type Prisma } from '@prisma/client';

export class PrismaMemberMapper {
  static toDomain(raw: PrismaMember): Member {
    return Member.create(
      {
        name: raw.name,
        birthDate: raw.birthDate,
        sex: Sex[raw.sex],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(member: Member): Prisma.MemberUncheckedCreateInput {
    return {
      id: member.id.toString(),
      name: member.name,
      birthDate: member.birthDate,
      sex: $Enums.Sex[member.sex],
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}
