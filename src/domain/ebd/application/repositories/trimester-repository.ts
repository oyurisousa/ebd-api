import { PaginationParams } from '@/core/repositories/pagination-params';
import { Trimester } from '../../enterprise/trimester';
import { Meta } from '@/core/repositories/meta';

export abstract class TrimestersRepository {
  abstract create(trimester: Trimester): Promise<void>;
  abstract findById(id: string): Promise<Trimester | null>;
  abstract findByQuarterAndYear(
    quarter: number,
    year: number,
  ): Promise<Trimester | null>;
  abstract findMany(
    params: PaginationParams,
    filters: {
      title?: string;
      quarter?: number;
      year?: number;
    },
  ): Promise<{ trimesters: Trimester[]; meta: Meta }>;
}
