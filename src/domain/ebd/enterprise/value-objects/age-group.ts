export class AgeGroup {
  public readonly minAge?: number;
  public readonly maxAge?: number;
  public readonly unrestricted: boolean;

  private constructor(minAge?: number, maxAge?: number, unrestricted = false) {
    this.minAge = minAge;
    this.maxAge = maxAge;
    this.unrestricted = unrestricted;
    Object.freeze(this);
  }

  static create(minAge?: number, maxAge?: number): AgeGroup {
    if (minAge === undefined && maxAge === undefined) {
      return new AgeGroup(undefined, undefined, true);
    }

    if (!AgeGroup.isValid(minAge, maxAge)) {
      throw new Error(
        'Faixa etária inválida. A idade mínima deve ser menor ou igual à máxima, ou usar apenas idade mínima para grupos abertos (ex: 18+).',
      );
    }

    return new AgeGroup(minAge, maxAge);
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

  toString(): string {
    if (this.unrestricted) return 'Sem restrição de idade';
    return this.maxAge !== undefined
      ? `${this.minAge}-${this.maxAge}`
      : `${this.minAge}+`;
  }
}
