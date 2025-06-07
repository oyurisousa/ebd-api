import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole as Role } from '@/domain/ebd/enterprise/user';
import { Roles } from '@/infra/auth/role-decorator';
import { CreateLessonUseCase } from '@/domain/ebd/application/use-cases/lesson/create-lesson';
import { CreateLessonDto } from './dtos/create-lesson.dto';

@ApiTags('lesson')
@ApiBearerAuth()
@Controller('/lesson')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SECRETARY, Role.SHEPHERD, Role.SUPERINTENDENT, Role.TEACHER)
export class CreateLessonController {
  constructor(private createLesson: CreateLessonUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateLessonDto) {
    const {
      bibles,
      magazines,
      offers,
      preLessonId,
      studentsAttendance,
      title,
      trimesterRoomId,
      visitors,
    } = body;

    const result = await this.createLesson.execute({
      bibles,
      magazines,
      offers,
      preLessonId,
      studentsAttendance,
      title,
      trimesterRoomId,
      visitors,
    });

    // if (result.isLeft()) {
    //   const error = result.value;

    //   switch (error.constructor) {
    //     case PreLessonWithSameNumberLessonAlreadyExistsOnTrimesterError:
    //       throw new ConflictException(error.message);
    //     default:
    //       throw new BadRequestException(error.message);
    //   }
    // }

    return result.value?.lesson;
  }
}
