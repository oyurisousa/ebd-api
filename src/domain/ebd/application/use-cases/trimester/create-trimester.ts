import { right, type Either } from '@/core/either';

import { Trimester } from '@/domain/ebd/enterprise/trimester';
import { Injectable } from '@nestjs/common';
import { TrimestersRepository } from '../../repositories/trimester-repository';

interface createTrimesterUseCaseRequest {
  title: string;
  year: number;
  quarter: number;
  startDate: Date;
  endDate: Date;
}

type createTrimesterUseCaseResponse = Either<
  null,
  {
    trimester: Trimester;
  }
>;

@Injectable()
export class CreateTrimesterUseCase {
  constructor(private trimesterRepository: TrimestersRepository) {}

  async execute({
    title,
    year,
    quarter,
    startDate,
    endDate,
  }: createTrimesterUseCaseRequest): Promise<createTrimesterUseCaseResponse> {
    const trimester = Trimester.create({
      title,
      year,
      quarter,
      startDate,
      endDate,
    });

    await this.trimesterRepository.create(trimester);

    return right({
      trimester,
    });
  }
}
