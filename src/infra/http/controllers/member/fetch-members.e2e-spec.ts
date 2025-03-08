import { UserRole } from '@/domain/ebd/enterprise/user';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MemberFactory } from 'test/factories/make-member';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Members (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let memberFactory: MemberFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MemberFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    memberFactory = moduleRef.get(MemberFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /member', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('member01_9'),
    });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    await Promise.all([
      memberFactory.makePrismaMember({
        name: 'member 1',
      }),
      memberFactory.makePrismaMember({
        name: 'member 2',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/member')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        name: 'member',
      })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        members: expect.arrayContaining([
          expect.objectContaining({ name: 'member 1' }),
          expect.objectContaining({ name: 'member 2' }),
        ]),
      }),
    );
  });
});
