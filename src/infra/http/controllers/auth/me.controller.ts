import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUserDetailsUseCase } from '@/domain/ebd/application/use-cases/user/get-user-details';
import { UserPresenter } from '../../presenters/user-presenter';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('/me')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeController {
  constructor(private usersRepository: GetUserDetailsUseCase) {}

  @Get()
  async handle(@CurrentUser() userLogged: UserPayload) {
    const userId = userLogged.sub;

    const result = await this.usersRepository.execute({
      userId,
    });

    if (result.isLeft()) {
      throw new NotFoundException();
    }

    const { user } = result.value;

    return { user: UserPresenter.toHTTP(user) };
  }
}
