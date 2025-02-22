import { UseCaseError } from '@/core/erros/use-case-error';

export class MemberNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`Não foi encontrado um membro com id "${id}" `);
    this.name = 'MemberNotFoundError';
  }
}
