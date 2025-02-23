import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';
describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /auth/login', async () => {
    await userFactory.makePrismaUser({
      email: 'john@gmail.com',
      passwordHash: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john@gmail.com',
        password: '123456',
      });

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    );
  });
});
