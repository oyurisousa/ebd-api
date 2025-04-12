import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { TrimestersRoomsRepository } from '../../repositories/trimester-room-repository';
import { TrimesterRoomWithRoom } from '@/domain/ebd/enterprise/value-objects/trimester-room-with-room';

interface FetchTrimesterRoomsUseCaseRequest {
  trimesterId: string;
  page: number;
  perPage?: number;
}

type FetchTrimesterRoomsUseCaseResponse = Either<
  null,
  {
    trimestersRooms: TrimesterRoomWithRoom[];
    meta: Meta;
  }
>;

@Injectable()
export class FetchTrimesterRoomsUseCase {
  constructor(private trimesterRoomsRepository: TrimestersRoomsRepository) {}

  async execute({
    trimesterId,
    page,
    perPage,
  }: FetchTrimesterRoomsUseCaseRequest): Promise<FetchTrimesterRoomsUseCaseResponse> {
    const { trimestersRooms, meta } =
      await this.trimesterRoomsRepository.findMany(
        { page, perPage },
        trimesterId,
      );

    return right({
      trimestersRooms,
      meta,
    });
  }
}
