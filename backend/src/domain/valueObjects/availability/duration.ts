import { DurationLessThanZeroError } from "@domain/errors/duration/durationLessThanZeroError";
import { InvalidDurationFormatError } from "@domain/errors/duration/invalidDurationFormatError";
import { Result } from "@domain/shared/result";

export class DurationVO {
  private readonly _value: number;

  private constructor(minutes: number) {
    this._value = minutes;
  }

  static create(minutes: number): Result<DurationVO> {
    if (!Number.isInteger(minutes) || minutes < 0) {
      return Result.fail<DurationVO>(new DurationLessThanZeroError(minutes));
    }
    return Result.ok<DurationVO>(new DurationVO(minutes));
  }

  static fromString(time: string): Result<DurationVO> {
    const timeRegex = /^([0-9]{1,2}):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return Result.fail<DurationVO>(new InvalidDurationFormatError(time));
    }

    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = (hours ?? 0) * 60 + (minutes ?? 0);
    return Result.ok<DurationVO>(new DurationVO(totalMinutes));
  }

  static fromTrusted(minutes: number): DurationVO {
    return new DurationVO(minutes);
  }

  get value(): number {
    return this._value;
  }
}
