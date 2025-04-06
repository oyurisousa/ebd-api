import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FetchTrimestersUseCase } from '@/domain/ebd/application/use-cases/trimester/fetch-trimesters';
import { FetchTrimestersDto } from './dtos/fetch-trimesters.dto';
import { TrimesterPresenter } from '../../presenters/trimester-presenter';

@ApiTags('trimester')
@ApiBearerAuth()
@Controller('/trimester')
export class FetchTrimestersController {
  constructor(private fetchTrimesters: FetchTrimestersUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchTrimestersDto) {
    const { page, perPage, quarter, title, year } = queryParams;

    const result = await this.fetchTrimesters.execute({
      page,
      perPage,
      title,
      quarter,
      year,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { trimesters, meta } = result.value;

    return { trimesters: trimesters.map(TrimesterPresenter.toHTTP), meta };
  }
}
