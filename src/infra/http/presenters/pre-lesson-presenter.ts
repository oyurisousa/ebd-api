import { PreLesson } from '@/domain/ebd/enterprise/pre-lesson';

export class PreLessonPresenter {
  static toHTTP(preLesson: PreLesson & { pendingClasses: number }) {
    return {
      prelessonId: preLesson.id,
      date: preLesson.date,
      lesson: preLesson.lesson,
      pendingClasses: preLesson.pendingClasses,
      trimesterId: preLesson.trimesterId,
      createdAt: preLesson.createdAt,
    };
  }
}
