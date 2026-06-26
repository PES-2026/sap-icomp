import { ReasonTooLongError } from "@domain/errors/appointment/reasonTooLongError";
import { ReasonTooShortError } from "@domain/errors/appointment/reasonTooShortError";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class ReasonVO {
  private readonly _value: string;

  private constructor(name: string) {
    this._value = name;
  }

  static create(reason: string): Result<ReasonVO> {
    const result = ReasonVO.validate(reason);
    if (result.isFailure) {
      return Result.fail<ReasonVO>(result.error!);
    }
    return Result.ok<ReasonVO>(new ReasonVO(reason.trim()));
  }

  static fromTrusted(name: string): ReasonVO {
    return new ReasonVO(name.trim());
  }

  get value(): string {
    return this._value;
  }

  private static validate(reason: string): Result<ReasonVO> {
    if (!reason) {
      return Result.fail<ReasonVO>(new RequiredFieldError("reason"));
    }

    const trimmed = reason.trim();
    if (trimmed.length < 15) {
      return Result.fail<ReasonVO>(new ReasonTooShortError(trimmed.length));
    } else if (trimmed.length > 350) {
      return Result.fail<ReasonVO>(new ReasonTooLongError(trimmed.length));
    }
    return Result.ok<ReasonVO>();
  }
}
