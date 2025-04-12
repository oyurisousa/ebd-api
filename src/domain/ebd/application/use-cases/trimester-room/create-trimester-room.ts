import { left, right, type Either } from '@/core/either';

import { Injectable } from '@nestjs/common';
import { TrimestersRoomsRepository } from '../../repositories/trimester-room-repository';
import { TrimesterRoom } from '@/domain/ebd/enterprise/trimester-room';
import { TrimesterRoomAlreadyExistsError } from './_erros/trimester-room-already-exists-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface createTrimesterRoomUseCaseRequest {
  trimesterId: string;
  roomId: string;
}

type createTrimesterRoomUseCaseResponse = Either<
  TrimesterRoomAlreadyExistsError,
  {
    trimesterroom: TrimesterRoom;
  }
>;

@Injectable()
export class CreateTrimesterRoomUseCase {
  constructor(private trimestersRoomsRepository: TrimestersRoomsRepository) {}

  async execute({
    roomId,
    trimesterId,
  }: createTrimesterRoomUseCaseRequest): Promise<createTrimesterRoomUseCaseResponse> {
    const trimesterRoomExists =
      await this.trimestersRoomsRepository.findByTrimesterIdAndRooId(
        trimesterId,
        roomId,
      );

    if (trimesterRoomExists) {
      return left(new TrimesterRoomAlreadyExistsError());
    }
    const trimesterroom = TrimesterRoom.create({
      trimesterId: new UniqueEntityId(trimesterId),
      roomId: new UniqueEntityId(roomId),
      teachersIds: [],
      registrationsIds: [],
    });

    await this.trimestersRoomsRepository.create(trimesterroom);

    return right({
      trimesterroom,
    });
  }
}
