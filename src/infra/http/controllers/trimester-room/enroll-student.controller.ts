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
import { TrimesterRoomNotFoundError } from '@/domain/ebd/application/use-cases/trimester-room/_erros/trimester-room-not-found-error';
import { EnrollStudentUseCase } from '@/domain/ebd/application/use-cases/trimester-room/enroll-student';
import { EnrollStudentDto } from './dtos/enroll-student.dto';
import { MemberNotFoundError } from '@/domain/ebd/application/use-cases/member/_errors/member-not-found-error';

@ApiTags('trimester-room')
@ApiBearerAuth()
@Controller('/trimester-room/enroll/student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.PEDAGOGICAL_DEPARTMENT,
  Role.SECRETARY,
  Role.SHEPHERD,
  Role.SUPERINTENDENT,
  Role.TEACHER,
)
export class EnrollStudentController {
  constructor(private enrollStudentDto: EnrollStudentUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: EnrollStudentDto) {
    const { studentsIds, trimesterRoomId } = body;

    const result = await this.enrollStudentDto.execute({
      studentsIds,
      trimesterRoomId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case TrimesterRoomNotFoundError:
        case MemberNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return;
  }
}
