import { UseCaseError } from '@/core/erros/use-case-error';

export class RoomAlreadyExistsError extends Error implements UseCaseError {
  constructor(name: string) {
    super(`Já existe uma sala "${name}"!`);
  }
}
