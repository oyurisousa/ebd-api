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
  ],
  exports: [
    PrismaService,
    UsersRepository,
    MembersRepository,
    TrimestersRepository,
    RoomsRepository,
    TrimestersRoomsRepository,
  ],
})
export class DatabaseModule {}
