import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class GeneralObservationsVO {
  private readonly _value: string;

  private constructor(generalObservations: string) {
    this._value = generalObservations;
  }

  static create(generalObservations: string): Result<GeneralObservationsVO, RequiredFieldError> {
    const validationResult = GeneralObservationsVO.validate(generalObservations);
    if (validationResult.isFailure) {
      return Result.fail<GeneralObservationsVO>(validationResult.error!);
    }
    return Result.ok<GeneralObservationsVO>(new GeneralObservationsVO(generalObservations));
  }

  static fromTrusted(generalObservations: string): GeneralObservationsVO {
    return new GeneralObservationsVO(generalObservations);
  }

  get value(): string {
    return this._value;
  }

  private static validate(string: string): Result<void> {
    if (typeof string !== "string" || string.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("general observations"));
    }
    return Result.ok<void>();
  }
}
