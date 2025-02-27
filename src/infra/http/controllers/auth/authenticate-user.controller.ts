import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '@/infra/auth/public';
import { AuthenticateUserUseCase } from '@/domain/ebd/application/use-cases/auth/authenticate-user';
import {
  AuthenticateResponseDto,
  AuthenticateUserDTO,
} from './dtos/authenticate-user.dto';
import { WrongCredentialsError } from '@/domain/ebd/application/use-cases/auth/_errors/wrong-credentials-error';

@ApiTags('auth')
@Controller('/auth/login')
@Public()
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @HttpCode(200)
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated. Returns an access token.',
    type: AuthenticateResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication failed due to wrong credentials.',
  })
  @ApiBadRequestResponse({
    description: 'A bad request error occurred.',
  })
  async handle(@Body() body: AuthenticateUserDTO) {
    const { username, password } = body;

    const result = await this.authenticateUser.execute({
      username,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
