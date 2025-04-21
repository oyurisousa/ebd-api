import type { RegistrationWithName } from '@/domain/ebd/enterprise/value-objects/registration-with-name';

export class RegistrationPresenter {
  static toHTTP(registration: RegistrationWithName) {
    return {
      memberId: registration.studentId.toString(),
      name: registration.name,
      registrationId: registration.id.toString(),
    };
  }
}
