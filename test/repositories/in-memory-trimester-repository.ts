import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Meta } from '@/core/repositories/meta';
import {
  PER_PAGE_DEFAULT,
  type PaginationParams,
} from '@/core/repositories/pagination-params';
import { TrimestersRepository } from '@/domain/ebd/application/repositories/trimester-repository';
import { Trimester } from '@/domain/ebd/enterprise/trimester';

export class InMemoryTrimestersRepository implements TrimestersRepository {
  public items: Trimester[] = [];
  async create(trimester: Trimester): Promise<void> {
    this.items.push(trimester);
  }

  async findById(id: string): Promise<Trimester | null> {
    const trimester = this.items.find((trimester) => {
      return trimester.id.equal(new UniqueEntityId(id));
    });

    if (!trimester) return null;

    return trimester;
  }

  async findByQuarterAndYear(
    quarter: number,
    year: number,
  ): Promise<Trimester | null> {
    const trimester = this.items.find((trimester) => {
      return trimester.quarter === quarter && trimester.year === year;
    });

    if (!trimester) return null;

    return trimester;
  }

  async findMany(
    { page, perPage = PER_PAGE_DEFAULT }: PaginationParams,
    filters: { title?: string; quarter?: number; year?: number },
  ): Promise<{ trimesters: Trimester[]; meta: Meta }> {
    const { quarter, title, year } = filters;

    const trimestersFiltered = this.items
      .filter((trimester) => {
        if (
          title &&
          !trimester.title.toLowerCase().includes(title.toLowerCase())
        )
          return false;

        if (year && !(trimester.year === year)) return false;

        if (quarter && trimester.quarter !== quarter) return false;

        return trimester;
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;

        return a.quarter - b.quarter;
      });

    const trimestersPaginated = trimestersFiltered.slice(
      (page - 1) * perPage,
      page * perPage,
    );

    return {
      trimesters: trimestersPaginated,
      meta: {
        page,
        totalCount: trimestersFiltered.length,
        totalPage: trimestersPaginated.length,
      },
    };
  }
}
