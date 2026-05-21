import { CidTooLongError } from "@domain/errors/diagnosis/cidTooLongError";
import { CidTooShortError } from "@domain/errors/diagnosis/cidTooShortError";
import { InvalidCidFormatError } from "@domain/errors/diagnosis/invalidCidFormatError";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

type CidErrors = RequiredFieldError | CidTooShortError | CidTooLongError | InvalidCidFormatError;

export class CidVO {
  private readonly _value: string;

  private constructor(cid: string) {
    this._value = cid;
  }

  static create(cid: string): Result<CidVO, CidErrors> {
    const validationResult = CidVO.validate(cid);
    if (validationResult.isFailure) {
      return Result.fail<CidVO>(validationResult.error as CidErrors);
    }
    return Result.ok<CidVO>(new CidVO(cid.trim().toUpperCase()));
  }

  static fromTrusted(cid: string): CidVO {
    return new CidVO(cid);
  }

  get value(): string {
    return this._value;
  }

  private static validate(cid: string): Result<void, CidErrors> {
    if (typeof cid !== "string" || cid.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("cid"));
    }
    const trimmed = cid.trim();

    if (trimmed.length < 3) {
      return Result.fail<void>(new CidTooShortError(trimmed.length));
    } else if (trimmed.length > 10) {
      return Result.fail<void>(new CidTooLongError(trimmed.length));
    }

    // Basic validation for ICD-10 and ICD-11
    // ICD-10: Letter followed by 2 or 3 numbers, optionally a dot and another number (e.g., F90.0)
    // ICD-11: More complex format, but generally alphanumeric with dots
    const cidRegex = /^[A-Z][0-9A-Z]{2,}(\.[0-9A-Z]{1,})?$/i;
    if (!cidRegex.test(trimmed)) {
      return Result.fail<void>(new InvalidCidFormatError(trimmed));
    }

    return Result.ok<void>();
  }
}
