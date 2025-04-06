import { RoomsRepository } from '@/domain/ebd/application/repositories/rooms-repository';
import { Room } from '@/domain/ebd/enterprise/room';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaRoomMapper } from '../mappers/prisma-room-mapper';
import { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
import { Prisma } from '@prisma/client';

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

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: { name?: string },
  ): Promise<{ rooms: Room[]; meta: Meta }> {
    const { name } = filters;

    const whereClause: Prisma.RoomWhereInput = {
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      }),
    };

    const [rooms, totalCount] = await Promise.all([
      this.prisma.room.findMany({
        where: whereClause,
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: {
          name: 'desc',
        },
      }),
      this.prisma.room.count({
        where: whereClause,
      }),
    ]);
    const roomsMapped = rooms.map((room) => {
      return PrismaRoomMapper.toDomain(room);
    });

    return {
      rooms: roomsMapped,
      meta: {
        page,
        totalCount,
        totalPage: rooms.length,
      },
    };
  }
}
