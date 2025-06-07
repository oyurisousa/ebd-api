import { UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { EnvModule } from '@/infra/env/env.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MemberFactory } from 'test/factories/make-member';
import { PreLessonFactory } from 'test/factories/make-pre-lesson';
import { RegistrationFactory } from 'test/factories/make-registration';
import { RoomFactory } from 'test/factories/make-room';
import { TrimesterFactory } from 'test/factories/make-trimester';
import { TrimesterRoomFactory } from 'test/factories/make-trimester-room';
import { UserFactory } from 'test/factories/make-user';
describe('Create Lesson (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;

  let userFactory: UserFactory;
  let trimesterFactory: TrimesterFactory;
  let preLessonFactory: PreLessonFactory;
  let trimesterRoomFactory: TrimesterRoomFactory;
  let roomFactory: RoomFactory;
  let registrationFactory: RegistrationFactory;
  let memberFactory: MemberFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [
        UserFactory,
        TrimesterFactory,
        PreLessonFactory,
        TrimesterRoomFactory,
        RoomFactory,
        RegistrationFactory,
        MemberFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    userFactory = moduleRef.get(UserFactory);
    trimesterFactory = moduleRef.get(TrimesterFactory);
    preLessonFactory = moduleRef.get(PreLessonFactory);
    trimesterRoomFactory = moduleRef.get(TrimesterRoomFactory);
    roomFactory = moduleRef.get(RoomFactory);
    registrationFactory = moduleRef.get(RegistrationFactory);
    memberFactory = moduleRef.get(MemberFactory);

    await app.init();
  });

  test('[POST] /lesson', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('john1000'),
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const teacher = await userFactory.makePrismaUser({
      role: UserRole.TEACHER,
      username: Username.create('teacher'),
    });

    const trimester = await trimesterFactory.makePrismaTrimester();

    const preLesson = await preLessonFactory.makePrismaPreLesson({
      trimesterId: trimester.id,
      lesson: 1,
    });
    const room = await roomFactory.makePrismaRoom({
      name: 'Room 101',
    });

    const [student1, student2] = await Promise.all([
      memberFactory.makePrismaMember({
        name: 'student 1',
      }),
      memberFactory.makePrismaMember({
        name: 'student 2',
      }),
    ]);

    const trimesterRoom = await trimesterRoomFactory.makePrismaTrimesterRoom({
      trimesterId: trimester.id,
      roomId: room.id,
      teachersIds: [teacher.id],
    });

    const [registration1, registration2] = await Promise.all([
      registrationFactory.makePrismaRegistration({
        studentId: student1.id,
        trimesterRommId: trimesterRoom.id,
      }),
      registrationFactory.makePrismaRegistration({
        studentId: student2.id,
        trimesterRommId: trimesterRoom.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .post('/lesson')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        bibles: 2,
        magazines: 2,
        offers: 5.75,
        preLessonId: preLesson.id.toString(),
        studentsAttendance: [
          {
            registrationId: registration1.id.toString(),
            present: true,
          },
          {
            registrationId: registration2.id.toString(),
            present: true,
          },
        ],
        title: 'Lesson 1 - Introduction',
        trimesterRoomId: trimesterRoom.id.toString(),
        visitors: 5,
      });

    expect(response.statusCode).toBe(201);

    const userOnDataBase = await prisma.preLesson.findFirst({
      where: {
        lesson: {
          equals: 1,
        },
      },
    });

    expect(userOnDataBase).toBeTruthy();
  });
});
