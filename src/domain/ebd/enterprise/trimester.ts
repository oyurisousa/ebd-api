import { AggregateRoot } from '@/core/entities/aggregate-root';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';

export interface TrimesterProps {
  title: string;
  year: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Trimester extends AggregateRoot<TrimesterProps> {
  get title() {
    return this.props.title;
  }

  set title(value: string) {
    this.props.title = value;
    this.touch();
  }

  get year() {
    return this.props.year;
  }

  set year(value: number) {
    this.props.year = value;
    this.touch();
  }

  get startDate() {
    return this.props.startDate;
  }

  set startDate(value: Date) {
    this.props.startDate = value;
    this.touch();
  }

  get endDate() {
    return this.props.endDate;
  }

  set endDate(value: Date) {
    this.props.endDate = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<TrimesterProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const trimester = new Trimester(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return trimester;
  }
}
