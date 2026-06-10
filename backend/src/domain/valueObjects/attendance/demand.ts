import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class DemandVO {
  private readonly _value: string;

  private constructor(demand: string) {
    this._value = demand;
  }

  static create(value: string): Result<DemandVO, RequiredFieldError> {
    const validationResult = DemandVO.validate(value);
    if (validationResult.isFailure) {
      return Result.fail<DemandVO>(validationResult.error!);
    }
    return Result.ok<DemandVO>(new DemandVO(value));
  }

  static fromTrusted(demand: string): DemandVO {
    return new DemandVO(demand);
  }

  private static validate(value: string): Result<void> {
    if (typeof value !== "string" || value.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("demand"));
    }
    return Result.ok<void>();
  }

  get value(): string {
    return this._value;
  }
}
