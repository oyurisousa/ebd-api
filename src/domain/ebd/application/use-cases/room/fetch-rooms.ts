import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { Room } from '@/domain/ebd/enterprise/room';
import { RoomsRepository } from '../../repositories/rooms-repository';

interface FetchRoomsUseCaseRequest {
  page: number;
  perPage?: number;
  name?: string;
}

type FetchRoomsUseCaseResponse = Either<
  null,
  {
    rooms: Room[];
    meta: Meta;
  }
>;

@Injectable()
export class FetchRoomsUseCase {
  constructor(private roomsRepository: RoomsRepository) {}

  async execute({
    page,
    name,
    perPage,
  }: FetchRoomsUseCaseRequest): Promise<FetchRoomsUseCaseResponse> {
    const { rooms, meta } = await this.roomsRepository.findMany(
      { page, perPage },
      { name },
    );

    return right({
      rooms,
      meta,
    });
  }
}
