import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class ScheduleCancelledByStudentError extends ApplicationError {
  constructor(id: string, studentName: string) {
    super(`Schedule with ID ${id} was cancelled by student: '${studentName}'`, ErrorCategory.BUSINESS_RULE);
  }
}
