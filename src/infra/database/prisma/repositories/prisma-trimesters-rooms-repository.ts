import { TrimestersRoomsRepository } from '@/domain/ebd/application/repositories/trimester-room-repository';
import { TrimesterRoom } from '@/domain/ebd/enterprise/trimester-room';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaTrimesterRoomMapper } from '../mappers/prisma-trimester-room-mapper';
import { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
import { Prisma } from '@prisma/client';
import { TrimesterRoomWithRoom } from '@/domain/ebd/enterprise/value-objects/trimester-room-with-room';

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

  async findById(id: string): Promise<TrimesterRoom | null> {
    const trimesterRoom = await this.prisma.trimesterRoom.findUnique({
      where: {
        id,
      },
    });

    if (!trimesterRoom) {
      return null;
    }

    return PrismaTrimesterRoomMapper.toDomain(trimesterRoom);
  }
  async addTeachers(
    teachersIds: string[],
    trimesterRoomId: string,
  ): Promise<TrimesterRoom> {
    const trimesterRoom = await this.prisma.trimesterRoom.update({
      where: {
        id: trimesterRoomId,
      },
      data: {
        teachers: {
          connect: teachersIds.map((id) => ({ id })),
        },
      },
    });

    return PrismaTrimesterRoomMapper.toDomain(trimesterRoom);
  }

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    trimesterId: string,
  ): Promise<{
    trimestersRooms: TrimesterRoomWithRoom[];
    meta: Meta;
  }> {
    const whereClause: Prisma.TrimesterRoomWhereInput = {
      trimesterId: {
        equals: trimesterId,
      },
    };

    const [trimestersRooms, totalCount] = await Promise.all([
      this.prisma.trimesterRoom.findMany({
        where: whereClause,
        include: {
          room: {
            select: {
              name: true,
            },
          },
          registrations: true,
          teachers: true,
        },
        take: perPage,
        skip: (page - 1) * perPage,
        orderBy: {
          room: {
            name: 'desc',
          },
        },
      }),
      this.prisma.trimesterRoom.count({
        where: whereClause,
      }),
    ]);

    const trimestersRoomsMapped = trimestersRooms.map((trimesterRoom) => {
      const trimesterRoomMapped =
        PrismaTrimesterRoomMapper.toDomain(trimesterRoom);

      return TrimesterRoomWithRoom.create({
        registrationsIds: trimesterRoomMapped.registrationsIds,
        name: trimesterRoom.room.name,
        roomId: trimesterRoomMapped.roomId,
        teachersIds: trimesterRoomMapped.teachersIds,
        trimesterId: trimesterRoomMapped.trimesterId,
        trimesterRoomId: trimesterRoomMapped.id,
      });
    });

    return {
      trimestersRooms: trimestersRoomsMapped,
      meta: {
        page,
        totalCount,
        totalPage: trimestersRooms.length,
      },
    };
  }
}
