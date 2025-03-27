import { InMemoryTrimestersRepository } from 'test/repositories/in-memory-trimester-repository';
import { AllocateTeacherUseCase } from './allocate-teacher';
import { InMemoryTrimestersRoomsRepository } from 'test/repositories/in-memory-trimesters-rooms-repository';
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository';
import { makeTrimester } from 'test/factories/make-trimester';
import { makeRoom } from 'test/factories/make-room';
import { AgeGroup } from '@/domain/ebd/enterprise/value-objects/age-group';
import { makeTrimesterRoom } from 'test/factories/make-trimester-room';
import { makeMember } from 'test/factories/make-member';
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository';
import { makeUser } from 'test/factories/make-user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { UserRole } from '@/domain/ebd/enterprise/user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryMembersRepository: InMemoryMembersRepository;
let inMemoryRoomsRepository: InMemoryRoomsRepository;
let inMemoryTrimestersRepository: InMemoryTrimestersRepository;
let inMemoryTrimestersRoomsRepository: InMemoryTrimestersRoomsRepository;
let sut: AllocateTeacherUseCase;

describe('Allocate Teacher', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryMembersRepository = new InMemoryMembersRepository();
    inMemoryTrimestersRepository = new InMemoryTrimestersRepository();
    inMemoryRoomsRepository = new InMemoryRoomsRepository();
    inMemoryTrimestersRoomsRepository = new InMemoryTrimestersRoomsRepository();
    sut = new AllocateTeacherUseCase(
      inMemoryTrimestersRoomsRepository,
      inMemoryUsersRepository,
    );
  });

  it('shoult be able to allocate a teacher to the trimester room', async () => {
    const member = makeMember();
    await inMemoryMembersRepository.create(member);

    const teacher = makeUser({
      memberId: member.id,
      username: Username.create('john01'),
      role: UserRole.TEACHER,
    });

    await inMemoryUsersRepository.create(teacher);

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
      teacherId: teacher.id.toString(),
      trimesterRoomId: trimesterRoom.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryTrimestersRoomsRepository.items).toHaveLength(1);
      expect(inMemoryTrimestersRoomsRepository.items[0]).toEqual(
        expect.objectContaining({
          teachersIds: expect.arrayContaining([expect.any(UniqueEntityId)]),
        }),
      );
    }
  });
});
