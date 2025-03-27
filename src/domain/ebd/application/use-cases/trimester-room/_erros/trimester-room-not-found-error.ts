import { UseCaseError } from '@/core/erros/use-case-error';

export class TrimesterRoomNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`Não existe uma sala ${id} para o trimester`);
    this.name = 'TrimesterRoomNotFoundError';
  }
}
