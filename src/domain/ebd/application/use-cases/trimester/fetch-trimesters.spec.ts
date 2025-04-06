import { makeTrimester } from 'test/factories/make-trimester';
import { FetchTrimestersUseCase } from './fetch-trimesters';
import { InMemoryTrimestersRepository } from 'test/repositories/in-memory-trimester-repository';

let inMemoryTrimestersRepository: InMemoryTrimestersRepository;
let sut: FetchTrimestersUseCase;
describe('Fetch Trimesters', () => {
  beforeEach(() => {
    inMemoryTrimestersRepository = new InMemoryTrimestersRepository();

    sut = new FetchTrimestersUseCase(inMemoryTrimestersRepository);
  });

  it('should be able to fetch trimesters', async () => {
    await inMemoryTrimestersRepository.create(
      makeTrimester({
        title: '2025.1',
        startDate: new Date(2025, 0, 1),
        endDate: new Date(2025, 2, 31),
        quarter: 1,
        year: 2025,
      }),
    );
    await inMemoryTrimestersRepository.create(
      makeTrimester({
        title: '2025.2',
        startDate: new Date(2025, 3, 1),
        endDate: new Date(2025, 5, 31),
        quarter: 2,
        year: 2025,
      }),
    );
    await inMemoryTrimestersRepository.create(
      makeTrimester({
        title: '2025.3',
        startDate: new Date(2025, 6, 1),
        endDate: new Date(2025, 8, 31),
        quarter: 3,
        year: 2025,
      }),
    );
    await inMemoryTrimestersRepository.create(
      makeTrimester({
        title: '2025.4',
        startDate: new Date(2025, 9, 1),
        endDate: new Date(2025, 11, 31),
        quarter: 4,
        year: 2025,
      }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.trimesters).toEqual([
      expect.objectContaining({ title: '2025.1' }),
      expect.objectContaining({ title: '2025.2' }),
      expect.objectContaining({ title: '2025.3' }),
      expect.objectContaining({ title: '2025.4' }),
    ]);
  });

  it('should be able to fetch paginated trimesters', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryTrimestersRepository.create(
        makeTrimester({
          title: `trimester ${i}`,
        }),
      );
    }
    const result = await sut.execute({
      page: 3,
    });

    const result2 = await sut.execute({
      page: 1,
      title: 'trimester 9',
    });

    if (result.isRight() && result2.isRight()) {
      expect(result.value.trimesters).toHaveLength(2);
      expect(result2.value.trimesters).toHaveLength(1);
    }
  });
});
