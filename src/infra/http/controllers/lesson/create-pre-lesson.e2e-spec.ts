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
import { TrimesterFactory } from 'test/factories/make-trimester';
import { UserFactory } from 'test/factories/make-user';
describe('Create Pre Lesson (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;

  let userFactory: UserFactory;
  let trimesterFactory: TrimesterFactory;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [UserFactory, TrimesterFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    userFactory = moduleRef.get(UserFactory);
    trimesterFactory = moduleRef.get(TrimesterFactory);

    await app.init();
  });

  test('[POST] /pre-lesson', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('john1000'),
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const trimester = await trimesterFactory.makePrismaTrimester();

    const response = await request(app.getHttpServer())
      .post('/pre-lesson')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        date: new Date(),
        trimesterId: trimester.id.toString(),
        numberLesson: 1,
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
