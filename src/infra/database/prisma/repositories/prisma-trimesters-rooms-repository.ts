import { TrimestersRoomsRepository } from '@/domain/ebd/application/repositories/trimester-room-repository';
import { TrimesterRoom } from '@/domain/ebd/enterprise/trimester-room';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaTrimesterRoomMapper } from '../mappers/prisma-trimester-room-mapper';

@Injectable()
export class PrismaTrimestersRoomsRepository
  implements TrimestersRoomsRepository
{
  constructor(private readonly prisma: PrismaService) {}
  async create(trimesterRoom: TrimesterRoom): Promise<void> {
    const data = PrismaTrimesterRoomMapper.toPrisma(trimesterRoom);

    await this.prisma.trimesterRoom.create({
      data,
    });
  }

  async findByTrimesterIdAndRooId(
    trimesterId: string,
    roomId: string,
  ): Promise<TrimesterRoom | null> {
    const trimesterRoom = await this.prisma.trimesterRoom.findUnique({
      where: {
        roomId_trimesterId: {
          roomId,
          trimesterId,
        },
      },
    });

    if (!trimesterRoom) {
      return null;
    }

    return PrismaTrimesterRoomMapper.toDomain(trimesterRoom);
  }
}
