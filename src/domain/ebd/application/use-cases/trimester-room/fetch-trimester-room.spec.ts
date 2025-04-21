import { InMemoryTrimestersRoomsRepository } from 'test/repositories/in-memory-trimesters-rooms-repository';
import { FetchTrimesterRoomsUseCase } from './fetch-trimester-room';
import { makeTrimesterRoom } from 'test/factories/make-trimester-room';
import { makeRoom } from 'test/factories/make-room';
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository';
import { makeTrimester } from 'test/factories/make-trimester';
import { InMemoryTrimestersRepository } from 'test/repositories/in-memory-trimester-repository';

let inMemoryTrimesterRoomsRepository: InMemoryTrimestersRoomsRepository;
let inMemoryRoomsRepository: InMemoryRoomsRepository;
let inMemoryTrimestersRepository: InMemoryTrimestersRepository;
let sut: FetchTrimesterRoomsUseCase;
describe('Fetch Trimester Rooms', () => {
  beforeEach(() => {
    inMemoryRoomsRepository = new InMemoryRoomsRepository();
    inMemoryTrimestersRepository = new InMemoryTrimestersRepository();
    inMemoryTrimesterRoomsRepository = new InMemoryTrimestersRoomsRepository(
      inMemoryRoomsRepository,
    );
    sut = new FetchTrimesterRoomsUseCase(inMemoryTrimesterRoomsRepository);
  });

  it('should be able to fetch trimester rooms', async () => {
    const trimester = makeTrimester({ year: new Date().getFullYear() });
    await inMemoryTrimestersRepository.create(trimester);

    const room1 = makeRoom({ name: 'juniores' });
    const room2 = makeRoom({ name: 'jovens' });
    const room3 = makeRoom({ name: 'discipulado' });

    await Promise.all([
      inMemoryRoomsRepository.create(room1),
      inMemoryRoomsRepository.create(room2),
      inMemoryRoomsRepository.create(room3),
    ]);

    await inMemoryTrimesterRoomsRepository.createMany([
      makeTrimesterRoom({
        roomId: room1.id,
        trimesterId: trimester.id,
      }),
    ]);

    await inMemoryTrimesterRoomsRepository.createMany([
      makeTrimesterRoom({
        roomId: room2.id,
        trimesterId: trimester.id,
        teachersIds: [],
      }),
    ]);
    await inMemoryTrimesterRoomsRepository.createMany([
      makeTrimesterRoom({
        roomId: room3.id,
        trimesterId: trimester.id,
        teachersIds: [],
      }),
    ]);

    const result = await sut.execute({
      page: 1,
      trimesterId: trimester.id.toString(),
    });

    expect(result.value?.trimestersRooms).toEqual([
      expect.objectContaining({
        name: 'discipulado',
      }),
      expect.objectContaining({
        name: 'jovens',
      }),
      expect.objectContaining({
        name: 'juniores',
      }),
    ]);
  });

  it('should be able to fetch paginated trimester rooms', async () => {
    const trimester = makeTrimester({ year: new Date().getFullYear() });
    await inMemoryTrimestersRepository.create(trimester);

    for (let i = 1; i <= 22; i++) {
      const room = makeRoom();
      await inMemoryRoomsRepository.create(room);

      await inMemoryTrimesterRoomsRepository.createMany([
        makeTrimesterRoom({
          roomId: room.id,
          trimesterId: trimester.id,
        }),
      ]);
    }
    const result = await sut.execute({
      page: 3,
      trimesterId: trimester.id.toString(),
    });

    if (result.isRight()) {
      expect(result.value.trimestersRooms).toHaveLength(2);
    }
  });
});
