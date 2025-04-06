import { left, right, type Either } from '@/core/either';

import { Injectable } from '@nestjs/common';
import { TrimestersRoomsRepository } from '../../repositories/trimester-room-repository';
import { TrimesterRoomNotFoundError } from './_erros/trimester-room-not-found-error';
import { RegistrationsRepository } from '../../repositories/registrations-repository';
import { Registration } from '@/domain/ebd/enterprise/registration';
import { MemberNotFoundError } from '../member/_errors/member-not-found-error';
import { MembersRepository } from '../../repositories/members-repository';

interface enrollStudentUseCaseRequest {
  trimesterRoomId: string;
  studentsIds: string[];
}

type enrollStudentUseCaseResponse = Either<
  TrimesterRoomNotFoundError | MemberNotFoundError,
  null
>;

@Injectable()
export class EnrollStudentUseCase {
  constructor(
    private trimestersRoomsRepository: TrimestersRoomsRepository,
    private registrationsRepository: RegistrationsRepository,
    private membersRepository: MembersRepository,
  ) {}

  async execute({
    studentsIds,
    trimesterRoomId,
  }: enrollStudentUseCaseRequest): Promise<enrollStudentUseCaseResponse> {
    const trimesterRoom =
      await this.trimestersRoomsRepository.findById(trimesterRoomId);
    if (!trimesterRoom) {
      return left(new TrimesterRoomNotFoundError(trimesterRoomId));
    }

    for (const studentId of studentsIds) {
      const student = await this.membersRepository.findById(studentId);
      if (!student) {
        return left(new MemberNotFoundError(studentId));
      }

      const registration = Registration.create({
        studentId: student.id,
        trimesterRommId: trimesterRoom.id,
      });

      await this.registrationsRepository.create(registration);
    }

    return right(null);
  }
}
