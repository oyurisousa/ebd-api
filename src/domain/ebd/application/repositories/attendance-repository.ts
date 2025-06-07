import { Attendance } from '../../enterprise/attendance';

export abstract class AttendanceRepository {
  abstract create(attendance: Attendance): Promise<void>;
}
