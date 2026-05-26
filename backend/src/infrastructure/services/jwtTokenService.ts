import jwt, { SignOptions } from "jsonwebtoken";
import { ITokenService } from "../../domain/services/tokenService";

export class JwtTokenService implements ITokenService {
  private secret = process.env.JWT_SECRET || "fallback_secret_dev_only";

  generateToken(payload: string | object, expiresIn: string | number = "1d"): string {
    const options: SignOptions = {};

    if (expiresIn) {
      options.expiresIn = expiresIn as Exclude<SignOptions["expiresIn"], undefined>;
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
