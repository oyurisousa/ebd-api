import { Trimester } from '@/domain/ebd/enterprise/trimester';
import { Injectable } from '@nestjs/common';
import { PrismaTrimesterMapper } from '../mappers/prisma-trimester-mapper';
import { PrismaService } from '../prisma.service';
import { TrimestersRepository } from '@/domain/ebd/application/repositories/trimester-repository';

@Injectable()
export class PrismaTrimestersRepository implements TrimestersRepository {
  constructor(private prisma: PrismaService) {}

  async create(trimester: Trimester): Promise<void> {
    const data = PrismaTrimesterMapper.toPrisma(trimester);
    await this.prisma.trimester.create({
      data,
    });
  }

  async findById(id: string): Promise<Trimester | null> {
    const trimester = await this.prisma.trimester.findUnique({
      where: {
        id,
      },
    });

    if (!trimester) return null;

    return PrismaTrimesterMapper.toDomain(trimester);
  }
}
