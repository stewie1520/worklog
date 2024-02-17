import bcrypt from "bcrypt";
import { injectable } from "inversify";

export abstract class PasswordService {
  public abstract hashPassword(password: string): Promise<string>;
  public abstract comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean>;
}

@injectable()
export class BcryptPasswordService implements PasswordService {
  public async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  public async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
