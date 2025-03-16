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
import { UserFactory } from 'test/factories/make-user';
describe('Create Room (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;

  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /room', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('john1000'),
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const response = await request(app.getHttpServer())
      .post('/room')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'juniores',
        minAge: 7,
        maxAge: 11,
      });

    expect(response.statusCode).toBe(201);

    const userOnDataBase = await prisma.room.findFirst({
      where: {
        name: {
          equals: 'juniores',
          mode: 'insensitive',
        },
      },
    });

    expect(userOnDataBase).toBeTruthy();
  });
});
