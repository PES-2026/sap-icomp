import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class ScheduleCompletedError extends ApplicationError {
  constructor(id: string) {
    super(`Schedule with ID ${id} is already completed.`, ErrorCategory.BUSINESS_RULE);
  }
}
