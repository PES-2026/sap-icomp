import { NameTooLongError } from "@domain/errors/name/nameTooLongError";
import { NameTooShortError } from "@domain/errors/name/nameTooShortError";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

type NameErrors = RequiredFieldError | NameTooShortError | NameTooLongError;

export class TypeAttendanceNameVO {
  private readonly _value: string;

  private constructor(name: string) {
    this._value = name;
  }

  static create(name: string): Result<TypeAttendanceNameVO, NameErrors> {
    const validationResult = TypeAttendanceNameVO.validate(name);
    if (validationResult.isFailure) {
      return Result.fail<TypeAttendanceNameVO>(validationResult.error!);
    }
    return Result.ok<TypeAttendanceNameVO>(new TypeAttendanceNameVO(name.trim()));
  }

  static fromTrusted(name: string): TypeAttendanceNameVO {
    return new TypeAttendanceNameVO(name);
  }

  get value(): string {
    return this._value;
  }

  private static validate(name: string): Result<void, NameErrors> {
    if (typeof name !== "string" || name.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("name"));
    }
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      return Result.fail<void>(new NameTooShortError(trimmed.length));
    } else if (trimmed.length > 100) {
      return Result.fail<void>(new NameTooLongError(trimmed.length));
    }
    return Result.ok<void>();
  }
}
