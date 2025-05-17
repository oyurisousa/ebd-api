import { UseCaseError } from '@/core/erros/use-case-error';

export class PreLessonWithSameNumberLessonAlreadyExistsOnTrimesterError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Já existe um registro com o mesmo número de aula neste trimestre!`);
  }
}
