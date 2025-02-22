import { MembersRepository } from '@/domain/ebd/application/repositories/members-repository';
import { Member } from '@/domain/ebd/enterprise/member';
import { Injectable } from '@nestjs/common';
import { PrismaMemberMapper } from '../mappers/prisma-member-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaMembersRepository implements MembersRepository {
  constructor(private prisma: PrismaService) {}

  async create(member: Member): Promise<void> {
    const data = PrismaMemberMapper.toPrisma(member);
    await this.prisma.member.create({
      data,
    });
  }

  async findById(id: string): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: {
        id,
      },
    });

    if (!member) return null;

    return PrismaMemberMapper.toDomain(member);
  }
}
