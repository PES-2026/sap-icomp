import { DomainError, ErrorCategory } from "../domainError";

export class DayMonthYearTypeError extends DomainError {
  constructor(day: number, month: number, year: number) {
    super(
      `Day, month and year must be integers, the actual values are: ${day}, ${month}, ${year}`,
      ErrorCategory.VALIDATION,
    );
  }
}
