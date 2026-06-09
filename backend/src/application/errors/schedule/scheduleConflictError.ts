import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class ScheduleConflictError extends ApplicationError {
  constructor() {
    super("This time slot is unavailable or conflicts with an existing appointment.", ErrorCategory.BUSINESS_RULE);
  }
}
