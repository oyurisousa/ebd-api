import { UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';

describe('Get User Details (E2E)', () => {
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

  test('[GET] /user/:id', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.TEACHER,
      username: Username.create('moises1_000'),
    });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const response = await request(app.getHttpServer())
      .get(`/user/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({ email: user.email }),
    );
  });
});
