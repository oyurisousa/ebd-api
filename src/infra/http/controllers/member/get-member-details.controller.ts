import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetMemberDetailsUseCase } from '@/domain/ebd/application/use-cases/member/get-member-details';
import { MemberPresenter } from '../../presenters/member-presenter';
import { GetMemberDetailsResponseDto } from './dtos/get-member-details.dto';

@ApiTags('member')
@ApiBearerAuth()
@ApiOkResponse({
  description: 'Successfully authenticated. Returns member details.',
  type: GetMemberDetailsResponseDto,
  schema: {
    example: {
      member: {
        id: 'b7ad057c-e80a-4dd0-8eb6-d3f30aad3cec',
        name: 'francisco',
        birthDate: '1990-01-01',
        sex: 'MALE',
        createdAt: '2025-02-23T21:13:18.681Z',
        updatedAt: '2025-03-07T18:24:47.335Z',
      },
    },
  },
})
@ApiBadRequestResponse({
  description: 'A bad request error occurred.',
})
@Controller('/member')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetMemberDetailsController {
  constructor(private getMemberDetails: GetMemberDetailsUseCase) {}

  @Get(':id')
  async handle(@Param('id') id: string) {
    const result = await this.getMemberDetails.execute({
      memberId: id,
    });

    if (result.isLeft()) {
      throw new NotFoundException();
    }

    const member = result.value.member;

    return { member: MemberPresenter.toHTTP(member) };
  }
}
