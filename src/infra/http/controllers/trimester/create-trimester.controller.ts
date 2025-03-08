import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTrimesterUseCase } from '@/domain/ebd/application/use-cases/trimester/create-trimester';
import { CreateTrimesterDto } from './dtos/create-trimester.dto';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole as Role } from '@/domain/ebd/enterprise/user';
import { Roles } from '@/infra/auth/role-decorator';

@ApiTags('trimester')
@ApiBearerAuth()
@Controller('/trimester')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.PEDAGOGICAL_DEPARTMENT,
  Role.SECRETARY,
  Role.SHEPHERD,
  Role.SUPERINTENDENT,
)
export class CreateTrimesterController {
  constructor(private createTrimester: CreateTrimesterUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateTrimesterDto) {
    const { title, year, quarter, startDate, endDate } = body;

    const result = await this.createTrimester.execute({
      title,
      year,
      quarter,
      startDate,
      endDate,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return;
  }
}
