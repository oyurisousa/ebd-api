import { UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { RoomFactory } from 'test/factories/make-room';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Rooms (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let roomFactory: RoomFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RoomFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    roomFactory = moduleRef.get(RoomFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /room', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('room01_9'),
    });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    await Promise.all([
      roomFactory.makePrismaRoom({
        name: 'room 1',
      }),
      roomFactory.makePrismaRoom({
        name: 'room 2',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/room')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        name: 'room',
      })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        rooms: expect.arrayContaining([
          expect.objectContaining({ name: 'room 1' }),
          expect.objectContaining({ name: 'room 2' }),
        ]),
      }),
    );
  });
});
