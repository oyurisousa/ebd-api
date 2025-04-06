import { UseCaseError } from '@/core/erros/use-case-error';

export class QuarterAlreadyExistsInYearError
  extends Error
  implements UseCaseError
{
  constructor(quarter: number, year: number) {
    super(`Já existe um trimestre "${quarter}" para o ano de "${year}" `);
    this.name = 'QuarterAlreadyExistsInYearError';
  }
}
