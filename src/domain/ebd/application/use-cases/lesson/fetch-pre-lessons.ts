import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { PreLesson } from '@/domain/ebd/enterprise/pre-lesson';
import { PreLessonRepository } from '../../repositories/pre-lesson-repository';

interface FetchPreLessonsUseCaseRequest {
  page: number;
  perPage?: number;
  trimesterId: string;
  numberLesson?: number;
  date?: Date;
}

type FetchPreLessonsUseCaseResponse = Either<
  null,
  {
    preLessons: Array<PreLesson & { pendingClasses: number }>;
    meta: Meta;
  }
>;

@Injectable()
export class FetchPreLessonsUseCase {
  constructor(private prelessonsRepository: PreLessonRepository) {}

  async execute({
    page,
    perPage,
    trimesterId,
    date,
    numberLesson,
  }: FetchPreLessonsUseCaseRequest): Promise<FetchPreLessonsUseCaseResponse> {
    const { preLessons, meta } = await this.prelessonsRepository.findMany(
      { page, perPage },
      { trimesterId, date, numberLesson },
    );

    return right({
      preLessons,
      meta,
    });
  }
}
