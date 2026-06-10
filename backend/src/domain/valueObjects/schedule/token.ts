import crypto from "crypto";

import { InvalidTokenFormatError } from "@domain/errors/token/invalidTokenFormatError";
import { Result } from "@domain/shared/result";

export class TokenVO {
  private static readonly BYTE_LENGTH = 32;
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(): Result<TokenVO> {
    const value = crypto.randomBytes(TokenVO.BYTE_LENGTH).toString("hex");
    const validationResult = TokenVO.validate(value);
    if (validationResult.isFailure) {
      return Result.fail<TokenVO>(validationResult.error!);
    }
    return Result.ok(new TokenVO(value));
  }

  static validate(value: string): Result<TokenVO> {
    if (!/^[a-f0-9]{64}$/.test(value)) {
      return Result.fail(new InvalidTokenFormatError(value));
    }

    return Result.ok();
  }

  static fromTrusted(value: string): TokenVO {
    return new TokenVO(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: TokenVO): boolean {
    return crypto.timingSafeEqual(Buffer.from(this._value, "hex"), Buffer.from(other._value, "hex"));
  }

  toString(): string {
    return this._value;
  }
}
