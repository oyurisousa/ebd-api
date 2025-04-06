import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository';
import { makeRoom } from 'test/factories/make-room';
import { FetchRoomsUseCase } from './fetch-rooms';

let inMemoryRoomsRepository: InMemoryRoomsRepository;
let sut: FetchRoomsUseCase;
describe('Fetch Rooms', () => {
  beforeEach(() => {
    inMemoryRoomsRepository = new InMemoryRoomsRepository();

    sut = new FetchRoomsUseCase(inMemoryRoomsRepository);
  });

  it('should be able to fetch rooms', async () => {
    await inMemoryRoomsRepository.create(makeRoom({ name: 'Jovens' }));
    await inMemoryRoomsRepository.create(makeRoom({ name: 'Juvenis' }));
    await inMemoryRoomsRepository.create(makeRoom({ name: 'cordeirinhos' }));

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.rooms).toEqual([
      expect.objectContaining({ name: 'cordeirinhos' }),
      expect.objectContaining({ name: 'Jovens' }),
      expect.objectContaining({ name: 'Juvenis' }),
    ]);
  });

  it('should be able to fetch paginated rooms', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRoomsRepository.create(
        makeRoom({
          name: `room ${i}`,
        }),
      );
    }
    const result = await sut.execute({
      page: 3,
    });

    const result2 = await sut.execute({
      page: 1,
      name: 'room 9',
    });
    if (result.isRight() && result2.isRight()) {
      expect(result.value.rooms).toHaveLength(2);
      expect(result2.value?.rooms).toHaveLength(1);
    }
  });
});
