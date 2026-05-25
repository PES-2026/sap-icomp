import { DomainError } from "../errors/domainError";

export class Result<T, Error extends DomainError = DomainError> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: Error | DomainError | string | null;
  private _value: T | null;

  private constructor(isSuccess: boolean, error?: DomainError | string | null, value?: T | null) {
    if (isSuccess && error) {
      throw new Error("Invalid Operation: A result cannot be successful and contain an error.");
    }
    if (!isSuccess && !error) {
      throw new Error("Invalid Operation: A failing result needs to contain an error message.");
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error || null;
    this._value = value !== undefined ? value : null;
  }

  public getValue(printOnError: boolean = true): T {
    if (!this.isSuccess) {
      if (printOnError) {
        console.log(this.error);
      }
      throw new Error("Can't get the value of an error result. Use 'isSuccess' before calling 'getValue()'.");
    }
    return this._value as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: DomainError | string): Result<U> {
    return new Result<U>(false, error);
  }
}
