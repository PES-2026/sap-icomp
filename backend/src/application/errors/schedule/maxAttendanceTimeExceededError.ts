import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class MaxAttendanceTimeExceededError extends ApplicationError {
  constructor(maxMinutes: number) {
    super(
      `Session duration exceeds the limit set by the pedagogue (${maxMinutes} minutes).`,
      ErrorCategory.BUSINESS_RULE,
    );
  }
}
