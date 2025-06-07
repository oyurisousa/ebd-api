import { InMemoryPreLessonRepository } from 'test/repositories/in-memory-pre-lesson-repository';
import { makeTrimester } from 'test/factories/make-trimester';
import { InMemoryTrimestersRepository } from 'test/repositories/in-memory-trimester-repository';
import { InMemoryTrimestersRoomsRepository } from 'test/repositories/in-memory-trimesters-rooms-repository';
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository';
import { InMemoryLessonsRepository } from 'test/repositories/in-memory-lessons-repository';
import { makeRoom } from 'test/factories/make-room';
import { makeTrimesterRoom } from 'test/factories/make-trimester-room';
import { makePreLesson } from 'test/factories/make-pre-lesson';
import { CreateLessonUseCase } from './create-lesson';
import { InMemoryAttendanceRepository } from 'test/repositories/in-memory-attendance-repository';
import { makeRegistration } from 'test/factories/make-registration';
import { makeMember } from 'test/factories/make-member';
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository';
import { InMemoryRegistrationsRepository } from 'test/repositories/in-memory-registrations-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryRegistrationsRepository: InMemoryRegistrationsRepository;
let inMemoryMembersRepository: InMemoryMembersRepository;
let inMemoryAttendanceRepository: InMemoryAttendanceRepository;
let inMemoryLessonsRepository: InMemoryLessonsRepository;
let inMemoryRoomsRepository: InMemoryRoomsRepository;
let inMemoryTrimestersRepository: InMemoryTrimestersRepository;
let inMemoryTrimestersRoomsRepository: InMemoryTrimestersRoomsRepository;
let inMemoryPreLessonsRepository: InMemoryPreLessonRepository;
let sut: CreateLessonUseCase;

describe('Create Lesson', () => {
  beforeEach(() => {
    inMemoryRegistrationsRepository = new InMemoryRegistrationsRepository(
      inMemoryMembersRepository,
    );

    inMemoryMembersRepository = new InMemoryMembersRepository();
    inMemoryAttendanceRepository = new InMemoryAttendanceRepository();
    inMemoryTrimestersRepository = new InMemoryTrimestersRepository();
    inMemoryRoomsRepository = new InMemoryRoomsRepository();
    inMemoryLessonsRepository = new InMemoryLessonsRepository();
    inMemoryTrimestersRoomsRepository = new InMemoryTrimestersRoomsRepository(
      inMemoryRoomsRepository,
    );
    inMemoryPreLessonsRepository = new InMemoryPreLessonRepository(
      inMemoryTrimestersRoomsRepository,
      inMemoryLessonsRepository,
    );
    sut = new CreateLessonUseCase(
      inMemoryLessonsRepository,
      inMemoryAttendanceRepository,
    );
  });

  it('shoult be able to create a new Lesson', async () => {
    const trimester = makeTrimester();
    await inMemoryTrimestersRepository.create(trimester);

    const room = makeRoom();
    await inMemoryRoomsRepository.create(room);

    const trimesterRoom = makeTrimesterRoom({
      roomId: room.id,
      trimesterId: trimester.id,
    });

    const member = makeMember();
    await inMemoryMembersRepository.create(member);

    const registration = makeRegistration({
      studentId: member.id,
      trimesterRommId: trimesterRoom.id,
    });
    await inMemoryRegistrationsRepository.create(registration);

    const preLesson = makePreLesson({
      lesson: 1,
      trimesterId: trimester.id,
    });

    await inMemoryPreLessonsRepository.create(preLesson);

    const result = await sut.execute({
      preLessonId: preLesson.id.toString(),
      trimesterRoomId: trimesterRoom.id.toString(),
      bibles: 1,
      magazines: 1,
      offers: 12.67,
      studentsAttendance: [
        {
          registrationId: registration.id.toString(),
          present: true,
        },
      ],
      title: 'Um convite a Autenticidade',
      visitors: 0,
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryLessonsRepository.items).toHaveLength(1);
      expect(inMemoryAttendanceRepository.items).toHaveLength(1);
      expect(inMemoryLessonsRepository.items[0]).toEqual(
        expect.objectContaining({
          props: expect.objectContaining({
            bibles: 1,
            magazines: 1,
            offers: 12.67,
            title: 'Um convite a Autenticidade',
            visitors: 0,
            studentsAttendanceIds: expect.arrayContaining([
              expect.any(UniqueEntityId),
            ]),
          }),
        }),
      );
    }
  });
});
