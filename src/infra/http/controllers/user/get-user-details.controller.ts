import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUserDetailsUseCase } from '@/domain/ebd/application/use-cases/user/get-user-details';
import { UserPresenter } from '../../presenters/user-presenter';
import { GetUserDetailsResponseDto } from './dtos/get-user-details-dto';

@ApiTags('user')
@ApiBearerAuth()
@ApiOkResponse({
  description: 'Successfully authenticated. Returns user details.',
  type: GetUserDetailsResponseDto,
  schema: {
    example: {
      user: {
        id: 'b7ad057c-e80a-4dd0-8eb6-d3f30aad3cec',
        email: 'test@gmail.com',
        role: 'SHEPHERD',
        username: 'test',
        isMember: true,
        memberId: '0ad0847f-cee7-4770-b7f2-1df56972c72c',
        createdAt: '2025-02-23T21:13:18.681Z',
        updatedAt: '2025-03-07T18:24:47.335Z',
      },
    },
  },
})
@ApiUnauthorizedResponse({
  description: 'Authentication failed.',
})
@ApiBadRequestResponse({
  description: 'A bad request error occurred.',
})
@Controller('/user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetUserDetailsController {
  constructor(private getUserDetails: GetUserDetailsUseCase) {}

  @Get(':id')
  async handle(@Param('id') id: string) {
    const result = await this.getUserDetails.execute({
      userId: id,
    });

    if (result.isLeft()) {
      throw new NotFoundException();
    }

    const user = result.value.user;

    return { user: UserPresenter.toHTTP(user) };
  }
}
