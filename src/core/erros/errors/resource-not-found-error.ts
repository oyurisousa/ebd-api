import { UseCaseError } from '../use-case-error';

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(message?: string) {
    if (message) {
      super(message);
    } else {
      super('Resource not found!');
    }
  }
}
