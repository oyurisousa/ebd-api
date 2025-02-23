import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMemberUseCase } from '@/domain/ebd/application/use-cases/member/create-member';
import { CreateMemberDto } from './dtos/create-member.dto';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole as Role } from '@/domain/ebd/enterprise/user';
import { Roles } from '@/infra/auth/role-decorator';

@ApiTags('member')
@ApiBearerAuth()
@Controller('/member')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.PEDAGOGICAL_DEPARTMENT,
  Role.SECRETARY,
  Role.SHEPHERD,
  Role.SUPERINTENDENT,
  Role.TEACHER,
)
export class CreateMemberController {
  constructor(private createMember: CreateMemberUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateMemberDto) {
    const { birthDate, name, sex } = body;

    const result = await this.createMember.execute({
      birthDate,
      name,
      sex,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return result.value.member;
  }
}
