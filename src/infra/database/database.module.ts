import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from '@/domain/ebd/application/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { MembersRepository } from '@/domain/ebd/application/repositories/members-repository';
import { PrismaMembersRepository } from './prisma/repositories/prisma-members-repository';
import { TrimestersRepository } from '@/domain/ebd/application/repositories/trimester-repository';
import { PrismaTrimestersRepository } from './prisma/repositories/prisma-trimester-repository';
import { RoomsRepository } from '@/domain/ebd/application/repositories/rooms-repository';
import { PrismaRoomsRepository } from './prisma/repositories/prisma-rooms-repository';
import { TrimestersRoomsRepository } from '@/domain/ebd/application/repositories/trimester-room-repository';
import { PrismaTrimestersRoomsRepository } from './prisma/repositories/prisma-trimesters-rooms-repository';
import { RegistrationsRepository } from '@/domain/ebd/application/repositories/registrations-repository';
import { PrismaRegistrationsRepository } from './prisma/repositories/prisma-registrations-repository';
import { PreLessonRepository } from '@/domain/ebd/application/repositories/pre-lesson-repository';
import { PrismaPreLessonRepository } from './prisma/repositories/prisma-pre-lesson-repository';
import { PrismaLessonRepository } from './prisma/repositories/prisma-lesson-repository';
import { LessonsRepository } from '@/domain/ebd/application/repositories/lessons-repository';
import { AttendanceRepository } from '@/domain/ebd/application/repositories/attendance-repository';
import { PrismaAttendanceRepository } from './prisma/repositories/prisma-attendance-repository';

@Module({
  providers: [
    PrismaService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
    { provide: MembersRepository, useClass: PrismaMembersRepository },
    { provide: TrimestersRepository, useClass: PrismaTrimestersRepository },
    { provide: RoomsRepository, useClass: PrismaRoomsRepository },
    {
      provide: TrimestersRoomsRepository,
      useClass: PrismaTrimestersRoomsRepository,
    },
    {
      provide: RegistrationsRepository,
      useClass: PrismaRegistrationsRepository,
    },
    {
      provide: PreLessonRepository,
      useClass: PrismaPreLessonRepository,
    },
    {
      provide: LessonsRepository,
      useClass: PrismaLessonRepository,
    },
    {
      provide: AttendanceRepository,
      useClass: PrismaAttendanceRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    MembersRepository,
    TrimestersRepository,
    RoomsRepository,
    TrimestersRoomsRepository,
    RegistrationsRepository,
    PreLessonRepository,
    LessonsRepository,
    AttendanceRepository,
  ],
})
export class DatabaseModule {}
