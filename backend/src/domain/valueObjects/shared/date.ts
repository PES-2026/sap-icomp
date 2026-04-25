type DateNumber = [number, number, number]; // [day, month, year]
type DateInput = DateNumber | string | Date;

export class DateVO {
  private readonly _value: Date;

  private constructor(date: Date) {
    this._value = date;
  }

  static create(date: DateInput): DateVO {
    let dateObj: DateVO;
    if (typeof date === "string") {
      dateObj = DateVO.fromString(date);
    } else if (Array.isArray(date) && date.length === 3) {
      const [day, month, year] = date;
      dateObj = DateVO.fromDayMonthYear(day, month, year);
    } else if (date instanceof Date) {
      dateObj = DateVO.fromDate(date);
    } else {
      throw new Error(
        "Invalid date input. Must be a string, Date object, or [day, month, year] array",
      );
    }
    return dateObj;
  }

  get value(): Date {
    return this._value;
  }

  private static fromDayMonthYear(
    day: number,
    month: number,
    year: number,
  ): DateVO {
    DateVO.validateComponents(day, month, year);
    const date = new Date(year, month, day);
    DateVO.validateCoherence(date, day, month, year);
    return new DateVO(date);
  }

  private static fromString(value: string): DateVO {
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

    throw new Error(
      `Invalid date format: "${value}". Use "YYYY-MM-DD" or "MM/DD/YYYY"`,
    );
  }

  private static fromDate(date: Date): DateVO {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid Date object");
    }
    return new DateVO(new Date(date));
  }

  static today(): DateVO {
    const now = new Date();
    return new DateVO(
      new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    );
  }

  private static validateComponents(
    day: number,
    month: number,
    year: number,
  ): void {
    if (
      !Number.isInteger(day) ||
      !Number.isInteger(month) ||
      !Number.isInteger(year)
    ) {
      throw new Error("Day, month and year must be integers");
    }
    if (year < 1900 || year > 2100) {
      throw new Error(`Invalid year: ${year}`);
    }
    if (month < 1 || month > 12) {
      throw new Error(`Invalid month: ${month}. Must be between 1 and 12`);
    }
    if (day < 1 || day > 31) {
      throw new Error(`Invalid day: ${day}`);
    }
  }

  private static validateCoherence(
    date: Date,
    day: number,
    month: number,
    year: number,
  ): void {
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      throw new Error(`Non-existent date: ${month}/${day}/${year}`);
    }
  }
}
