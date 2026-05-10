import { DateInputError } from "@domain/errors/date/dateInput";
import { DateObjectError } from "@domain/errors/date/dateObject";
import { DayMonthYearTypeError } from "@domain/errors/date/dayMonthYearType";
import { InvalidDateFormat } from "@domain/errors/date/invalidDateFormat";
import { InvalidDayError } from "@domain/errors/date/invalidDay";
import { InvalidMonthError } from "@domain/errors/date/invalidMonth";
import { InvalidYearError } from "@domain/errors/date/invalidYear";
import { NonExistingDateError } from "@domain/errors/date/nonExistentDate";
import { Result } from "@domain/shared/result";

type DateNumber = [number, number, number]; // [day, month, year]
export type DateInput = DateNumber | string | Date;
type DateErrors =
  | DateInputError
  | DateObjectError
  | DayMonthYearTypeError
  | InvalidDateFormat
  | InvalidDayError
  | InvalidMonthError
  | InvalidYearError
  | NonExistingDateError;

export class DateVO {
  private readonly _value: Date;

  private constructor(date: Date) {
    this._value = date;
  }

  static create(date: DateInput): Result<DateVO, DateErrors> {
    if (typeof date === "string") {
      return DateVO.fromString(date);
    } else if (Array.isArray(date) && date.length === 3) {
      const [day, month, year] = date;
      return DateVO.fromDayMonthYear(day, month, year);
    } else if (date instanceof Date) {
      return DateVO.fromDate(date);
    } else {
      return Result.fail<DateVO>(new DateInputError(date));
    }
  }

  static fromTrusted(date: Date): DateVO {
    return new DateVO(date);
  }

  get value(): Date {
    return this._value;
  }

  private static fromDayMonthYear(day: number, month: number, year: number): Result<DateVO> {
    const componentsResult = DateVO.validateComponents(day, month, year);
    if (componentsResult.isFailure) return Result.fail<DateVO>(componentsResult.error!);

    const date = new Date(year, month, day);
    const coherenceResult = DateVO.validateCoherence(date, day, month, year);
    if (coherenceResult.isFailure) return Result.fail<DateVO>(coherenceResult.error!);

    return Result.ok<DateVO>(new DateVO(date));
  }

  private static fromString(value: string): Result<DateVO, DateErrors> {
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
    const usRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (isoRegex.test(value)) {
      const parts = value.split("-").map(Number);
      const [year, month, day] = parts as [number, number, number];
      return DateVO.fromDayMonthYear(day, month, year);
    }

    if (usRegex.test(value)) {
      const parts = value.split("/").map(Number);
      const [month, day, year] = parts as [number, number, number];
      return DateVO.fromDayMonthYear(day, month, year);
    }

    return Result.fail<DateVO>(new InvalidDateFormat(value));
  }

  private static fromDate(date: Date): Result<DateVO, DateObjectError> {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return Result.fail<DateVO>(new DateObjectError(date));
    }
    return Result.ok<DateVO>(new DateVO(new Date(date)));
  }

  static today(): Result<DateVO> {
    const now = new Date();
    return Result.ok<DateVO>(new DateVO(new Date(now.getFullYear(), now.getMonth(), now.getDate())));
  }

  private static validateComponents(day: number, month: number, year: number): Result<void, DateErrors> {
    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
      return Result.fail<void>(new DayMonthYearTypeError(day, month, year));
    }
    if (year < 1900 || year > 2100) {
      return Result.fail<void>(new InvalidYearError(year));
    }
    if (month < 1 || month > 12) {
      return Result.fail<void>(new InvalidMonthError(month));
    }
    if (day < 1 || day > 31) {
      return Result.fail<void>(new InvalidDayError(day));
    }
    return Result.ok<void>();
  }

  private static validateCoherence(
    date: Date,
    day: number,
    month: number,
    year: number,
  ): Result<void, NonExistingDateError> {
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return Result.fail<void>(new NonExistingDateError(day, month, year));
    }
    return Result.ok<void>();
  }
}
