import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

import { VerifyTokenResult } from "@domain/services/results/verifyTokenResult";

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

  verifyToken(token: string): VerifyTokenResult {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (typeof decoded === "string") {
        return { valid: false };
      }
      // jwt.verify returns JwtPayload | string. We expect an object with id, role and email.
      const payload = decoded as JwtPayload & { id: string; role: string; email: string };
      return { valid: true, payload };
    } catch {
      return { valid: false };
    }
  }
}
