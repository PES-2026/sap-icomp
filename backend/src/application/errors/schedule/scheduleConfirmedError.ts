import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class ScheduleConfirmedError extends ApplicationError {
  constructor(id: string) {
    super(`Schedule with ID ${id} is already confirmed.`, ErrorCategory.BUSINESS_RULE);
  }
}
