import { InMemoryTrimestersRoomsRepository } from 'test/repositories/in-memory-trimesters-rooms-repository';
import { CreateTrimesterRoomUseCase } from './create-trimester-room';
import { InMemoryTrimestersRepository } from 'test/repositories/in-memory-trimester-repository';
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository';
import { makeTrimester } from 'test/factories/make-trimester';
import { makeRoom } from 'test/factories/make-room';
import { AgeGroup } from '@/domain/ebd/enterprise/value-objects/age-group';

let inMemoryRoomsRepository: InMemoryRoomsRepository;
let inMemoryTrimestersRepository: InMemoryTrimestersRepository;
let inMemoryTrimestersRoomsRepository: InMemoryTrimestersRoomsRepository;
let sut: CreateTrimesterRoomUseCase;

describe('Create TrimesterRoom', () => {
  beforeEach(() => {
    inMemoryTrimestersRepository = new InMemoryTrimestersRepository();
    inMemoryRoomsRepository = new InMemoryRoomsRepository();
    inMemoryTrimestersRoomsRepository = new InMemoryTrimestersRoomsRepository(
      inMemoryRoomsRepository,
    );
    sut = new CreateTrimesterRoomUseCase(inMemoryTrimestersRoomsRepository);
  });

  it('shoult be able to create a new Trimester Room', async () => {
    const trimester = makeTrimester();
    await inMemoryTrimestersRepository.create(trimester);

    const room = makeRoom({
      ageGroup: AgeGroup.create(10),
      name: 'juniores',
    });
    await inMemoryRoomsRepository.create(room);

    const result = await sut.execute({
      roomsIds: [room.id.toString()],
      trimesterId: trimester.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryTrimestersRoomsRepository.items).toHaveLength(1);
    }
  });
});
