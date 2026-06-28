import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class ScheduleMissedError extends ApplicationError {
  constructor(id: string) {
    super(`Schedule with ID ${id} is missed.`, ErrorCategory.BUSINESS_RULE);
  }
}
