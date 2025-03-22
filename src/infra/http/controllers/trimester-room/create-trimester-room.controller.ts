import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole as Role } from '@/domain/ebd/enterprise/user';
import { Roles } from '@/infra/auth/role-decorator';
import { RoomAlreadyExistsError } from '@/domain/ebd/application/use-cases/room/_errors/room-already-exists-error';
import { CreateTrimesterRoomUseCase } from '@/domain/ebd/application/use-cases/trimester-room/create-trimester-room';
import { CreateTrimesterRoomDto } from './dtos/create-trimester-room.dto';

@ApiTags('trimester-room')
@ApiBearerAuth()
@Controller('/trimester-room')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.PEDAGOGICAL_DEPARTMENT,
  Role.SECRETARY,
  Role.SHEPHERD,
  Role.SUPERINTENDENT,
)
export class CreateTrimesterRoomController {
  constructor(private createTrimesterRoomDto: CreateTrimesterRoomUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateTrimesterRoomDto) {
    const { roomId, trimesterId } = body;

    const result = await this.createTrimesterRoomDto.execute({
      roomId,
      trimesterId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case RoomAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return;
  }
}
