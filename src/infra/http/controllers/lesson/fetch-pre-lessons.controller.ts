import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FetchPreLessonsUseCase } from '@/domain/ebd/application/use-cases/pre-lesson/fetch-pre-lessons';
import { FetchPreLessonsDto } from './dtos/fetch-pre-lessons.dto';
import { PreLessonPresenter } from '../../presenters/pre-lesson-presenter';

@ApiTags('pre-lesson')
@ApiBearerAuth()
@Controller('/pre-lesson')
export class FetchPreLessonsController {
  constructor(private fetchPreLessons: FetchPreLessonsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query() queryParams: FetchPreLessonsDto) {
    const { page, perPage, trimesterId, date, numberLesson, inProgress } =
      queryParams;

    const result = await this.fetchPreLessons.execute({
      page,
      perPage,
      trimesterId,
      date,
      numberLesson,
      inProgress,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { preLessons, meta } = result.value;
    const preLessonsMapped = preLessons.map(PreLessonPresenter.toHTTP);
    return { preLessons: preLessonsMapped, meta };
  }
}
