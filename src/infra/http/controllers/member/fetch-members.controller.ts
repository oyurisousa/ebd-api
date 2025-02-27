import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FetchMembersUseCase } from '@/domain/ebd/application/use-cases/member/fetch-members';
import { FetchMembersDto } from './dtos/fetch-members.dto';
import { MemberPresenter } from '../../presenters/member-presenter';

@ApiTags('member')
@ApiBearerAuth()
@Controller('/member')
export class FetchMembersController {
  constructor(private fetchMembers: FetchMembersUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchMembersDto) {
    const { page, name, birthDate, sex, perPage } = queryParams;

    const result = await this.fetchMembers.execute({
      page,
      perPage,
      name,
      birthDate,
      sex,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { members, meta } = result.value;

    return { members: members.map(MemberPresenter.toHTTP), meta };
  }
}
