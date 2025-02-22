import { UseCaseError } from '@/core/erros/use-case-error';

export class UserWithSameUsernameAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(username: string) {
    super(`Já existe uma conta registrada com o username "${username}" `);
    this.name = 'UserWithSameUsernameAlreadyExistsError';
  }
}
