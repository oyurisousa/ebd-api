import { Member } from '@/domain/ebd/enterprise/member';

export class MemberPresenter {
  static toHTTP(member: Member) {
    return {
      memberId: member.id.toString(),
      name: member.name,
      birthDate: member.birthDate,
      sex: member.sex.toString(),
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      age: member.calculateAge(),
    };
  }
}
