import { Trimester } from '@/domain/ebd/enterprise/trimester';

export class TrimesterPresenter {
  static toHTTP(trimester: Trimester) {
    return {
      id: trimester.id.toString(),
      title: trimester.title,
      quarter: trimester.quarter,
      startDate: trimester.startDate,
      endDate: trimester.endDate,
      year: trimester.year,
    };
  }
}
