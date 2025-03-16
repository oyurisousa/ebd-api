import { left, right, type Either } from '@/core/either';

import { Injectable } from '@nestjs/common';
import type { AgeGroup } from '@/domain/ebd/enterprise/value-objects/age-group';
import { RoomsRepository } from '../../repositories/rooms-repository';
import { RoomAlreadyExistsError } from './_errors/room-already-exists-error';
import { Room } from '@/domain/ebd/enterprise/room';

interface createRoomUseCaseRequest {
  name: string;
  ageGroup: AgeGroup;
}

type createRoomUseCaseResponse = Either<
  RoomAlreadyExistsError,
  {
    room: Room;
  }
>;

@Injectable()
export class CreateRoomUseCase {
  constructor(private roomsRepository: RoomsRepository) {}

  async execute({
    name,
    ageGroup,
  }: createRoomUseCaseRequest): Promise<createRoomUseCaseResponse> {
    const roomAlreadyExists = await this.roomsRepository.findByName(name);

    if (roomAlreadyExists) {
      return left(new RoomAlreadyExistsError(name));
    }
    const room = Room.create({ name, ageGroup });

    await this.roomsRepository.create(room);

    return right({
      room,
    });
  }
}
