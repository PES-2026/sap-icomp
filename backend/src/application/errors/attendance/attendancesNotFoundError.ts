import { ApplicationError } from "@application/errors/applicationError";
import { ErrorCategory } from "@domain/errors/domainError";

export class AttendancesNotFoundError extends ApplicationError {
  constructor(studentId: string) {
    super(`Attendances not found for student: '${studentId}'`, ErrorCategory.BUSINESS_RULE);
  }
}
