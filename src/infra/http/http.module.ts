import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { RegisterUserUseCase } from '@/domain/ebd/application/use-cases/user/register-user';
import { CreateAccountUserController } from './controllers/user/register-user.controller';
import { CreateMemberController } from './controllers/member/create-member.controller';
import { CreateMemberUseCase } from '@/domain/ebd/application/use-cases/member/create-member';
import { AuthenticateUserController } from './controllers/auth/authenticate-user.controller';
import { AuthenticateUserUseCase } from '@/domain/ebd/application/use-cases/auth/authenticate-user';
import { FetchMembersController } from './controllers/member/fetch-members.controller';
import { FetchMembersUseCase } from '@/domain/ebd/application/use-cases/member/fetch-members';
import { GetUserDetailsController } from './controllers/user/get-user-details.controller';
import { GetUserDetailsUseCase } from '@/domain/ebd/application/use-cases/user/get-user-details';
import { CreateTrimesterController } from './controllers/trimester/create-trimester.controller';
import { CreateTrimesterUseCase } from '@/domain/ebd/application/use-cases/trimester/create-trimester';
import { CreateRoomController } from './controllers/room/create-room.controller';
import { CreateRoomUseCase } from '@/domain/ebd/application/use-cases/room/create-room';
import { CreateTrimesterRoomController } from './controllers/trimester-room/create-trimester-room.controller';
import { CreateTrimesterRoomUseCase } from '@/domain/ebd/application/use-cases/trimester-room/create-trimester-room';
import { AllocateTeacherController } from './controllers/trimester-room/allocate-teacher.controller';
import { AllocateTeacherUseCase } from '@/domain/ebd/application/use-cases/trimester-room/allocate-teacher';
import { MeController } from './controllers/auth/me.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateUserController,
    AllocateTeacherController,
    CreateAccountUserController,
    CreateMemberController,
    CreateTrimesterController,
    CreateRoomController,
    CreateTrimesterRoomController,
    GetUserDetailsController,
    FetchMembersController,
    MeController,
  ],
  providers: [
    AuthenticateUserUseCase,
    AllocateTeacherUseCase,
    RegisterUserUseCase,
    CreateMemberUseCase,
    CreateTrimesterUseCase,
    CreateRoomUseCase,
    CreateTrimesterRoomUseCase,
    GetUserDetailsUseCase,
    FetchMembersUseCase,
  ],
})
export class HttpModule {}
