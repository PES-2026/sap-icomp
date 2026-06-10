import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class PotentialVO {
  private readonly _value: string;

  private constructor(potential: string) {
    this._value = potential;
  }

  static create(potential: string): Result<PotentialVO, RequiredFieldError> {
    const validationResult = PotentialVO.validate(potential);
    if (validationResult.isFailure) {
      return Result.fail<PotentialVO>(validationResult.error!);
    }
    return Result.ok<PotentialVO>(new PotentialVO(potential));
  }

  static fromTrusted(potential: string): PotentialVO {
    return new PotentialVO(potential);
  }

  get value(): string {
    return this._value;
  }

  private static validate(value: string): Result<void> {
    if (typeof value !== "string" || value.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("potential"));
    }
    return Result.ok<void>();
  }
}
