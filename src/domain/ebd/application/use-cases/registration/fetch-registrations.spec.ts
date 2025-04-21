import { InMemoryRegistrationsRepository } from 'test/repositories/in-memory-registrations-repository';
import { FetchRegistrationsUseCase } from '../registration/fetch-registrations';
import { makeRegistration } from 'test/factories/make-registration';
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository';
import { makeMember } from 'test/factories/make-member';
import { InMemoryTrimestersRoomsRepository } from 'test/repositories/in-memory-trimesters-rooms-repository';
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository';
import { InMemoryTrimestersRepository } from 'test/repositories/in-memory-trimester-repository';
import { makeTrimester } from 'test/factories/make-trimester';
import { makeRoom } from 'test/factories/make-room';
import { makeTrimesterRoom } from 'test/factories/make-trimester-room';

let inMemoryTrimestersRepository: InMemoryTrimestersRepository;
let inMemoryRoomsRepository: InMemoryRoomsRepository;
let inMemoryTrimestersRoomsRepository: InMemoryTrimestersRoomsRepository;
let inMemoryMembersRepository: InMemoryMembersRepository;
let inMemoryRegistrationsRepository: InMemoryRegistrationsRepository;
let sut: FetchRegistrationsUseCase;
describe('Fetch Registrations', () => {
  beforeEach(() => {
    inMemoryTrimestersRepository = new InMemoryTrimestersRepository();
    inMemoryRoomsRepository = new InMemoryRoomsRepository();
    inMemoryTrimestersRoomsRepository = new InMemoryTrimestersRoomsRepository(
      inMemoryRoomsRepository,
    );
    inMemoryMembersRepository = new InMemoryMembersRepository();
    inMemoryRegistrationsRepository = new InMemoryRegistrationsRepository(
      inMemoryMembersRepository,
    );
    sut = new FetchRegistrationsUseCase(inMemoryRegistrationsRepository);
  });

  it('should be able to fetch registrations', async () => {
    const trimester = makeTrimester();
    await inMemoryTrimestersRepository.create(trimester);

    const room = makeRoom();
    await inMemoryRoomsRepository.create(room);

    const trimesterRoom = makeTrimesterRoom({
      roomId: room.id,
      trimesterId: trimester.id,
    });
    await inMemoryTrimestersRoomsRepository.createMany([trimesterRoom]);

    const member1 = makeMember({ name: 'pedro' });
    const member2 = makeMember({ name: 'thiago' });
    const member3 = makeMember({ name: 'joão' });

    await Promise.all([
      inMemoryMembersRepository.create(member1),
      inMemoryMembersRepository.create(member2),
      inMemoryMembersRepository.create(member3),
    ]);

    await inMemoryRegistrationsRepository.create(
      makeRegistration({
        studentId: member1.id,
        trimesterRommId: trimesterRoom.id,
      }),
    );
    await inMemoryRegistrationsRepository.create(
      makeRegistration({
        studentId: member2.id,
        trimesterRommId: trimesterRoom.id,
      }),
    );
    await inMemoryRegistrationsRepository.create(
      makeRegistration({
        studentId: member3.id,
        trimesterRommId: trimesterRoom.id,
      }),
    );

    const result = await sut.execute({
      page: 1,
      trimesterRoomId: trimesterRoom.id.toString(),
    });
    expect(result.value?.registrations).toEqual([
      expect.objectContaining({ name: 'joão' }),
      expect.objectContaining({ name: 'pedro' }),
      expect.objectContaining({ name: 'thiago' }),
    ]);
  });

  it('should be able to fetch paginated registrations', async () => {
    const trimester = makeTrimester();
    await inMemoryTrimestersRepository.create(trimester);

    const room = makeRoom();
    await inMemoryRoomsRepository.create(room);

    const trimesterRoom = makeTrimesterRoom({
      roomId: room.id,
      trimesterId: trimester.id,
    });
    await inMemoryTrimestersRoomsRepository.createMany([trimesterRoom]);

    for (let i = 1; i <= 22; i++) {
      const member = makeMember({ name: `joão ${i}` });
      await inMemoryMembersRepository.create(member);

      await inMemoryRegistrationsRepository.create(
        makeRegistration({
          studentId: member.id,
          trimesterRommId: trimesterRoom.id,
        }),
      );
    }

    const result = await sut.execute({
      page: 3,
      trimesterRoomId: trimesterRoom.id.toString(),
    });

    const result2 = await sut.execute({
      page: 1,
      trimesterRoomId: trimesterRoom.id.toString(),
      name: 'joão 10',
    });

    expect(result.value?.registrations).toHaveLength(2);
    expect(result2.value?.registrations).toHaveLength(1);
  });
});
