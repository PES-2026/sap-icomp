import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { ReasonTooLongError } from "@domain/errors/schedule/reasonTooLongError";
import { ReasonTooShortError } from "@domain/errors/schedule/reasonTooShortError";
import { Result } from "@domain/shared/result";

export class ReasonVO {
  private readonly _value: string;

  private constructor(name: string) {
    this._value = name;
  }

  static create(name: string): Result<ReasonVO> {
    const result = ReasonVO.validate(name);
    if (result.isFailure) {
      return Result.fail<ReasonVO>(result.error!);
    }
    return Result.ok<ReasonVO>(new ReasonVO(name.trim()));
  }

  static fromTrusted(name: string): ReasonVO {
    return new ReasonVO(name.trim());
  }

  get value(): string {
    return this._value;
  }

  private static validate(name: string): Result<ReasonVO> {
    if (!name) {
      return Result.fail<ReasonVO>(new RequiredFieldError("course name"));
    }

    const trimmed = name.trim();
    if (trimmed.length < 15) {
      return Result.fail<ReasonVO>(new ReasonTooShortError(trimmed.length));
    } else if (trimmed.length > 350) {
      return Result.fail<ReasonVO>(new ReasonTooLongError(trimmed.length));
    }
    return Result.ok<ReasonVO>();
  }
}
