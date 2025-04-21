import { UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MemberFactory } from 'test/factories/make-member';
import { RegistrationFactory } from 'test/factories/make-registration';
import { RoomFactory } from 'test/factories/make-room';
import { TrimesterFactory } from 'test/factories/make-trimester';
import { TrimesterRoomFactory } from 'test/factories/make-trimester-room';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Registration (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let registrationFactory: RegistrationFactory;
  let trimesterFactory: TrimesterFactory;
  let roomFactory: RoomFactory;
  let trimesterRoomFactory: TrimesterRoomFactory;
  let memberFactory: MemberFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        RegistrationFactory,
        UserFactory,
        TrimesterFactory,
        RoomFactory,
        TrimesterRoomFactory,
        MemberFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    registrationFactory = moduleRef.get(RegistrationFactory);
    trimesterFactory = moduleRef.get(TrimesterFactory);
    roomFactory = moduleRef.get(RoomFactory);
    trimesterRoomFactory = moduleRef.get(TrimesterRoomFactory);
    memberFactory = moduleRef.get(MemberFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /registration', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('test1_9'),
    });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const room = await roomFactory.makePrismaRoom({ name: 'juniores' });

    const trimester = await trimesterFactory.makePrismaTrimester({
      title: '2025.1',
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 2, 31),
      quarter: 1,
      year: 2025,
    });

    const trimesterRoom = await trimesterRoomFactory.makePrismaTrimesterRoom({
      roomId: room.id,
      trimesterId: trimester.id,
    });

    const [student1, student2, student3] = await Promise.all([
      memberFactory.makePrismaMember({ name: 'pedro' }),
      memberFactory.makePrismaMember({ name: 'thiago' }),
      memberFactory.makePrismaMember({ name: 'joão' }),
    ]);

    await Promise.all([
      registrationFactory.makePrismaRegistration({
        trimesterRommId: trimesterRoom.id,
        studentId: student1.id,
      }),
      registrationFactory.makePrismaRegistration({
        trimesterRommId: trimesterRoom.id,
        studentId: student2.id,
      }),
      registrationFactory.makePrismaRegistration({
        trimesterRommId: trimesterRoom.id,
        studentId: student3.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/registration')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        trimesterRoomId: trimesterRoom.id.toString(),
      })
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        registrations: expect.arrayContaining([
          expect.objectContaining({ name: 'joão' }),
          expect.objectContaining({ name: 'pedro' }),
          expect.objectContaining({ name: 'thiago' }),
        ]),
      }),
    );
  });
});
