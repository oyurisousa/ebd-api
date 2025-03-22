import { UseCaseError } from '@/core/erros/use-case-error';

export class TrimesterRoomAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Essa sala já foi adicionada ao trimestre.`);
    this.name = 'TrimesterRoomALreadyExistsError';
  }
}
