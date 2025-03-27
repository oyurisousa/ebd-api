import { left, right, type Either } from '@/core/either';

import { Injectable } from '@nestjs/common';
import { TrimestersRoomsRepository } from '../../repositories/trimester-room-repository';
import { TrimesterRoomNotFoundError } from './_erros/trimester-room-not-found-error';
import { TrimesterRoom } from '@/domain/ebd/enterprise/trimester-room';
import { UsersRepository } from '../../repositories/users-repository';
import { UserNotFoundError } from '../user/_errors/user-not-found-error';
import { UserRole } from '@/domain/ebd/enterprise/user';
import { UserIsNotATeacherError } from './_erros/user-is-not-a-teacher-error';

interface allocateTeacherUseCaseRequest {
  trimesterRoomId: string;
  teacherId: string;
}

type allocateTeacherUseCaseResponse = Either<
  TrimesterRoomNotFoundError | UserNotFoundError,
  {
    trimesterRoom: TrimesterRoom;
  }
>;

@Injectable()
export class AllocateTeacherUseCase {
  constructor(
    private trimestersRoomsRepository: TrimestersRoomsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    teacherId,
    trimesterRoomId,
  }: allocateTeacherUseCaseRequest): Promise<allocateTeacherUseCaseResponse> {
    const trimesterRoom =
      await this.trimestersRoomsRepository.findById(trimesterRoomId);
    if (!trimesterRoom) {
      return left(new TrimesterRoomNotFoundError(trimesterRoomId));
    }

    const teacher = await this.usersRepository.findById(teacherId);
    if (!teacher) {
      return left(new UserNotFoundError(teacherId));
    }
    if (teacher.role !== UserRole.TEACHER) {
      return left(new UserIsNotATeacherError());
    }

    await this.trimestersRoomsRepository.addTeacher(teacherId, trimesterRoomId);

    return right({
      trimesterRoom,
    });
  }
}
