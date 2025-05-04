import { UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PreLessonFactory } from 'test/factories/make-pre-lesson';
import { TrimesterFactory } from 'test/factories/make-trimester';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Pre-Lessons (E2E)', () => {
  let app: INestApplication;
  let trimesterFactory: TrimesterFactory;
  let userFactory: UserFactory;
  let preLessonFactory: PreLessonFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PreLessonFactory, UserFactory, TrimesterFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    trimesterFactory = moduleRef.get(TrimesterFactory);
    userFactory = moduleRef.get(UserFactory);
    preLessonFactory = moduleRef.get(PreLessonFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /pre-lesson', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('user01_9'),
    });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const trimester = await trimesterFactory.makePrismaTrimester({
      year: 2025,
      quarter: 1,
    });

    await Promise.all([
      preLessonFactory.makePrismaPreLesson({
        lesson: 1,
        trimesterId: trimester.id,
      }),
      preLessonFactory.makePrismaPreLesson({
        lesson: 2,
        trimesterId: trimester.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/pre-lesson')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        trimesterId: trimester.id.toString(),
      })
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        preLessons: expect.arrayContaining([
          expect.objectContaining({ lesson: 1 }),
          expect.objectContaining({ lesson: 2 }),
        ]),
      }),
    );
  });
});
