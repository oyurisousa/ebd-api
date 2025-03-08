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
describe('Create Trimester (E2E)', () => {
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

  test('[POST] /trimester', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SUPERINTENDENT,
      username: Username.create('john3_16'),
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const response = await request(app.getHttpServer())
      .post('/trimester')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: '4º Trimestre',
        year: 2024,
        quarter: 4,
        startDate: new Date(2024, 9, 1),
        endDate: new Date(2024, 11, 18),
      });

    expect(response.statusCode).toBe(201);

    const userOnDataBase = await prisma.trimester.findFirst({
      where: {
        year: 2024,
      },
    });

    expect(userOnDataBase).toBeTruthy();
  });
});
