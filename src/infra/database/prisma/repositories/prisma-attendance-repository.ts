import { AttendanceRepository } from '@/domain/ebd/application/repositories/attendance-repository';
import { Attendance } from '@/domain/ebd/enterprise/attendance';
import { PrismaAttendanceMapper } from '../mappers/prisma-attendance-mapper';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAttendanceRepository implements AttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(attendance: Attendance): Promise<void> {
    const data = PrismaAttendanceMapper.toPrisma(attendance);
    await this.prisma.attendance.create({
      data,
    });
  }
}
