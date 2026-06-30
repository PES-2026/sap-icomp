import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AppointmentConfirmedError extends ApplicationError {
  constructor(id: string) {
    super(`Appointment with ID ${id} is already confirmed.`, ErrorCategory.BUSINESS_RULE);
  }
}
