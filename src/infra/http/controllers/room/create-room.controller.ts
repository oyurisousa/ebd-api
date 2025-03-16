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
import { CreateRoomUseCase } from '@/domain/ebd/application/use-cases/room/create-room';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole as Role } from '@/domain/ebd/enterprise/user';
import { Roles } from '@/infra/auth/role-decorator';
import { CreateRoomDto } from './dtos/create-room.dto';
import { AgeGroup } from '@/domain/ebd/enterprise/value-objects/age-group';
import { RoomAlreadyExistsError } from '@/domain/ebd/application/use-cases/room/_errors/room-already-exists-error';

@ApiTags('room')
@ApiBearerAuth()
@Controller('/room')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.PEDAGOGICAL_DEPARTMENT,
  Role.SECRETARY,
  Role.SHEPHERD,
  Role.SUPERINTENDENT,
)
export class CreateRoomController {
  constructor(private createRoom: CreateRoomUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateRoomDto) {
    const { name, minAge, maxAge } = body;

    const result = await this.createRoom.execute({
      name,
      ageGroup: AgeGroup.create(minAge, maxAge),
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

    return result.value.room;
  }
}
