import { right, type Either } from '@/core/either';

import { Member, Sex } from '@/domain/ebd/enterprise/member';
import { Injectable } from '@nestjs/common';
import { MembersRepository } from '../../repositories/members-repository';

interface createMemberUseCaseRequest {
  name: string;
  birthDate: Date;
  sex: Sex;
}

type createMemberUseCaseResponse = Either<
  null,
  {
    member: Member;
  }
>;

@Injectable()
export class CreateMemberUseCase {
  constructor(private memberRepository: MembersRepository) {}

  async execute({
    name,
    birthDate,
    sex,
  }: createMemberUseCaseRequest): Promise<createMemberUseCaseResponse> {
    const member = Member.create({
      name,
      birthDate,
      sex,
    });

    await this.memberRepository.create(member);

    return right({
      member,
    });
  }
}
