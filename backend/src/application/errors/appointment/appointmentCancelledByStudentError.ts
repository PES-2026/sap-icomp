import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AppointmentCancelledByStudentError extends ApplicationError {
  constructor(id: string, studentName: string) {
    super(`Appointment with ID ${id} was cancelled by student: '${studentName}'`, ErrorCategory.BUSINESS_RULE);
  }
}
