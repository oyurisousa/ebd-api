import { Encrypter } from '@/domain/ebd/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async encrypter(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
