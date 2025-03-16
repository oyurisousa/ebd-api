import { ValueObject } from '@/core/entities/value-object';

interface AgeGroupProps {
  minAge?: number;
  maxAge?: number;
  unrestricted: boolean;
}

export class AgeGroup extends ValueObject<AgeGroupProps> {
  private constructor(props: AgeGroupProps) {
    super(props);
    Object.freeze(this);
  }

  static create(minAge?: number, maxAge?: number): AgeGroup {
    if (minAge === undefined && maxAge === undefined) {
      return new AgeGroup({ unrestricted: true });
    }

    if (!AgeGroup.isValid(minAge, maxAge)) {
      throw new Error(
        'Faixa etária inválida. A idade mínima deve ser menor ou igual à máxima, ou usar apenas idade mínima para grupos abertos (ex: 18+).',
      );
    }

    return new AgeGroup({ minAge, maxAge, unrestricted: false });
  }

  private static isValid(minAge?: number, maxAge?: number): boolean {
    if (minAge !== undefined && minAge < 0) return false;
    if (
      maxAge !== undefined &&
      (maxAge < 0 || (minAge !== undefined && maxAge < minAge))
    )
      return false;
    return true;
  }

  get minAge(): number | undefined {
    return this.props.minAge;
  }

  get maxAge(): number | undefined {
    return this.props.maxAge;
  }

  get unrestricted(): boolean {
    return this.props.unrestricted;
  }

  toString(): string {
    if (this.unrestricted) return 'Sem restrição de idade';
    return this.maxAge !== undefined
      ? `${this.minAge}-${this.maxAge}`
      : `${this.minAge}+`;
  }
}
