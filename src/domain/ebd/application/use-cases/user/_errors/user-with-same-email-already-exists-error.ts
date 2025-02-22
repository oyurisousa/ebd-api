import { UseCaseError } from '@/core/erros/use-case-error';

export class UserWithSameEmailAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(email: string) {
    super(`Já existe uma conta registrada com o email "${email}" `);
    this.name = 'UserWithSameEmailAlreadyExistsError';
  }
}
