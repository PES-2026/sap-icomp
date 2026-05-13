import { NameTooLongError } from "@domain/errors/name/nameTooLongError";
import { NameTooShortError } from "@domain/errors/name/nameTooShortError";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

type NameErrors = RequiredFieldError | NameTooShortError | NameTooLongError;

export class NameVO {
  private readonly _value: string;

  private constructor(name: string) {
    this._value = name;
  }

  static create(name: string): Result<NameVO, NameErrors> {
    const validationResult = NameVO.validate(name);
    if (validationResult.isFailure) {
      return Result.fail<NameVO>(validationResult.error!);
    }
    return Result.ok<NameVO>(new NameVO(name.trim()));
  }

  static fromTrusted(name: string): NameVO {
    return new NameVO(name);
  }

  get value(): string {
    return this._value;
  }

  private static validate(name: string): Result<void, NameErrors> {
    if (typeof name !== "string" || name.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("name"));
    }
    const trimmed = name.trim();
    if (trimmed.length < 5) {
      return Result.fail<void>(new NameTooShortError(trimmed.length));
    } else if (trimmed.length > 255) {
      return Result.fail<void>(new NameTooLongError(trimmed.length));
    }
    return Result.ok<void>();
  }
}
