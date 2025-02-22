import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from '@/domain/ebd/application/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { MembersRepository } from '@/domain/ebd/application/repositories/members-repository';
import { PrismaMembersRepository } from './prisma/repositories/prisma-members-repository';

@Module({
  providers: [
    PrismaService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
    { provide: MembersRepository, useClass: PrismaMembersRepository },
  ],
  exports: [PrismaService, UsersRepository, MembersRepository],
})
export class DatabaseModule {}
