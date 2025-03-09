import { InMemoryTrimestersRepository } from 'test/repositories/in-memory-trimester-repository';
import { CreateTrimesterUseCase } from './create-trimester';
import { QuarterAlreadyExistsInYearError } from './quarter-already-exists-in-year-error';

let inMemoryTrimestersRepository: InMemoryTrimestersRepository;
let sut: CreateTrimesterUseCase;

describe('Create Trimester', () => {
  beforeEach(() => {
    inMemoryTrimestersRepository = new InMemoryTrimestersRepository();
    sut = new CreateTrimesterUseCase(inMemoryTrimestersRepository);
  });

  it('shoult be able to create a new Trimester', async () => {
    const result = await sut.execute({
      title: '1ª Semestre',
      year: 2024,
      quarter: 1,
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 2, 25),
    });
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryTrimestersRepository.items).toHaveLength(1);
      expect(inMemoryTrimestersRepository.items[0]).toEqual(
        expect.objectContaining({
          title: '1ª Semestre',
          year: 2024,
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        }),
      );
    }
  });
  it('shoult not be possible to create more than one trimester with same quarter', async () => {
    const result = await sut.execute({
      title: '1ª Semestre',
      year: 2024,
      quarter: 1,
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 2, 25),
    });
    const result2 = await sut.execute({
      title: '1ª Semestre',
      year: 2024,
      quarter: 1,
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 2, 25),
    });
    expect(result.isRight()).toBeTruthy();
    expect(result2.isLeft()).toBeTruthy();
    if (result2.isLeft()) {
      expect(result2.value).toBeInstanceOf(QuarterAlreadyExistsInYearError);
    }
  });
});
