import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class ConditionVO {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Result<ConditionVO, RequiredFieldError> {
    const validationResult = ConditionVO.validate(value);
    if (validationResult.isFailure) {
      return Result.fail<ConditionVO>(validationResult.error!);
    }
    return Result.ok<ConditionVO>(new ConditionVO(value));
  }

  static fromTrusted(value: string): ConditionVO {
    return new ConditionVO(value);
  }

  private static validate(value: string): Result<void> {
    if (typeof value !== "string" || value.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("condition"));
    }
    return Result.ok<void>();
  }

  get value(): string {
    return this._value;
  }
}
