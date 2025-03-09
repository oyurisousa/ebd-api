import { Trimester } from '../../enterprise/trimester';

export abstract class TrimestersRepository {
  abstract create(trimester: Trimester): Promise<void>;
  abstract findById(id: string): Promise<Trimester | null>;
  abstract findByQuarterAndYear(
    quarter: number,
    year: number,
  ): Promise<Trimester | null>;
}
