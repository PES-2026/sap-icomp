import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class DifficultiesVO {
  private readonly _value: string;

  private constructor(difficulties: string) {
    this._value = difficulties;
  }

  static create(difficulties: string): Result<DifficultiesVO, RequiredFieldError> {
    const validationResult = DifficultiesVO.validate(difficulties);
    if (validationResult.isFailure) {
      return Result.fail<DifficultiesVO>(validationResult.error!);
    }
    return Result.ok<DifficultiesVO>(new DifficultiesVO(difficulties));
  }

  static fromTrusted(difficulties: string): DifficultiesVO {
    return new DifficultiesVO(difficulties);
  }

  private static validate(value: string): Result<void> {
    if (typeof value !== "string" || value.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("difficulties"));
    }
    return Result.ok<void>();
  }

  get value(): string {
    return this._value;
  }
}
