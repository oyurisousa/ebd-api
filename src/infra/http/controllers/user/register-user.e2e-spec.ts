import { UserRole } from '@/domain/ebd/enterprise/user';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { EnvModule } from '@/infra/env/env.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';
describe('Register User (E2E)', () => {
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

  test('[POST] /auth/register', async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        username: 'john_all01',
        email: 'john@gmail.com',
        password: '123456',
        role: UserRole.SHEPHERD,
      });

    expect(response.statusCode).toBe(201);

    const userOnDataBase = await prisma.user.findUnique({
      where: {
        email: 'john@gmail.com',
      },
    });

    expect(userOnDataBase).toBeTruthy();
  });
});
