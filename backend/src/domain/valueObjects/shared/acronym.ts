import { AcronymTooLongError } from "@domain/errors/diagnosis/acronymTooLongError";
import { AcronymTooShortError } from "@domain/errors/diagnosis/acronymTooShortError";
import { InvalidAcronymFormatError } from "@domain/errors/diagnosis/invalidAcronymFormatError";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

type AcronymErrors = RequiredFieldError | AcronymTooShortError | AcronymTooLongError | InvalidAcronymFormatError;

export class AcronymVO {
  private readonly _value: string;

  private constructor(acronym: string) {
    this._value = acronym;
  }

  static create(acronym: string): Result<AcronymVO, AcronymErrors> {
    const validationResult = AcronymVO.validate(acronym);
    if (validationResult.isFailure) {
      return Result.fail<AcronymVO>(validationResult.error as AcronymErrors);
    }
    return Result.ok<AcronymVO>(new AcronymVO(acronym.trim().toUpperCase()));
  }

  static fromTrusted(acronym: string): AcronymVO {
    return new AcronymVO(acronym);
  }

  get value(): string {
    return this._value;
  }

  private static validate(acronym: string): Result<void, AcronymErrors> {
    if (typeof acronym !== "string" || acronym.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("acronym"));
    }
    const trimmed = acronym.trim();
    if (trimmed.length < 2) {
      return Result.fail<void>(new AcronymTooShortError(trimmed.length));
    } else if (trimmed.length > 10) {
      return Result.fail<void>(new AcronymTooLongError(trimmed.length));
    }

    const acronymRegex = /^[A-Z0-9.\-/]+$/i;
    if (!acronymRegex.test(trimmed)) {
      return Result.fail<void>(new InvalidAcronymFormatError(trimmed));
    }

    return Result.ok<void>();
  }
}
