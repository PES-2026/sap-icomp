import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AttendanceTimeGreatherThanZeroError extends ApplicationError {
  constructor() {
    super(`The attendance time must be greather than zero.`, ErrorCategory.VALIDATION);
  }
}
