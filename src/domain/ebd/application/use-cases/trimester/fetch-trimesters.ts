import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { Trimester } from '@/domain/ebd/enterprise/trimester';
import { TrimestersRepository } from '../../repositories/trimester-repository';

interface FetchTrimestersUseCaseRequest {
  page: number;
  perPage?: number;
  title?: string;
  quarter?: number;
  year?: number;
}

type FetchTrimestersUseCaseResponse = Either<
  null,
  {
    trimesters: Trimester[];
    meta: Meta;
  }
>;

@Injectable()
export class FetchTrimestersUseCase {
  constructor(private trimestersRepository: TrimestersRepository) {}

  async execute({
    page,
    perPage,
    quarter,
    title,
    year,
  }: FetchTrimestersUseCaseRequest): Promise<FetchTrimestersUseCaseResponse> {
    const { trimesters, meta } = await this.trimestersRepository.findMany(
      { page, perPage },
      { title, quarter, year },
    );

    return right({
      trimesters,
      meta,
    });
  }
}
