import { HashComparer } from '@/domain/ebd/application/cryptography/hash-compare';
import { HashGenerator } from '@/domain/ebd/application/cryptography/hash-generator';
import { compare, hash } from 'bcryptjs';

export class BcryptHasher implements HashGenerator, HashComparer {
  private SALT_ROUNDS = 8;
  async hash(plain: string): Promise<string> {
    return await hash(plain, this.SALT_ROUNDS);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash);
  }
}
