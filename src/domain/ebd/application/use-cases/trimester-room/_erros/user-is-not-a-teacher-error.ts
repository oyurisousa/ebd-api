import { UseCaseError } from '@/core/erros/use-case-error';

export class UserIsNotATeacherError extends Error implements UseCaseError {
  constructor() {
    super(`O uusário deve ser um "Professor"`);
    this.name = 'UserIsNotATeacherError';
  }
}
