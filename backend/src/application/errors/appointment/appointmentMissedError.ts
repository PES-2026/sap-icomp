import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AppointmentMissedError extends ApplicationError {
  constructor(id: string) {
    super(`Appointment with ID ${id} is missed.`, ErrorCategory.BUSINESS_RULE);
  }
}
