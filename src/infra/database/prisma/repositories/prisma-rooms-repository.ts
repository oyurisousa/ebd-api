import { RoomsRepository } from '@/domain/ebd/application/repositories/rooms-repository';
import { Room } from '@/domain/ebd/enterprise/room';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaRoomMapper } from '../mappers/prisma-room-mapper';

@Injectable()
export class PrismaRoomsRepository implements RoomsRepository {
  constructor(private prisma: PrismaService) {}

  async create(room: Room): Promise<void> {
    const data = PrismaRoomMapper.toPrisma(room);
    await this.prisma.room.create({
      data,
    });
  }

  async findById(id: string): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (!room) return null;

    return PrismaRoomMapper.toDomain(room);
  }

  async findByName(name: string): Promise<Room | null> {
    const room = await this.prisma.room.findFirst({
      where: {
        name,
      },
    });

    if (!room) return null;

    return PrismaRoomMapper.toDomain(room);
  }
}
