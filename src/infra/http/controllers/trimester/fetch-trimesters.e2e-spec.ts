import { UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TrimesterFactory } from 'test/factories/make-trimester';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Trimesters (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let trimesterFactory: TrimesterFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TrimesterFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    trimesterFactory = moduleRef.get(TrimesterFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /trimester', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('trimester01_9'),
    });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    await Promise.all([
      trimesterFactory.makePrismaTrimester({
        title: '2025.1',
        startDate: new Date(2025, 0, 1),
        endDate: new Date(2025, 2, 31),
        quarter: 1,
        year: 2025,
      }),
      trimesterFactory.makePrismaTrimester({
        title: '2025.2',
        startDate: new Date(2025, 3, 1),
        endDate: new Date(2025, 5, 31),
        quarter: 2,
        year: 2025,
      }),
      trimesterFactory.makePrismaTrimester({
        title: '2025.3',
        startDate: new Date(2025, 6, 1),
        endDate: new Date(2025, 8, 31),
        quarter: 3,
        year: 2025,
      }),
      trimesterFactory.makePrismaTrimester({
        title: '2025.4',
        startDate: new Date(2025, 9, 1),
        endDate: new Date(2025, 11, 31),
        quarter: 4,
        year: 2025,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/trimester')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        title: '2025',
        quarter: 3,
        year: 2025,
      })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        trimesters: expect.arrayContaining([
          expect.objectContaining({ title: '2025.3' }),
        ]),
      }),
    );
  });
});
