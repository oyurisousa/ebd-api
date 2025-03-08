import { UniqueEntityId } from '@/core/entities/unique-entity-id';
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
}
