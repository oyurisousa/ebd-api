export abstract class Encrypter {
  abstract encrypter(payload: Record<string, unknown>): Promise<string>;
}
