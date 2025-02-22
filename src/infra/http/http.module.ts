import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { RegisterUserUseCase } from '@/domain/ebd/application/use-cases/user/register-user';
import { CreateAccountUserController } from './controllers/user/register-user.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountUserController],
  providers: [RegisterUserUseCase],
})
export class HttpModule {}
