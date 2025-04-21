import { UseCaseError } from '@/core/erros/use-case-error';

export class TrimesterRoomAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(roomId: string) {
    super(`A sala com ID ${roomId} já foi adicionada ao trimestre.`);
    this.name = 'TrimesterRoomAlreadyExistsError';
  }
}
