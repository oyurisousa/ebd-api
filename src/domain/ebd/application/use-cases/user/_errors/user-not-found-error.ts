import { UseCaseError } from '@/core/erros/use-case-error';

export class UserNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`Usuário com id ${id} não foi encontrado`);
  }
}
