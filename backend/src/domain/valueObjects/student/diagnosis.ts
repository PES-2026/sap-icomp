import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class DiagnosisVO {
  private readonly _value: string;

  private constructor(diagnosis: string) {
    this._value = diagnosis;
  }

  static create(diagnosis: string): Result<DiagnosisVO, RequiredFieldError> {
    const validationResult = DiagnosisVO.validate(diagnosis);
    if (validationResult.isFailure) {
      return Result.fail<DiagnosisVO>(validationResult.error!);
    }
    return Result.ok<DiagnosisVO>(new DiagnosisVO(diagnosis));
  }

  private static validate(value: string): Result<void> {
    if (typeof value !== "string" || value.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("diagnosis"));
    }
    return Result.ok<void>();
  }

  static fromTrusted(diagnosis: string): DiagnosisVO {
    return new DiagnosisVO(diagnosis);
  }

  get value(): string {
    return this._value;
  }
}
