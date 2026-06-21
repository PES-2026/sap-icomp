import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class ConclusionVO {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Result<ConclusionVO, RequiredFieldError> {
    const validationResult = ConclusionVO.validate(value);
    if (validationResult.isFailure) {
      return Result.fail<ConclusionVO>(validationResult.error!);
    }
    return Result.ok<ConclusionVO>(new ConclusionVO(value));
  }

  static fromTrusted(value: string): ConclusionVO {
    return new ConclusionVO(value);
  }

  private static validate(value: string): Result<void> {
    if (typeof value !== "string" || value.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("conclusion"));
    }
    return Result.ok<void>();
  }

  get value(): string {
    return this._value;
  }
}
