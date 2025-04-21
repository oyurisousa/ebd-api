import { Sex } from '@/domain/ebd/enterprise/member';
import { UserRole } from '@/domain/ebd/enterprise/user';
import { AgeGroup } from '@/domain/ebd/enterprise/value-objects/age-group';
import { Username } from '@/domain/ebd/enterprise/value-objects/username';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { EnvModule } from '@/infra/env/env.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MemberFactory } from 'test/factories/make-member';
import { RoomFactory } from 'test/factories/make-room';
import { TrimesterFactory } from 'test/factories/make-trimester';
import { TrimesterRoomFactory } from 'test/factories/make-trimester-room';
import { UserFactory } from 'test/factories/make-user';
describe('Allocate a Teacher (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let roomFactory: RoomFactory;
  let trimesterFactory: TrimesterFactory;
  let trimesterRoomFactory: TrimesterRoomFactory;
  let memberFactory: MemberFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [
        UserFactory,
        TrimesterFactory,
        RoomFactory,
        TrimesterRoomFactory,
        MemberFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    roomFactory = moduleRef.get(RoomFactory);
    trimesterFactory = moduleRef.get(TrimesterFactory);
    trimesterRoomFactory = moduleRef.get(TrimesterRoomFactory);
    memberFactory = moduleRef.get(MemberFactory);

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /trimester-room/allocate/teacher', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.SECRETARY,
      username: Username.create('john1000'),
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const member = await memberFactory.makePrismaMember({
      name: 'Maria de Jesus',
      birthDate: new Date('2000-01-01'),
      sex: Sex.FEMALE,
    });

    const teacher = await userFactory.makePrismaUser({
      role: UserRole.TEACHER,
      username: Username.create('maria_de_jesus'),
      memberId: member.id,
    });

    const member2 = await memberFactory.makePrismaMember({
      name: 'Pedro',
      birthDate: new Date('2000-01-01'),
      sex: Sex.FEMALE,
    });

    const teacher2 = await userFactory.makePrismaUser({
      role: UserRole.TEACHER,
      username: Username.create('pedro_3x'),
      memberId: member2.id,
    });

    const trimester = await trimesterFactory.makePrismaTrimester({
      title: '2025.1',
    });

    const room = await roomFactory.makePrismaRoom({
      name: 'juniores',
      ageGroup: AgeGroup.create(7, 11),
    });

    const trimesterRoom = await trimesterRoomFactory.makePrismaTrimesterRoom({
      roomId: room.id,
      trimesterId: trimester.id,
    });

    const response = await request(app.getHttpServer())
      .post('/trimester-room/allocate/teacher')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        trimesterRoomId: trimesterRoom.id.toString(),
        teachersIds: [teacher.id.toString(), teacher2.id.toString()],
      });

    expect(response.statusCode).toBe(201);

    const allocateOnDataBase = await prisma.trimesterRoom.findFirst({
      where: {
        id: trimesterRoom.id.toString(),
      },
      include: {
        teachers: true,
      },
    });

    expect(allocateOnDataBase).toBeTruthy();
    expect(allocateOnDataBase?.teachers).toHaveLength(2);
  });
});
