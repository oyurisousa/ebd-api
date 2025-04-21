import { left, right, type Either } from '@/core/either';

import { Injectable } from '@nestjs/common';
import { TrimestersRoomsRepository } from '../../repositories/trimester-room-repository';
import { TrimesterRoomNotFoundError } from './_erros/trimester-room-not-found-error';
import { TrimesterRoom } from '@/domain/ebd/enterprise/trimester-room';
import { UsersRepository } from '../../repositories/users-repository';
import { UserNotFoundError } from '../user/_errors/user-not-found-error';
import { UserRole } from '@/domain/ebd/enterprise/user';
import { UserIsNotATeacherError } from './_erros/user-is-not-a-teacher-error';

interface AllocateTeacherUseCaseRequest {
  trimesterRoomId: string;
  teachersIds: string[];
}

type AllocateTeacherUseCaseResponse = Either<
  TrimesterRoomNotFoundError | UserNotFoundError | UserIsNotATeacherError,
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
    teachersIds: teachersIds,
    trimesterRoomId,
  }: AllocateTeacherUseCaseRequest): Promise<AllocateTeacherUseCaseResponse> {
    const trimesterRoom =
      await this.trimestersRoomsRepository.findById(trimesterRoomId);
    if (!trimesterRoom) {
      return left(new TrimesterRoomNotFoundError(trimesterRoomId));
    }

    const teachers = await Promise.all(
      teachersIds.map((id) => this.usersRepository.findById(id)),
    );

    for (let i = 0; i < teachers.length; i++) {
      const teacher = teachers[i];
      const teacherId = teachersIds[i];

      if (!teacher) {
        return left(new UserNotFoundError(teacherId));
      }

      if (teacher.role !== UserRole.TEACHER) {
        return left(new UserIsNotATeacherError());
      }
    }

    await this.trimestersRoomsRepository.addTeachers(
      teachersIds,
      trimesterRoomId,
    );

    return right({
      trimesterRoom,
    });
  }
}
