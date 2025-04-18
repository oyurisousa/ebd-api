import { left, right, type Either } from '@/core/either';

import { Injectable } from '@nestjs/common';
import { PreLessonWithSameNumberLessonAlreadyExistsOnTrimesterError } from './_erros/pre-lesson-with-same-number-lesson-already-exists-on-trimester-error';
import { PreLesson } from '@/domain/ebd/enterprise/pre-lesson';
import { PreLessonRepository } from '../../repositories/pre-lesson-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface createPreLessonUseCaseRequest {
  trimesterId: string;
  date: Date;
  numberLesson: number;
}

type createPreLessonUseCaseResponse = Either<
  PreLessonWithSameNumberLessonAlreadyExistsOnTrimesterError,
  {
    prelesson: PreLesson;
  }
>;

@Injectable()
export class CreatePreLessonUseCase {
  constructor(private preLessonsRepository: PreLessonRepository) {}

  async execute({
    date,
    numberLesson,
    trimesterId,
  }: createPreLessonUseCaseRequest): Promise<createPreLessonUseCaseResponse> {
    const prelessonAlreadyExists =
      await this.preLessonsRepository.findByTrimesterIdAndNumberLesson(
        trimesterId,
        numberLesson,
      );

    if (prelessonAlreadyExists) {
      return left(
        new PreLessonWithSameNumberLessonAlreadyExistsOnTrimesterError(),
      );
    }
    const prelesson = PreLesson.create({
      date,
      lesson: numberLesson,
      trimesterId: new UniqueEntityId(trimesterId),
    });

    await this.preLessonsRepository.create(prelesson);

    return right({
      prelesson,
    });
  }
}
