import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { RegisterUserUseCase } from '@/domain/ebd/application/use-cases/user/register-user';
import { CreateAccountUserController } from './controllers/user/register-user.controller';
import { CreateMemberController } from './controllers/member/create-member.controller';
import { CreateMemberUseCase } from '@/domain/ebd/application/use-cases/member/create-member';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountUserController, CreateMemberController],
  providers: [RegisterUserUseCase, CreateMemberUseCase],
})
export class HttpModule {}
