import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FetchRoomsUseCase } from '@/domain/ebd/application/use-cases/room/fetch-rooms';
import { FetchRoomsDto } from './dtos/fetch-rooms.dto';
import { RoomPresenter } from '../../presenters/room-presenter';

@ApiTags('room')
@ApiBearerAuth()
@Controller('/room')
export class FetchRoomsController {
  constructor(private fetchRooms: FetchRoomsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchRoomsDto) {
    const { page, name, perPage } = queryParams;

    const result = await this.fetchRooms.execute({
      page,
      perPage,
      name,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { rooms, meta } = result.value;

    return { rooms: rooms.map(RoomPresenter.toHTTP), meta };
  }
}
