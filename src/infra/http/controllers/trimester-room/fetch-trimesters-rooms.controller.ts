import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FetchTrimesterRoomsUseCase } from '@/domain/ebd/application/use-cases/trimester-room/fetch-trimester-room';
import { FetchTrimestersRoomsDto } from './dtos/fetch-trimesters-rooms.dto';
import { TrimesterRoomPresenter } from '../../presenters/trimester-room-presenter';

@ApiTags('trimester-room')
@ApiBearerAuth()
@Controller('/trimester-room')
export class FetchTrimesterRoomsController {
  constructor(private fetchTrimesterRooms: FetchTrimesterRoomsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchTrimestersRoomsDto) {
    const { page, perPage, trimesterId } = queryParams;

    const result = await this.fetchTrimesterRooms.execute({
      page,
      perPage,
      trimesterId,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { trimestersRooms, meta } = result.value;
    return {
      trimestersRooms: trimestersRooms.map(TrimesterRoomPresenter.toHTTP),
      meta,
    };
  }
}
