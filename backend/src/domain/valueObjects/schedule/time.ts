import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { TimeLessThanZeroError } from "@domain/errors/time/timeLessThanZeroError";
import { TimeMustBeANumberError } from "@domain/errors/time/timeMustBeANumberError";
import { Result } from "@domain/shared/result";

type TimeErrors = RequiredFieldError | TimeLessThanZeroError | TimeMustBeANumberError;

export class TimeVO {
  private readonly _value: number;

  private constructor(minutes: number) {
    this._value = minutes;
  }

  static create(minutes: number): Result<TimeVO, TimeErrors> {
    const validationResult = TimeVO.validate(minutes);
    if (validationResult.isFailure) {
      return Result.fail<TimeVO>(validationResult.error as TimeErrors);
    }
    return Result.ok<TimeVO>(new TimeVO(minutes));
  }

  static fromTrusted(minutes: number): TimeVO {
    return new TimeVO(minutes);
  }

  get value(): number {
    return this._value;
  }

  private static validate(minutes: number): Result<void, TimeErrors> {
    if (!Number.isInteger(minutes)) {
      return Result.fail<void>(new TimeMustBeANumberError());
    }

    if (minutes < 0) {
      return Result.fail<void>(new TimeLessThanZeroError(minutes));
    }

    return Result.ok<void>();
  }
}
