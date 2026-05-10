import { DateInput } from "@domain/valueObjects/shared/date";
import { DomainError, ErrorCategory } from "../domainError";

export class DateInputError extends DomainError {
  constructor(value: DateInput) {
    super(
      `Invalid date input. Must be a string, Date object, or [day, month, year] array, the actual value is : ${value}`,
      ErrorCategory.VALIDATION,
    );
  }
}
