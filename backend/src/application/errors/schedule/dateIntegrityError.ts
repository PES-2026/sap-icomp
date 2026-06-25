import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class DateIntegrityError extends ApplicationError {
  constructor(date: string, actualWeekday: string, informedWeekday: string) {
    super(
      `Integrity check failed: Date ${date} is a ${actualWeekday}, but payload informed ${informedWeekday}.`,
      ErrorCategory.VALIDATION,
    );
  }
}
