import { TrimesterRoom } from '../../enterprise/trimester-room';

export abstract class TrimestersRoomsRepository {
  abstract create(trimesterRoom: TrimesterRoom): Promise<void>;
  abstract findByTrimesterIdAndRooId(
    trimesterId: string,
    roomId: string,
  ): Promise<TrimesterRoom | null>;
}
