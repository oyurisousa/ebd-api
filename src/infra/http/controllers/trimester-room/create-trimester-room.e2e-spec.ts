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
import { RoomFactory } from 'test/factories/make-room';
import { TrimesterFactory } from 'test/factories/make-trimester';
import { UserFactory } from 'test/factories/make-user';
describe('Create Trimester Room (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let roomFactory: RoomFactory;
  let trimesterFactory: TrimesterFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [UserFactory, TrimesterFactory, RoomFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    roomFactory = moduleRef.get(RoomFactory);
    trimesterFactory = moduleRef.get(TrimesterFactory);
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /trimester-room', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('john1000'),
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const trimester = await trimesterFactory.makePrismaTrimester({
      title: '2025.1',
    });

    const room = await roomFactory.makePrismaRoom({
      name: 'juniores',
      ageGroup: AgeGroup.create(7, 11),
    });

    const response = await request(app.getHttpServer())
      .post('/trimester-room')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        trimesterId: trimester.id.toString(),
        roomId: room.id.toString(),
      });

    expect(response.statusCode).toBe(201);

    const userOnDataBase = await prisma.trimesterRoom.findFirst({
      where: {
        roomId: room.id.toString(),
        trimesterId: trimester.id.toString(),
      },
    });

    expect(userOnDataBase).toBeTruthy();
  });
});
