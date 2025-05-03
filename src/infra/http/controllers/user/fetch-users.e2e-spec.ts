import { UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';
describe('Fetch Users (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /user', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('user01_9'),
    });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    await Promise.all([
      userFactory.makePrismaUser({
        username: Username.create('jonh'),
        role: UserRole.TEACHER,
      }),
      userFactory.makePrismaUser({
        username: Username.create('peter'),
        role: UserRole.TEACHER,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
      })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        users: expect.arrayContaining([
          expect.objectContaining({ role: UserRole.TEACHER }),
          expect.objectContaining({ role: UserRole.TEACHER }),
        ]),
      }),
    );
  });
});
