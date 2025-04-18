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
import { CreatePreLessonUseCase } from '@/domain/ebd/application/use-cases/lesson/create-pre-lesson';
import { CreatePreLessonDto } from './dtos/create-pre-lesson.dto';
import { PreLessonWithSameNumberLessonAlreadyExistsOnTrimesterError } from '@/domain/ebd/application/use-cases/lesson/_erros/pre-lesson-with-same-number-lesson-already-exists-on-trimester-error';

@ApiTags('lesson')
@ApiBearerAuth()
@Controller('/pre-lesson')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SECRETARY, Role.SHEPHERD, Role.SUPERINTENDENT)
export class CreatePreLessonController {
  constructor(private createPreLesson: CreatePreLessonUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreatePreLessonDto) {
    const { date, numberLesson, trimesterId } = body;

    const result = await this.createPreLesson.execute({
      date,
      numberLesson,
      trimesterId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case PreLessonWithSameNumberLessonAlreadyExistsOnTrimesterError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value.prelesson;
  }
}
