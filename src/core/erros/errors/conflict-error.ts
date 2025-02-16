import { UseCaseError } from '../use-case-error';

export class ConflictError extends Error implements UseCaseError {
  constructor() {
    super('Conflict Error');
  }
}
