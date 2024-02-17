import { sign, verify } from "hono/jwt";
import { inject, injectable } from "inversify";

import { Config } from "@/shared/config";

export abstract class TokenService {
  public abstract signToken(payload: any): Promise<string>;
  public abstract verifyToken(token: string): Promise<Record<string, unknown>>;
}

@injectable()
export class JwtTokenService implements TokenService {
  constructor(@inject(Config) private config: Config) {}

  public signToken(
    payload: Record<string, unknown>,
    exp?: any,
  ): Promise<string> {
    const toSignPayload = {
      ...payload,
      exp: exp || Math.floor(Date.now() / 1000) + 60 * 60,
    };

    return sign(toSignPayload, this.config.JWT_SECRET);
  }

  public verifyToken(token: string) {
    return verify(token, this.config.JWT_SECRET);
  }
}
