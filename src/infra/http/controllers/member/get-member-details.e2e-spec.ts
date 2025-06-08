import { Sex } from '@/domain/ebd/enterprise/member';
import { UserRole } from '@/domain/ebd/enterprise/user';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MemberFactory } from 'test/factories/make-member';
import { UserFactory } from 'test/factories/make-user';

describe('Get Member Details (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;
  let memberFactory: MemberFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, MemberFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);
    memberFactory = moduleRef.get(MemberFactory);

    await app.init();
  });

  test('[GET] /member/:id', async () => {
    const user = await userFactory.makePrismaUser({ role: UserRole.TEACHER });

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role });

    const member = await memberFactory.makePrismaMember({
      name: 'Francisca',
      birthDate: new Date('1990-01-01'),
      sex: Sex.FEMALE,
    });

    const response = await request(app.getHttpServer())
      .get(`/member/${member.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.member).toEqual(
      expect.objectContaining({ name: member.name }),
    );
  });
});
