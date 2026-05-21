import { ApplicationError } from "@application/errors/applicationError";
import { ErrorCategory } from "@domain/errors/domainError";

export class AttendanceNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`Attendance not found: '${id}'`, ErrorCategory.BUSINESS_RULE);
  }
}
