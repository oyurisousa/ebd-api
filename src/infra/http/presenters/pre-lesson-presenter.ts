import { PreLesson } from '@/domain/ebd/enterprise/pre-lesson';

export class PreLessonPresenter {
  static toHTTP(preLesson: PreLesson & { pendingClasses: number }) {
    return {
      prelessonId: preLesson.id.toString(),
      date: preLesson.date,
      lesson: preLesson.lesson,
      pendingClasses: preLesson.pendingClasses,
      trimesterId: preLesson.trimesterId.toString(),
      createdAt: preLesson.createdAt,
    };
  }
}
