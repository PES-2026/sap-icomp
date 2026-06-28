import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class RecommendationVO {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Result<RecommendationVO, RequiredFieldError> {
    const validationResult = RecommendationVO.validate(value);
    if (validationResult.isFailure) {
      return Result.fail<RecommendationVO>(validationResult.error!);
    }
    return Result.ok<RecommendationVO>(new RecommendationVO(value));
  }

  static fromTrusted(value: string): RecommendationVO {
    return new RecommendationVO(value);
  }

  private static validate(value: string): Result<void> {
    if (typeof value !== "string" || value.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("recommendation"));
    }
    return Result.ok<void>();
  }

  get value(): string {
    return this._value;
  }
}
