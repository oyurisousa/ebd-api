import { UseCaseError } from '../use-case-error';

export class ForbiddenError extends Error implements UseCaseError {
  constructor(message: string = 'You do not have access to this resource') {
    super(message);
  }
}
