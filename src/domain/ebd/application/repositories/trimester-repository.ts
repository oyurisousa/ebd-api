import { Trimester } from '../../enterprise/trimester';

export abstract class TrimestersRepository {
  abstract create(trimester: Trimester): Promise<void>;
  abstract findById(id: string): Promise<Trimester | null>;
}
