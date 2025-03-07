import { Member } from '@/domain/ebd/enterprise/member';

export class MemberPresenter {
  static toHTTP(member: Member) {
    return {
      name: member.name,
      birthDate: member.birthDate,
      sex: member.sex.toString(),
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      age: member.calculateAge(),
    };
  }
}
