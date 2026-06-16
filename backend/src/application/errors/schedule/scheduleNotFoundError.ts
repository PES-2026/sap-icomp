import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class ScheduleNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`Schedule with ID ${id} was not found. Please verify it!`, ErrorCategory.NOT_FOUND);
  }
}
