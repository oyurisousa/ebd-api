import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Attendance } from '@/domain/ebd/enterprise/attendance';
import { Attendance as PrismaAttendance, type Prisma } from '@prisma/client';

export class PrismaAttendanceMapper {
  static toDomain(raw: PrismaAttendance): Attendance {
    return Attendance.create(
      {
        lessonId: new UniqueEntityId(raw.lessonId),
        present: raw.present,
        registrationId: new UniqueEntityId(raw.registrationId),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(
    Attendance: Attendance,
  ): Prisma.AttendanceUncheckedCreateInput {
    return {
      id: Attendance.id.toString(),
      lessonId: Attendance.lessonId.toString(),
      registrationId: Attendance.registrationId.toString(),
      present: Attendance.present,
    };
  }
}
