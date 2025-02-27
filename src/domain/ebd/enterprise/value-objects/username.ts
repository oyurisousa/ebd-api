export class Username {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): Username {
    const normalized = Username.normalize(value);

    if (!Username.isValid(normalized)) {
      throw new Error(
        'Invalid username. It must be 3-30 characters long, start with a letter, and contain only letters, numbers, dots, or underscores.',
      );
    }

    return new Username(normalized);
  }

  private static normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private static isValid(value: string): boolean {
    return /^[a-z][a-z0-9._]{2,20}$/.test(value);
  }
}
