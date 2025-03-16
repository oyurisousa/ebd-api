import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository';
import { CreateRoomUseCase } from './create-room';
import { AgeGroup } from '@/domain/ebd/enterprise/value-objects/age-group';
import { RoomAlreadyExistsError } from './_errors/room-already-exists-error';

let inMemoryRoomsRepository: InMemoryRoomsRepository;
let sut: CreateRoomUseCase;

describe('Create Room', () => {
  beforeEach(() => {
    inMemoryRoomsRepository = new InMemoryRoomsRepository();
    sut = new CreateRoomUseCase(inMemoryRoomsRepository);
  });

  it('shoult be able to create a new Room', async () => {
    const result = await sut.execute({
      name: 'Adult',
      ageGroup: AgeGroup.create(18),
    });
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryRoomsRepository.items).toHaveLength(1);
      expect(inMemoryRoomsRepository.items[0]).toEqual(
        expect.objectContaining({
          name: 'Adult',
        }),
      );
    }
  });

  it('shoult not be able to create two rooms with same name', async () => {
    await sut.execute({
      name: 'Adult',
      ageGroup: AgeGroup.create(18),
    });

    const result = await sut.execute({
      name: 'Adult',
      ageGroup: AgeGroup.create(18),
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(RoomAlreadyExistsError);
  });
});
