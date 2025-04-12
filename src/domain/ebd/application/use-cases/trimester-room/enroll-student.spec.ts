import { InMemoryTrimestersRepository } from 'test/repositories/in-memory-trimester-repository';
import { InMemoryTrimestersRoomsRepository } from 'test/repositories/in-memory-trimesters-rooms-repository';
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository';
import { makeTrimester } from 'test/factories/make-trimester';
import { makeRoom } from 'test/factories/make-room';
import { AgeGroup } from '@/domain/ebd/enterprise/value-objects/age-group';
import { makeTrimesterRoom } from 'test/factories/make-trimester-room';
import { makeMember } from 'test/factories/make-member';
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { EnrollStudentUseCase } from './enroll-student';
import { InMemoryRegistrationsRepository } from 'test/repositories/in-memory-registrations-repository';

let inMemoryRegistrationsRepository: InMemoryRegistrationsRepository;
let inMemoryMembersRepository: InMemoryMembersRepository;
let inMemoryRoomsRepository: InMemoryRoomsRepository;
let inMemoryTrimestersRepository: InMemoryTrimestersRepository;
let inMemoryTrimestersRoomsRepository: InMemoryTrimestersRoomsRepository;
let sut: EnrollStudentUseCase;

describe('Enroll Student', () => {
  beforeEach(() => {
    inMemoryRegistrationsRepository = new InMemoryRegistrationsRepository();
    inMemoryMembersRepository = new InMemoryMembersRepository();
    inMemoryTrimestersRepository = new InMemoryTrimestersRepository();
    inMemoryRoomsRepository = new InMemoryRoomsRepository();
    inMemoryTrimestersRoomsRepository = new InMemoryTrimestersRoomsRepository(
      inMemoryRoomsRepository,
    );
    sut = new EnrollStudentUseCase(
      inMemoryTrimestersRoomsRepository,
      inMemoryRegistrationsRepository,
      inMemoryMembersRepository,
    );
  });

  it('shoult be able to enroll a teacher to the trimester room', async () => {
    const member = makeMember();
    await inMemoryMembersRepository.create(member);

    const member2 = makeMember();
    await inMemoryMembersRepository.create(member2);

    const trimester = makeTrimester();
    await inMemoryTrimestersRepository.create(trimester);

    const room = makeRoom({
      ageGroup: AgeGroup.create(10),
      name: 'juniores',
    });
    await inMemoryRoomsRepository.create(room);

    const trimesterRoom = makeTrimesterRoom({
      roomId: room.id,
      trimesterId: trimester.id,
    });
    await inMemoryTrimestersRoomsRepository.create(trimesterRoom);

    const result = await sut.execute({
      studentsIds: [member.id.toString(), member2.id.toString()],
      trimesterRoomId: trimesterRoom.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryRegistrationsRepository.items).toHaveLength(2);
      expect(inMemoryRegistrationsRepository.items[0]).toEqual(
        expect.objectContaining({
          studentId: expect.any(UniqueEntityId),
        }),
      );
      expect(inMemoryRegistrationsRepository.items[1]).toEqual(
        expect.objectContaining({
          studentId: expect.any(UniqueEntityId),
        }),
      );
    }
  });
});
