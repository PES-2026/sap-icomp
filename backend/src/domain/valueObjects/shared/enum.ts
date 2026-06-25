import { DomainError, ErrorCategory } from "@domain/errors/domainError";
import { Result } from "@domain/shared/result";

export class InvalidEnumError extends DomainError {
  constructor(value: string, enumName: string) {
    super(`The value '${value}' is not valid for enum ${enumName}`, ErrorCategory.VALIDATION);
  }
}

export abstract class EnumVO<T extends string | number> {
  protected constructor(protected readonly _value: T) {}

  get value(): T {
    return this._value;
  }

  protected static validate<T extends string | number>(
    value: unknown,
    enumObj: Record<string, T>,
    enumName: string,
  ): Result<T, InvalidEnumError> {
    if (!Object.values(enumObj).includes(value as T)) {
      return Result.fail(new InvalidEnumError(String(value), enumName));
    }
    return Result.ok(value as T);
  }

  equals(other: EnumVO<T>): boolean {
    return this._value === other.value;
  }
}
