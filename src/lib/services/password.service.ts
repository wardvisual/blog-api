import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly salt: number;

  constructor() {
    this.salt = 10;
  }

  encrypt(password: string): string {
    return bcrypt.hashSync(password, this.salt);
  }

  decrypt(password: string, hashed: string): boolean {
    return bcrypt.compareSync(password, hashed);
  }
}
