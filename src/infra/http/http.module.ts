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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateUserController,
    CreateAccountUserController,
    CreateMemberController,
    FetchMembersController,
  ],
  providers: [
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    CreateMemberUseCase,
    FetchMembersUseCase,
  ],
})
export class HttpModule {}
