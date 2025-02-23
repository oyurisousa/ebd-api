import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@/infra/auth/public';
import { RegisterUserUseCase } from '@/domain/ebd/application/use-cases/user/register-user';
import { CreateUserDto } from './dtos/register-user.dto';
import { MemberNotFoundError } from '@/domain/ebd/application/use-cases/member/_errors/member-not-found-error';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('/auth/register')
@Public()
export class CreateAccountUserController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateUserDto) {
    const { username, email, password, role, memberId } = body;

    const result = await this.registerUser.execute({
      username,
      email,
      password,
      role,
      memberId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case MemberNotFoundError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value.user;
  }
}
