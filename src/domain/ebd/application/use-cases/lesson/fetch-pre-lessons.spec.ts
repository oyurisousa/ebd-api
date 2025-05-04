import { InMemoryPreLessonRepository } from 'test/repositories/in-memory-pre-lesson-repository';
import { FetchPreLessonsUseCase } from './fetch-pre-lessons';
import { makePreLesson } from 'test/factories/make-pre-lesson';
import { InMemoryTrimestersRepository } from 'test/repositories/in-memory-trimester-repository';
import { makeTrimester } from 'test/factories/make-trimester';
import { InMemoryTrimestersRoomsRepository } from 'test/repositories/in-memory-trimesters-rooms-repository';
import { InMemoryLessonsRepository } from 'test/repositories/in-memory-lessons-repository';
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository';
let inMemoryRoomsRepository: InMemoryRoomsRepository;
let inMemoryTrimestersRoomsRepository: InMemoryTrimestersRoomsRepository;
let inMemoryLessonsRepository: InMemoryLessonsRepository;
let inMemoryTrimestersRepository: InMemoryTrimestersRepository;
let inMemoryPreLessonsRepository: InMemoryPreLessonRepository;
let sut: FetchPreLessonsUseCase;
describe('Fetch Pre-Lessons', () => {
  beforeEach(() => {
    inMemoryRoomsRepository = new InMemoryRoomsRepository();
    inMemoryTrimestersRoomsRepository = new InMemoryTrimestersRoomsRepository(
      inMemoryRoomsRepository,
    );
    inMemoryLessonsRepository = new InMemoryLessonsRepository();
    inMemoryTrimestersRepository = new InMemoryTrimestersRepository();
    inMemoryPreLessonsRepository = new InMemoryPreLessonRepository(
      inMemoryTrimestersRoomsRepository,
      inMemoryLessonsRepository,
    );

    sut = new FetchPreLessonsUseCase(inMemoryPreLessonsRepository);
  });

  it('should be able to fetch prelessons', async () => {
    const trimester = makeTrimester({ year: 2025, quarter: 1 });
    await inMemoryTrimestersRepository.create(trimester);

    await inMemoryPreLessonsRepository.create(
      makePreLesson({
        trimesterId: trimester.id,
        createdAt: new Date(2024, 0, 29),
        lesson: 3,
      }),
    );
    await inMemoryPreLessonsRepository.create(
      makePreLesson({
        trimesterId: trimester.id,
        createdAt: new Date(2024, 0, 20),
        lesson: 1,
      }),
    );
    await inMemoryPreLessonsRepository.create(
      makePreLesson({
        trimesterId: trimester.id,
        createdAt: new Date(2024, 0, 27),
        lesson: 2,
      }),
    );

    const result = await sut.execute({
      page: 1,
      trimesterId: trimester.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.preLessons).toHaveLength(3);
  });

  it('should be able to fetch paginated prelessons', async () => {
    const trimester = makeTrimester({ year: 2025, quarter: 1 });
    await inMemoryTrimestersRepository.create(trimester);

    for (let i = 1; i <= 13; i++) {
      await inMemoryPreLessonsRepository.create(
        makePreLesson({
          lesson: i,
          date: new Date(2024, 0, i),
          trimesterId: trimester.id,
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      trimesterId: trimester.id.toString(),
    });

    const result2 = await sut.execute({
      page: 1,
      date: new Date(2024, 0, 9),
      trimesterId: trimester.id.toString(),
    });

    expect(result.value?.preLessons).toHaveLength(3);
    expect(result2.value?.preLessons).toHaveLength(1);
  });
});
