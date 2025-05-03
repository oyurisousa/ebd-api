import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FetchUsersUseCase } from '@/domain/ebd/application/use-cases/user/fetch-users';
import { UserPresenter } from '../../presenters/user-presenter';
import { FetchUsersDto } from './dtos/fetch-users.dto';

@ApiTags('user')
@ApiBearerAuth()
@Controller('/user')
export class FetchUsersController {
  constructor(private fetchUsers: FetchUsersUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchUsersDto) {
    const { page, perPage, content, role } = queryParams;

    const result = await this.fetchUsers.execute({
      page,
      perPage,
      content,
      role,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { users, meta } = result.value;

    return { users: users.map(UserPresenter.toHTTP), meta };
  }
}
