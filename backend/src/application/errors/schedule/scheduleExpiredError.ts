import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class ScheduleExpiredError extends ApplicationError {
  constructor(id: string) {
    super(`Schedule with ID ${id} is expired.`, ErrorCategory.BUSINESS_RULE);
  }
}
