import { AttendanceRepository } from '@/domain/ebd/application/repositories/attendance-repository';
import { Attendance } from '@/domain/ebd/enterprise/attendance';

export class InMemoryAttendanceRepository implements AttendanceRepository {
  public items: Attendance[] = [];

  async create(attendance: Attendance): Promise<void> {
    this.items.push(attendance);
  }
}
