import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FetchRegistrationsUseCase } from '@/domain/ebd/application/use-cases/registration/fetch-registrations';
import { FetchRegistrationsDto } from './dtos/fetch-registration.dto';
import { RegistrationPresenter } from '../../presenters/registration-presenter';

@ApiTags('registration')
@ApiBearerAuth()
@Controller('/registration')
export class FetchRegistrationsController {
  constructor(private fetchRegistrations: FetchRegistrationsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchRegistrationsDto) {
    const { page, perPage, trimesterRoomId, name } = queryParams;

    const result = await this.fetchRegistrations.execute({
      page,
      perPage,
      trimesterRoomId,
      name,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { registrations, meta } = result.value;
    return {
      registrations: registrations.map(RegistrationPresenter.toHTTP),
      meta,
    };
  }
}
