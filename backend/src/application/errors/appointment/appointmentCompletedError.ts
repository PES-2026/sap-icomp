import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AppointmentCompletedError extends ApplicationError {
  constructor(id: string) {
    super(`Appointment with ID ${id} is already completed.`, ErrorCategory.BUSINESS_RULE);
  }
}
