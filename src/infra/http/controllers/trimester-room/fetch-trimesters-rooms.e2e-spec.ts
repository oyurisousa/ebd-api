import { UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { RoomFactory } from 'test/factories/make-room';
import { TrimesterFactory } from 'test/factories/make-trimester';
import { TrimesterRoomFactory } from 'test/factories/make-trimester-room';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Trimester Rooms (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let trimesterRoomFactory: TrimesterRoomFactory;
  let trimesterFactory: TrimesterFactory;
  let roomFactory: RoomFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        TrimesterRoomFactory,
        UserFactory,
        TrimesterFactory,
        RoomFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    trimesterRoomFactory = moduleRef.get(TrimesterRoomFactory);
    trimesterFactory = moduleRef.get(TrimesterFactory);
    roomFactory = moduleRef.get(RoomFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /trimester-room', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('test1_9'),
    });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const room = await roomFactory.makePrismaRoom({ name: 'juniores' });
    const room2 = await roomFactory.makePrismaRoom({ name: 'jovens' });
    const room3 = await roomFactory.makePrismaRoom({ name: 'cordeirinhos' });
    const trimester = await trimesterFactory.makePrismaTrimester({
      title: '2025.1',
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 2, 31),
      quarter: 1,
      year: 2025,
    });

    await Promise.all([
      trimesterRoomFactory.makePrismaTrimesterRoom({
        roomId: room.id,
        trimesterId: trimester.id,
      }),
      trimesterRoomFactory.makePrismaTrimesterRoom({
        roomId: room2.id,
        trimesterId: trimester.id,
      }),
      trimesterRoomFactory.makePrismaTrimesterRoom({
        roomId: room3.id,
        trimesterId: trimester.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/trimester-room')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        trimesterId: trimester.id.toString(),
      })
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        trimestersRooms: expect.arrayContaining([
          expect.objectContaining({ name: 'cordeirinhos' }),
          expect.objectContaining({ name: 'jovens' }),
          expect.objectContaining({ name: 'juniores' }),
        ]),
      }),
    );
  });
});
