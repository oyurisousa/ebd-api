import { Sex } from '@/domain/ebd/enterprise/member';
import { UserRole } from '@/domain/ebd/enterprise/user';
import { AgeGroup } from '@/domain/ebd/enterprise/value-objects/age-group';
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
import { RoomFactory } from 'test/factories/make-room';
import { TrimesterFactory } from 'test/factories/make-trimester';
import { TrimesterRoomFactory } from 'test/factories/make-trimester-room';
import { UserFactory } from 'test/factories/make-user';
describe('Enroll Student (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let roomFactory: RoomFactory;
  let trimesterFactory: TrimesterFactory;
  let trimesterRoomFactory: TrimesterRoomFactory;
  let memberFactory: MemberFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [
        UserFactory,
        TrimesterFactory,
        RoomFactory,
        TrimesterRoomFactory,
        MemberFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    roomFactory = moduleRef.get(RoomFactory);
    trimesterFactory = moduleRef.get(TrimesterFactory);
    trimesterRoomFactory = moduleRef.get(TrimesterRoomFactory);
    memberFactory = moduleRef.get(MemberFactory);

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /trimester-room/enroll/student', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('john1000'),
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const [student1, student2, student3] = await Promise.all([
      memberFactory.makePrismaMember({
        name: 'Maria de Jesus',
        birthDate: new Date('2000-01-01'),
        sex: Sex.FEMALE,
      }),
      memberFactory.makePrismaMember({
        name: 'Maria de Jesus',
        birthDate: new Date('2000-01-01'),
        sex: Sex.FEMALE,
      }),
      memberFactory.makePrismaMember({
        name: 'Maria de Jesus',
        birthDate: new Date('2000-01-01'),
        sex: Sex.FEMALE,
      }),
    ]);

    const trimester = await trimesterFactory.makePrismaTrimester({
      title: '2025.1',
    });

    const room = await roomFactory.makePrismaRoom({
      name: 'juniores',
      ageGroup: AgeGroup.create(7, 11),
    });

    const trimesterRoom = await trimesterRoomFactory.makePrismaTrimesterRoom({
      roomId: room.id,
      trimesterId: trimester.id,
    });

    const response = await request(app.getHttpServer())
      .post('/trimester-room/enroll/student')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        trimesterRoomId: trimesterRoom.id.toString(),
        studentsIds: [
          student1.id.toString(),
          student2.id.toString(),
          student3.id.toString(),
        ],
      });

    expect(response.statusCode).toBe(201);

    const allocateOnDataBase = await prisma.registration.count({
      where: {
        trimesterRoomId: trimesterRoom.id.toString(),
      },
    });

    expect(allocateOnDataBase).toEqual(3);
  });
});
