import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole as Role } from '@/domain/ebd/enterprise/user';
import { Roles } from '@/infra/auth/role-decorator';
import { AllocateTeacherUseCase } from '@/domain/ebd/application/use-cases/trimester-room/allocate-teacher';
import { AllocateTeacherDto } from './dtos/allocate-teacher.dto';
import { TrimesterRoomNotFoundError } from '@/domain/ebd/application/use-cases/trimester-room/_erros/trimester-room-not-found-error';
import { UserNotFoundError } from '@/domain/ebd/application/use-cases/user/_errors/user-not-found-error';

@ApiTags('trimester-room')
@ApiBearerAuth()
@Controller('/trimester-room/allocate/teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.PEDAGOGICAL_DEPARTMENT,
  Role.SECRETARY,
  Role.SHEPHERD,
  Role.SUPERINTENDENT,
)
export class AllocateTeacherController {
  constructor(private allocateTeacherDto: AllocateTeacherUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: AllocateTeacherDto) {
    const { teachersIds, trimesterRoomId } = body;

    const result = await this.allocateTeacherDto.execute({
      teachersIds,
      trimesterRoomId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case TrimesterRoomNotFoundError:
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return;
  }
}
