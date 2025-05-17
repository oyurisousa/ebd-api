import { CreatePreLessonUseCase } from './create-pre-lesson';
import { InMemoryPreLessonRepository } from 'test/repositories/in-memory-pre-lesson-repository';
import { makeTrimester } from 'test/factories/make-trimester';
import { InMemoryTrimestersRepository } from 'test/repositories/in-memory-trimester-repository';
import { PreLessonWithSameNumberLessonAlreadyExistsOnTrimesterError } from './_erros/pre-lesson-with-same-number-lesson-already-exists-on-trimester-error';
import { InMemoryTrimestersRoomsRepository } from 'test/repositories/in-memory-trimesters-rooms-repository';
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository';
import { InMemoryLessonsRepository } from 'test/repositories/in-memory-lessons-repository';

let inMemoryLessonsRepository: InMemoryLessonsRepository;
let inMemoryRoomsRepository: InMemoryRoomsRepository;
let inMemoryTrimestersRepository: InMemoryTrimestersRepository;
let inMemoryTrimestersRoomsRepository: InMemoryTrimestersRoomsRepository;
let inMemoryPreLessonsRepository: InMemoryPreLessonRepository;
let sut: CreatePreLessonUseCase;

describe('Create Pre Lesson', () => {
  beforeEach(() => {
    inMemoryTrimestersRepository = new InMemoryTrimestersRepository();
    inMemoryRoomsRepository = new InMemoryRoomsRepository();
    inMemoryLessonsRepository = new InMemoryLessonsRepository();

    inMemoryTrimestersRoomsRepository = new InMemoryTrimestersRoomsRepository(
      inMemoryRoomsRepository,
    );

    inMemoryPreLessonsRepository = new InMemoryPreLessonRepository(
      inMemoryTrimestersRoomsRepository,
      inMemoryLessonsRepository,
    );
    sut = new CreatePreLessonUseCase(inMemoryPreLessonsRepository);
  });

  it('shoult be able to create a new Pre Lesson', async () => {
    const trimester = makeTrimester();
    await inMemoryTrimestersRepository.create(trimester);

    const result = await sut.execute({
      date: new Date(),
      trimesterId: trimester.id.toString(),
      numberLesson: 1,
    });
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryPreLessonsRepository.items).toHaveLength(1);
      expect(inMemoryPreLessonsRepository.items[0]).toEqual(
        expect.objectContaining({
          lesson: 1,
        }),
      );
    }
  });

  it('shoult not be able to create two pre lessons with same trimesterId and lesson', async () => {
    const trimester = makeTrimester();
    await inMemoryTrimestersRepository.create(trimester);

    const result = await sut.execute({
      date: new Date(),
      trimesterId: trimester.id.toString(),
      numberLesson: 1,
    });

    const result2 = await sut.execute({
      date: new Date(),
      trimesterId: trimester.id.toString(),
      numberLesson: 1,
    });
    expect(result.isRight()).toBeTruthy();
    expect(result2.isLeft()).toBeTruthy();
    expect(result2.value).toBeInstanceOf(
      PreLessonWithSameNumberLessonAlreadyExistsOnTrimesterError,
    );
  });
});
