import jwt, { SignOptions } from "jsonwebtoken";
import { ITokenService } from "../../domain/services/tokenService";
import { env } from "../config/env";

export class JwtTokenService implements ITokenService {
  private secret = env.JWT_SECRET;
  private expiresDefault = env.JWT_TOKEN_EXPIRES;

  generateToken(payload: string | object): string {
    const options: SignOptions = {};

    const expiration = this.expiresDefault;

    if (expiration) {
      options.expiresIn = expiration as Exclude<SignOptions["expiresIn"], undefined>;
    }

    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): any | null {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }
}
