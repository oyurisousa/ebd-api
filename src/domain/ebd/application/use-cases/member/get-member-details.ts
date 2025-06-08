import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { MemberNotFoundError } from './_errors/member-not-found-error';
import { MembersRepository } from '../../repositories/members-repository';
import type { Member } from '@/domain/ebd/enterprise/member';

interface GetMemberDetailsMemberUseCaseRequest {
  memberId: string;
}

type GetMemberDetailsMemberUseCaseResponse = Either<
  MemberNotFoundError,
  {
    member: Member;
  }
>;

@Injectable()
export class GetMemberDetailsUseCase {
  constructor(private memberRepository: MembersRepository) {}

  async execute({
    memberId: memberId,
  }: GetMemberDetailsMemberUseCaseRequest): Promise<GetMemberDetailsMemberUseCaseResponse> {
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      return left(new MemberNotFoundError(memberId));
    }

    return right({
      member,
    });
  }
}
