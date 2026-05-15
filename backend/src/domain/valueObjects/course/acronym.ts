import { AcronymTooLongError } from "@domain/errors/course/acronymTooLongError";
import { AcronymTooShortError } from "@domain/errors/course/acronymTooShortError";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class Acronym {
  private readonly _value: string;

  constructor(name: string) {
    this._value = name;
  }

  static create(value: string): Result<Acronym> {
    if (!value) {
      return Result.fail<Acronym>(new RequiredFieldError("acronym"));
    }
    const trimmed = value.trim();
    if (trimmed.length < 1) {
      return Result.fail<Acronym>(new AcronymTooShortError(trimmed.length));
    } else if (trimmed.length > 15) {
      return Result.fail<Acronym>(new AcronymTooLongError(trimmed.length));
    }
    return Result.ok<Acronym>(new Acronym(trimmed));
  }

  get value(): string {
    return this._value;
  }
}
