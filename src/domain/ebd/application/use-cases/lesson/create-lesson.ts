import { right, type Either } from '@/core/either';

import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Lesson } from '@/domain/ebd/enterprise/lesson';
import { LessonsRepository } from '../../repositories/lessons-repository';
import { Attendance } from '@/domain/ebd/enterprise/attendance';
import { AttendanceRepository } from '../../repositories/attendance-repository';

interface createLessonUseCaseRequest {
  trimesterRoomId: string;
  preLessonId: string;
  title: string;
  studentsAttendance: {
    registrationId: string;
    present: boolean;
  }[];
  visitors: number;
  bibles: number;
  magazines: number;
  offers: number;
}

type createLessonUseCaseResponse = Either<
  null,
  {
    lesson: Lesson;
  }
>;

@Injectable()
export class CreateLessonUseCase {
  constructor(
    private lessonsRepository: LessonsRepository,
    private attendanceRepository: AttendanceRepository,
  ) {}

  async execute({
    bibles,
    magazines,
    offers,
    preLessonId,
    studentsAttendance,
    title,
    trimesterRoomId,
    visitors,
  }: createLessonUseCaseRequest): Promise<createLessonUseCaseResponse> {
    const lesson = Lesson.create({
      bibles,
      magazines,
      offers,
      preLessonId: new UniqueEntityId(preLessonId),
      studentsAttendanceIds: [],
      title,
      trimesterRoomId: new UniqueEntityId(trimesterRoomId),
      visitors,
    });

    await this.lessonsRepository.create(lesson);

    for (const studentAttendance of studentsAttendance) {
      const attendance = Attendance.create({
        lessonId: lesson.id,
        present: studentAttendance.present,
        registrationId: new UniqueEntityId(studentAttendance.registrationId),
      });

      await this.attendanceRepository.create(attendance);

      lesson.studentsAttendanceIds = [
        ...lesson.studentsAttendanceIds,
        attendance.id,
      ];
    }

    await this.lessonsRepository.save(lesson);

    return right({
      lesson,
    });
  }
}
